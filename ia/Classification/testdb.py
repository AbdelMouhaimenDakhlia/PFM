import joblib

# Charger le modèle et le vectorizer
clf = joblib.load("transaction_classifier_rf.pkl")
vectorizer = joblib.load("vectorizer_rf.pkl")

# Nouvelle description à classifier
new_description = ["Paimenet PHCIE"]  # Exemple jamais vu dans l'entraînement

# Transformer le texte en vecteur TF-IDF
desc_vectorized = vectorizer.transform(new_description)

# Faire la prédiction
categorie_predite = clf.predict(desc_vectorized)[0]

print(f"✅ Description : {new_description[0]}")
print(f"🎯 Catégorie prédite : {categorie_predite}")
