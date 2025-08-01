from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# 📌 Initialiser Flask
app = Flask(__name__)
CORS(app)  # Autoriser les requêtes Cross-Origin

# 📌 Charger le modèle et le vectorizer
clf = joblib.load("transaction_classifier_rf.pkl")
vectorizer = joblib.load("vectorizer_rf.pkl")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API de classification des transactions est en ligne !"})

@app.route("/class", methods=["POST"])
def predict():
    try:
        # 📌 Récupérer les données JSON envoyées par l'utilisateur
        data = request.get_json()
        description = data.get("description", "")

        if not description:
            return jsonify({"error": "Aucune description fournie"}), 400

        # 📌 Transformer la description en vecteur TF-IDF
        desc_vectorized = vectorizer.transform([description])

        # 📌 Faire la prédiction
        categorie_predite = clf.predict(desc_vectorized)[0]

        # 📌 Retourner le résultat
        return jsonify({
            "description": description,
            "categorie_predite": categorie_predite
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Lancer l'API Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
