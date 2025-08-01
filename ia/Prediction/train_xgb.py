import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import oracledb
import xgboost as xgb
import os

# Initialiser Oracle
oracledb.init_oracle_client(lib_dir=r"C:\oraclexe\instantclient_19_26")
conn = oracledb.connect(user='system', password='0000', dsn='127.0.0.1:1521/xe')

# Charger données
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

# Nettoyage
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

# Moyennes statistiques
df_agg['client_month_avg'] = df_agg.groupby('CLI')['MON_float'].transform('mean')
df_agg['cat_month_avg'] = df_agg.groupby('CATEGORIE')['MON_float'].transform('mean')

# Encodage
le_cli = LabelEncoder()
le_cat = LabelEncoder()
df_agg['CLI_enc'] = le_cli.fit_transform(df_agg['CLI'])
df_agg['Cat_enc'] = le_cat.fit_transform(df_agg['CATEGORIE'])

# Suppression outliers
q_high = df_agg['MON_float'].quantile(0.99)
df_agg = df_agg[df_agg['MON_float'] <= q_high]

# Dataset final
X = df_agg[['Année', 'Mois', 'Mois_sin', 'Mois_cos', 'CLI_enc', 'Cat_enc', 'client_month_avg', 'cat_month_avg']]
y = df_agg['MON_float']
y_log = np.log1p(y)

# Split aligné
X_train, X_test, y_train_log, y_test_log = train_test_split(X, y_log, test_size=0.2, random_state=42)
y_train = np.expm1(y_train_log)
y_test = np.expm1(y_test_log)

# Modèle XGBoost
xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
param_grid = {
    'n_estimators': [50, 100],
    'max_depth': [3, 5],
    'learning_rate': [0.1],
    'subsample': [0.8],
    'colsample_bytree': [0.8],
}

grid = GridSearchCV(xgb_model, param_grid, cv=3, scoring='neg_mean_squared_error', verbose=1, n_jobs=-1)
grid.fit(X_train, y_train_log)

best_model = grid.best_estimator_
print(f"\n✅ Meilleurs paramètres : {grid.best_params_}")

# Évaluation
y_pred_log = best_model.predict(X_test)
y_pred = np.expm1(y_pred_log)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"📊 MSE : {mse:.2f}")
print(f"📈 R² : {r2:.4f}")

# Sauvegarde
os.makedirs('saved_models', exist_ok=True)
joblib.dump(best_model, 'saved_models/model_global.pkl')
joblib.dump(le_cli, 'saved_models/label_encoder_client.pkl')
joblib.dump(le_cat, 'saved_models/label_encoder_cat.pkl')
df_agg[['CLI', 'CATEGORIE']].drop_duplicates().to_csv('saved_models/client_cat_pairs.csv', index=False, encoding='utf-8')
print("💾 Modèle et fichiers encodés sauvegardés dans 'saved_models'.")
