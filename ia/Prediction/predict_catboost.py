import pandas as pd
import numpy as np
from datetime import datetime
from catboost import CatBoostRegressor
import oracledb

# 🔹 Charger modèle CatBoost
model = CatBoostRegressor()
model.load_model('saved_models1/model_catboost.cbm')

# 🔹 Connexion Oracle
oracledb.init_oracle_client(lib_dir=r"C:\oraclexe\instantclient_19_26")
conn = oracledb.connect(user='system', password='0000', dsn='127.0.0.1:1521/xe')

# 🔹 Charger données depuis Oracle
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

# 🔹 Prétraitement
df['DOU'] = pd.to_datetime(df['DOU'], errors='coerce')
df['Année'] = df['DOU'].dt.year
df['Mois'] = df['DOU'].dt.month
df['MON_clean'] = df['MON'].astype(str).str.replace(',', '.').str.replace(' ', '')
df['MON_float'] = pd.to_numeric(df['MON_clean'], errors='coerce')
df = df.dropna(subset=['MON_float', 'DOU', 'Année', 'Mois', 'CLI', 'CATEGORIE'])

# 🔹 Historique agrégé
df_agg = df.groupby(['CLI', 'CATEGORIE'], as_index=False)['MON_float'].sum()

# 🔹 Liste des clients
clients_list = df['CLI'].unique()
print("\n📋 Liste des Clients disponibles :")
for idx, client in enumerate(clients_list, 1):
    print(f"{idx}. {client}")

client_choice = int(input("\n🔢 Entrez le numéro du client choisi : ")) - 1
cli_original = clients_list[client_choice]

# 🔹 Date prédiction
now = datetime.now()
mois_suivant = now.month + 1
annee_suivante = now.year
if mois_suivant == 13:
    mois_suivant = 1
    annee_suivante += 1

mois_sin = np.sin(2 * np.pi * mois_suivant / 12)
mois_cos = np.cos(2 * np.pi * mois_suivant / 12)

# 🔹 Historique du client
df_client = df_agg[df_agg['CLI'] == cli_original]
categories = df_client[df_client['MON_float'] > 0]['CATEGORIE'].tolist()

if not categories:
    print(f"⚠️ Aucun historique trouvé pour le client {cli_original}")
    exit()

# 🔹 Construire DataFrame d’entrée
client_avg = df[df['CLI'] == cli_original]['MON_float'].mean()
input_data = pd.DataFrame({
    'Année': [annee_suivante] * len(categories),
    'Mois': [mois_suivant] * len(categories),
    'Mois_sin': [mois_sin] * len(categories),
    'Mois_cos': [mois_cos] * len(categories),
    'CLI': [cli_original] * len(categories),
    'CATEGORIE': categories,
    'client_month_avg': [client_avg] * len(categories),
    'cat_month_avg': [df[df['CATEGORIE'] == cat]['MON_float'].mean() for cat in categories],
})

# 🔹 Prédiction
y_pred_log = model.predict(input_data)
y_pred = np.expm1(y_pred_log)

# 🔹 Résultats
results = pd.DataFrame({
    'Catégorie': categories,
    'Somme réelle (historique)': df_client.loc[df_client['CATEGORIE'].isin(categories), 'MON_float'].values,
    'Montant prédit': y_pred
})

# 🔹 Affichage
print(f"\n✅ Prédictions pour le client '{cli_original}' en {annee_suivante}-{mois_suivant:02d} :\n")
print(results.to_string(index=False))
