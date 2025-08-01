from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

# Initialisation de l'app Flask
app = Flask(__name__)

# Chargement du modèle et des encodeurs
model = joblib.load("models/xgb_model.pkl")
enc_cli = joblib.load("models/enc_cli.pkl")
enc_prod = joblib.load("models/enc_prod.pkl")
enc_cat = joblib.load("models/enc_cat.pkl")

# Chargement des données pour les catégories
df = pd.read_csv("transactions.csv")
produits = df['produit'].unique()

@app.route("/api/recommend", methods=["GET"])
def recommend():
    client_id = request.args.get("client_id")
    top_n = int(request.args.get("top_n", 5))

    if client_id not in enc_cli.classes_:
        return jsonify({"error": "Client inconnu."}), 404

    cli_id = enc_cli.transform([client_id])[0]
    produits_utilises = df[df['cli'] == client_id]['produit'].tolist()
    candidats = [p for p in produits if p not in produits_utilises]

    if not candidats:
        return jsonify({"recommendations": []})

    # Construction des features pour prédiction
    candidats_df = pd.DataFrame({
        "cli": [cli_id] * len(candidats),
        "produit": enc_prod.transform(candidats),
        "categorie": enc_cat.transform([
            df[df['produit'] == p]['categorie'].dropna().values[0]
            if not df[df['produit'] == p]['categorie'].dropna().empty else "inconnue"
            for p in candidats
        ])
    })

    proba = model.predict_proba(candidats_df)[:, 1]
    top_idx = np.argsort(proba)[-top_n:][::-1]
    recommandations = [candidats[i] for i in top_idx]

    return jsonify({"recommendations": recommandations})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
