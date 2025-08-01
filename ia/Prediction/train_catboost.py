import pandas as pd
import numpy as np
from catboost import CatBoostRegressor, Pool
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
import oracledb

# Oracle
oracledb.init_oracle_client(lib_dir=r"C:\oraclexe\instantclient_19_26")
conn = oracledb.connect(user='system', password='0000', dsn='127.0.0.1:1521/xe')

# SQL
query = """
SELECT
    t.id AS TRANSACTION_ID,
    t."DATE_TRANS" AS DOU,
    t.montant AS MON,
    u.cli AS CLI,
    t.categorie_transaction AS CATEGORIE
FROM "TRANSACTION" t
JOIN "COMPT_BANCAIRE" cb ON t.compt_id = cb.id
JOIN "UTILISATEUR" u ON cb.user_id = u.id
WHERE t."DATE_TRANS" IS NOT NULL
"""

df = pd.read_sql(query, conn)
conn.close()

# Prétraitement
df['DOU'] = pd.to_datetime(df['DOU'], errors='coerce')
df['Année'] = df['DOU'].dt.year
df['Mois'] = df['DOU'].dt.month
df['MON_clean'] = df['MON'].astype(str).str.replace(',', '.').str.replace(' ', '')
df['MON_float'] = pd.to_numeric(df['MON_clean'], errors='coerce')
df = df.dropna(subset=['MON_float', 'DOU', 'Année', 'Mois', 'CLI', 'CATEGORIE'])

# Agrégation mensuelle
df_agg = df.groupby(['CLI', 'CATEGORIE', 'Année', 'Mois'], as_index=False)['MON_float'].sum()
df_agg['Mois_sin'] = np.sin(2 * np.pi * df_agg['Mois'] / 12)
df_agg['Mois_cos'] = np.cos(2 * np.pi * df_agg['Mois'] / 12)

# Moyennes
df_agg['client_month_avg'] = df_agg.groupby('CLI')['MON_float'].transform('mean')
df_agg['cat_month_avg'] = df_agg.groupby('CATEGORIE')['MON_float'].transform('mean')

# Suppression des gros outliers
df_agg = df_agg[df_agg['MON_float'] < 1_000_000]

# Features finales
features = ['Année', 'Mois', 'Mois_sin', 'Mois_cos', 'CLI', 'CATEGORIE', 'client_month_avg', 'cat_month_avg']
target = 'MON_float'

X = df_agg[features]
y = np.log1p(df_agg[target])  # log pour réduire l'effet des gros montants

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Colonnes catégorielles
cat_features = ['CLI', 'CATEGORIE']

# Pool CatBoost
train_pool = Pool(X_train, y_train, cat_features=cat_features)
test_pool = Pool(X_test, y_test, cat_features=cat_features)

# Modèle
model = CatBoostRegressor(
    iterations=200,
    depth=6,
    learning_rate=0.1,
    loss_function='RMSE',
    eval_metric='RMSE',
    random_seed=42,
    verbose=50
)

# Entraînement
model.fit(train_pool, eval_set=test_pool, use_best_model=True)

# Prédiction
y_pred_log = model.predict(X_test)
y_pred = np.expm1(y_pred_log)
y_true = np.expm1(y_test)

# Évaluation
mse = mean_squared_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)
print(f"\n✅ CatBoost RMSE : {mse:.2f}")
print(f"📈 CatBoost R²   : {r2:.4f}")

# Sauvegarde
os.makedirs('./saved_models1', exist_ok=True)
model.save_model('./saved_models1/model_catboost.cbm')
df_agg[['CLI', 'CATEGORIE']].drop_duplicates().to_csv('saved_models1/client_cat_pairs.csv', index=False, encoding='utf-8')
print("💾 Modèle CatBoost sauvegardé.")
