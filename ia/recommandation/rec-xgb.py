import pandas as pd
import numpy as np
import joblib
import os
from sqlalchemy import create_engine
import oracledb
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import precision_score, recall_score
from xgboost import XGBClassifier
import random

# Connexion Oracle
oracledb.init_oracle_client(lib_dir=r"C:\\oraclexe\\instantclient_19_26")
engine = create_engine("oracle+oracledb://system:0000@127.0.0.1:1521/xe")

# Chargement des données
query = """
SELECT
    u.cli AS cli,
    t.produit AS produit,
    t.categorie_transaction AS categorie
FROM transaction t
JOIN compt_bancaire cb ON t.compt_id = cb.id
JOIN utilisateur u ON cb.user_id = u.id
WHERE t.date_trans IS NOT NULL
"""
df = pd.read_sql(query, engine)
df.columns = [c.lower() for c in df.columns]

# Positifs
positifs = df[['cli', 'produit']].drop_duplicates()
positifs['interacted'] = 1

# Négatifs
clients = df['cli'].unique()
produits = df['produit'].unique()
negatifs = []
for cli in clients:
    produits_utilises = df[df['cli'] == cli]['produit'].tolist()
    produits_non = list(set(produits) - set(produits_utilises))
    for prod in random.sample(produits_non, min(3, len(produits_non))):
        negatifs.append((cli, prod, 0))
negatifs_df = pd.DataFrame(negatifs, columns=["cli", "produit", "interacted"])

# Dataset final
full_df = pd.concat([positifs, negatifs_df], ignore_index=True)
full_df = full_df.merge(df[['produit', 'categorie']].drop_duplicates(), on='produit', how='left')

# Encodage
enc_cli = LabelEncoder()
enc_prod = LabelEncoder()
enc_cat = LabelEncoder()

X = pd.DataFrame({
    "cli": enc_cli.fit_transform(full_df['cli']),
    "produit": enc_prod.fit_transform(full_df['produit']),
    "categorie": enc_cat.fit_transform(full_df['categorie'].fillna("inconnue"))
})
y = full_df['interacted']

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# GridSearchCV XGBoost
param_grid = {
    'n_estimators': [100],
    'max_depth': [5],
    'learning_rate': [0.3],
    'subsample': [1.0]
}
grid_search = GridSearchCV(
    estimator=XGBClassifier(eval_metric='logloss', random_state=42),
    param_grid=param_grid,
    scoring='precision',
    cv=3,
    verbose=1,
    n_jobs=-1
)
grid_search.fit(X_train, y_train)
model = grid_search.best_estimator_

# Évaluation
y_pred = model.predict(X_test)
print("✅ Précision :", precision_score(y_test, y_pred))
print("✅ Rappel :", recall_score(y_test, y_pred))
print("🔧 Meilleurs paramètres :", grid_search.best_params_)

os.makedirs("models", exist_ok=True)
# Sauvegarde des composants
joblib.dump(model, "models/xgb_model.pkl")
joblib.dump(enc_cli, "models/enc_cli.pkl")
joblib.dump(enc_prod, "models/enc_prod.pkl")
joblib.dump(enc_cat, "models/enc_cat.pkl")
df.to_csv("transactions.csv", index=False)
print("📁 Modèle et encodeurs sauvegardés avec succès.")
