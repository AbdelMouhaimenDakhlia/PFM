import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.metrics import accuracy_score, confusion_matrix, precision_recall_fscore_support
from sklearn.preprocessing import LabelEncoder
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# 📌 1. Charger le dataset depuis `dataset.xlsx`
df = pd.read_excel("D:/PFM/IA/Classification/libelles_categorises.xlsx", engine="openpyxl")

# 📌 2. Vérification des données chargées
print(df.head())  # Afficher les premières lignes pour vérifier

# 📌 3. Rééquilibrer les données pour éviter les biais
max_size = df['categorie'].value_counts().max()
df_balanced = df.groupby('categorie', group_keys=False).apply(lambda x: x.sample(max_size, replace=True))
print(df_balanced['categorie'].value_counts())  # Vérification du rééquilibrage

# 📌 4. Préparation des données
X = df_balanced["description"]  # Les phrases
y = df_balanced["categorie"]  # Les catégories à prédire

# 📌 5. Encoder les labels en entiers
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# 📌 6. Transformer les descriptions en vecteurs TF-IDF
vectorizer = TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 2))
X_transformed = vectorizer.fit_transform(X)

# 📌 7. Séparer les données en jeu d'entraînement et de test (80% - 20%)
X_train, X_test, y_train, y_test = train_test_split(X_transformed, y_encoded, test_size=0.3, random_state=42)

# 📌 8. Initialiser le modèle XGBoost
clf_xgb = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42
)

# 📌 9. Entraîner le modèle
clf_xgb.fit(X_train, y_train)

# 📌 10. Évaluation du modèle
y_pred = clf_xgb.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Précision du modèle XGBoost : {accuracy:.2f}")

# 📌 11. Précision, Rappel, F1-Score
precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
print(f"🎯 Précision (weighted): {precision:.2f}")
print(f"🎯 Rappel (weighted): {recall:.2f}")
print(f"🎯 F1-Score (weighted): {f1:.2f}")

# 📌 12. Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=label_encoder.classes_, yticklabels=label_encoder.classes_)
plt.xlabel('Prédictions')
plt.ylabel('Vérité terrain')
plt.title('Matrice de confusion - XGBoost')
plt.show()

# 📌 13. Sauvegarde du modèle et des transformations
joblib.dump(clf_xgb, "transaction_classifier_xgb.pkl")  # Sauvegarde du modèle
joblib.dump(vectorizer, "vectorizer_xgb.pkl")  # Sauvegarde du vectorizer
joblib.dump(label_encoder, "label_encoder.pkl")  # Sauvegarde du label encoder

print("✅ Modèle XGBoost entraîné et sauvegardé avec succès !")
