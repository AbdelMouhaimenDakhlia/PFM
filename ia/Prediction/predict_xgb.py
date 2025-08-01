import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import oracledb

# 🔹 Charger modèle et encodeurs
le_cli = joblib.load('saved_models/label_encoder_client.pkl')
le_cat = joblib.load('saved_models/label_encoder_cat.pkl')
model = joblib.load('saved_models/model_global.pkl')

# 🔹 Connexion Oracle
oracledb.init_oracle_client(lib_dir=r"C:\oraclexe\instantclient_19_26")
conn = oracledb.connect(user='system', password='0000', dsn='127.0.0.1:1521/xe')

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

# 🔹 Prétraitement identique
df['DOU'] = pd.to_datetime(df['DOU'], errors='coerce')
df['Année'] = df['DOU'].dt.year
df['Mois'] = df['DOU'].dt.month
df['MON_clean'] = df['MON'].astype(str).str.replace(',', '.').str.replace(' ', '')
df['MON_float'] = pd.to_numeric(df['MON_clean'], errors='coerce')
df = df.dropna(subset=['MON_float', 'DOU', 'Année', 'Mois', 'CLI', 'CATEGORIE'])

# 🔹 Agrégation par client/catégorie (somme historique)
df_agg = df.groupby(['CLI', 'CATEGORIE'], as_index=False)['MON_float'].sum()

# 🔹 Liste des clients encodés
clients_list = list(le_cli.classes_)
print("\n📋 Liste des Clients disponibles :")
for idx, client in enumerate(clients_list, start=1):
    print(f"{idx}. {client}")

client_choice = int(input("\n🔢 Entrez le numéro du client choisi : ")) - 1
cli_original = clients_list[client_choice]
cli_encoded = le_cli.transform([cli_original])[0]

# 🔹 Date du mois suivant
now = datetime.now()
mois_suivant = now.month + 1
annee_suivante = now.year
if mois_suivant == 13:
    mois_suivant = 1
    annee_suivante += 1

mois_sin = np.sin(2 * np.pi * mois_suivant / 12)
mois_cos = np.cos(2 * np.pi * mois_suivant / 12)

# 🔹 Historique réel par catégorie pour ce client
df_client = df_agg[df_agg['CLI'] == cli_original]
categories_non_nulles = df_client[df_client['MON_float'] > 0]['CATEGORIE'].tolist()

if not categories_non_nulles:
    print(f"\n⚠️ Le client '{cli_original}' n'a aucune catégorie avec des transactions réelles.")
    exit()

# 🔹 Données d'entrée pour prédiction
input_data = pd.DataFrame({
    'Année': [annee_suivante] * len(categories_non_nulles),
    'Mois': [mois_suivant] * len(categories_non_nulles),
    'Mois_sin': [mois_sin] * len(categories_non_nulles),
    'Mois_cos': [mois_cos] * len(categories_non_nulles),
    'CLI_enc': [cli_encoded] * len(categories_non_nulles),
    'Cat_enc': le_cat.transform(categories_non_nulles),
    'client_month_avg': [df_client['MON_float'].mean()] * len(categories_non_nulles),
    'cat_month_avg': [
        df_agg[df_agg['CATEGORIE'] == cat]['MON_float'].mean() for cat in categories_non_nulles
    ]
})

# 🔹 Prédictions
y_pred_log = model.predict(input_data)
y_pred = np.expm1(y_pred_log)

# 🔹 Résultats finaux
results = pd.DataFrame({
    'Client': cli_original,
    'Catégorie': categories_non_nulles,
    'Année': annee_suivante,
    'Mois': mois_suivant,
    'Somme réelle (historique)': df_client.loc[df_client['CATEGORIE'].isin(categories_non_nulles), 'MON_float'].values,
    'Montant prédit': y_pred
})

# 🔹 Affichage final
print(f"\n✅ Prédictions pour le client '{cli_original}' pour {annee_suivante}-{mois_suivant:02d} :\n")
print(results[['Catégorie', 'Somme réelle (historique)', 'Montant prédit']].to_string(index=False))
