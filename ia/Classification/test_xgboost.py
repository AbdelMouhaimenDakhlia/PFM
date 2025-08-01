import joblib

# 📌 Charger le modèle, le vectorizer et l'encodeur
clf = joblib.load("transaction_classifier_xgb.pkl")
vectorizer = joblib.load("vectorizer_xgb.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# 📌 Nouvelle transaction à classifier
new_description = ["Paimenet  RETRAIT"]  # Exemple jamais vu dans l'entraînement

# 📌 Transformer en vecteur TF-IDF
desc_vectorized = vectorizer.transform(new_description)

# 📌 Faire la prédiction
categorie_predite_num = clf.predict(desc_vectorized)[0]

# 📌 Convertir en catégorie texte
categorie_predite = label_encoder.inverse_transform([categorie_predite_num])[0]

print(f"✅ Description : {new_description[0]}")
print(f"🎯 Catégorie prédite : {categorie_predite}")
