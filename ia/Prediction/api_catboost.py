from flask import Flask, jsonify
import pandas as pd
import numpy as np
from datetime import datetime
from catboost import CatBoostRegressor
import oracledb

# 🔹 Initialisation Flask
app = Flask(__name__)

# 🔹 Chargement du modèle CatBoost
model = CatBoostRegressor()
model.load_model('saved_models1/model_catboost.cbm')

# 🔹 DSN Oracle (thin mode)
dsn = "oracle-xe:1521/XEPDB1"

def get_data_from_oracle():
    conn = oracledb.connect(
        user="system",
        password="oracle",
        dsn=dsn,
        # Mode thin activé automatiquement (pas besoin de init_oracle_client)
    )
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
    return df

@app.route('/api/predict/<client_id>', methods=['GET'])
def predict(client_id):
    df = get_data_from_oracle()

    # Nettoyage
    df['DOU'] = pd.to_datetime(df['DOU'], errors='coerce')
    df['Année'] = df['DOU'].dt.year
    df['Mois'] = df['DOU'].dt.month
    df['MON_clean'] = df['MON'].astype(str).str.replace(',', '.').str.replace(' ', '')
    df['MON_float'] = pd.to_numeric(df['MON_clean'], errors='coerce')
    df = df.dropna(subset=['MON_float', 'DOU', 'Année', 'Mois', 'CLI', 'CATEGORIE'])

    # Données pour prédiction
    df_agg = df.groupby(['CLI', 'CATEGORIE'], as_index=False)['MON_float'].sum()
    df_client = df_agg[df_agg['CLI'] == client_id]
    categories = df_client[df_client['MON_float'] > 0]['CATEGORIE'].tolist()

    if not categories:
        return jsonify({"error": f"Client '{client_id}' sans historique suffisant."}), 404

    # Date prédiction
    now = datetime.now()
    mois_suivant = now.month + 1
    annee_suivante = now.year
    if mois_suivant == 13:
        mois_suivant = 1
        annee_suivante += 1
    mois_sin = np.sin(2 * np.pi * mois_suivant / 12)
    mois_cos = np.cos(2 * np.pi * mois_suivant / 12)
    client_avg = df[df['CLI'] == client_id]['MON_float'].mean()

    input_data = pd.DataFrame({
        'Année': [annee_suivante] * len(categories),
        'Mois': [mois_suivant] * len(categories),
        'Mois_sin': [mois_sin] * len(categories),
        'Mois_cos': [mois_cos] * len(categories),
        'CLI': [client_id] * len(categories),
        'CATEGORIE': categories,
        'client_month_avg': [client_avg] * len(categories),
        'cat_month_avg': [df[df['CATEGORIE'] == cat]['MON_float'].mean() for cat in categories],
    })

    y_pred_log = model.predict(input_data)
    y_pred = np.expm1(y_pred_log)

    results = []
    for cat, hist, pred in zip(categories, df_client['MON_float'].values, y_pred):
        results.append({
            "categorie": cat,
            "historique": round(float(hist), 2),
            "prediction": round(float(pred), 2)
        })

    return jsonify({
        "client": client_id,
        "annee": annee_suivante,
        "mois": mois_suivant,
        "resultats": results
    })

# 🔹 Lancement serveur
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
