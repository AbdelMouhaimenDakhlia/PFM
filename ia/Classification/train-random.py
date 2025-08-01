import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_recall_fscore_support
from sklearn.utils import resample
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# 📌 1. Charger le dataset depuis `dataset.xlsx`
# df = pd.read_excel("dataset.xlsx", engine="openpyxl")
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

# 📌 5. Transformer les descriptions en vecteurs TF-IDF
vectorizer = TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 2))
X_transformed = vectorizer.fit_transform(X)

# 📌 6. Séparer les données en jeu d'entraînement et de test (80% - 20%)
X_train, X_test, y_train, y_test = train_test_split(X_transformed, y, test_size=0.3, random_state=42)

# 📌 7. Vérification des classes présentes dans le jeu de test
print("Classes présentes dans le jeu d'entraînement :", set(y_train.unique()))
print("Classes présentes dans le jeu de test :", set(y_test.unique()))

# 📌 8. Initialiser le modèle Random Forest avec des hyperparamètres ajustés
clf = RandomForestClassifier(
    n_estimators=50,  # Réduit le nombre d'arbres pour éviter l'overfitting
    max_depth=5,  # Limite la complexité des arbres
    min_samples_split=2,  # Empêche la sur-segmentation des arbres
    random_state=42
)

# 📌 9. Entraîner le modèle
clf.fit(X_train, y_train)

# 📌 10. Évaluation du modèle
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Précision du modèle Random Forest : {accuracy:.2f}")



# 📌 12. Précision, Rappel, F1-Score
precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
print(f"🎯 Précision (weighted): {precision:.2f}")
print(f"🎯 Rappel (weighted): {recall:.2f}")
print(f"🎯 F1-Score (weighted): {f1:.2f}")



# 📌 14. Sauvegarde du modèle et du vectorizer
joblib.dump(clf, "transaction_classifier_rf.pkl")  # Sauvegarde du modèle
joblib.dump(vectorizer, "vectorizer_rf.pkl")  # Sauvegarde du vectorizer

print("✅ Modèle Random Forest entraîné et sauvegardé avec succès !")
