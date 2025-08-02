# 🤖 Projet IA - Système de Classification, Prédiction et Recommandation

Ce projet implémente trois modules d'intelligence artificielle pour l'analyse et la prédiction de données transactionnelles bancaires.

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#️-architecture)
- [Modules](#-modules)
  - [Classification](#-classification)
  - [Prédiction](#-prédiction)
  - [Recommandation](#-recommandation)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [API Endpoints](#-api-endpoints)
- [Technologies utilisées](#️-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)

## 🎯 Vue d'ensemble

Ce système IA combine trois approches complémentaires :

1. **Classification** : Catégorisation automatique des transactions bancaires
2. **Prédiction** : Prévision de montants de transactions futures
3. **Recommandation** : Suggestion de produits bancaires personnalisés

## 🏗️ Architecture

Le projet suit une architecture microservices avec trois modules indépendants, chacun exposant une API REST Flask.

```text
IA/
├── Classification/     # Module de classification de transactions
├── Prediction/        # Module de prédiction de montants
└── recommandation/    # Module de recommandation de produits
```

## 📦 Modules

### 🔍 Classification

**Objectif** : Classifier automatiquement les transactions bancaires par catégorie.

**Technologies** :

- Modèle : Random Forest & XGBoost
- Vectorisation : TF-IDF
- Framework : scikit-learn

**Fichiers principaux** :

- `api_class.py` : API Flask pour la classification
- `train_xgboost.py` : Entraînement du modèle XGBoost
- `train-random.py` : Entraînement du modèle Random Forest

**Modèles sauvegardés** :

- `transaction_classifier_rf.pkl` : Modèle Random Forest
- `transaction_classifier_xgb.pkl` : Modèle XGBoost
- `vectorizer_rf.pkl` / `vectorizer_xgb.pkl` : Vectoriseurs TF-IDF

### 📈 Prédiction

**Objectif** : Prédire les montants de transactions futures basés sur l'historique client.

**Technologies** :

- Modèle : CatBoost & XGBoost
- Base de données : Oracle Database
- Connecteur : oracledb

**Fichiers principaux** :

- `api_catboost.py` : API Flask avec modèle CatBoost
- `train_catboost.py` : Entraînement CatBoost
- `predict_catboost.py` : Script de prédiction

**Données** :

- Connexion Oracle Database en temps réel
- Modèles sauvegardés dans `saved_models1/` et `saved_modelxgb/`

### 🎯 Recommandation

**Objectif** : Recommander des produits bancaires personnalisés aux clients.

**Technologies** :

- Modèle : XGBoost
- Technique : Collaborative Filtering
- Encodage : LabelEncoder

**Fichiers principaux** :

- `xgb-api.py` : API Flask de recommandation
- `rec-xgb.py` : Entraînement du modèle
- `transactions.csv` : Données d'entraînement

## 🚀 Installation

### Prérequis

- Python 3.8+
- Docker (optionnel)
- Oracle Database (pour le module Prédiction)

### Installation locale

1. **Cloner le repository**

```bash
git clone <your-repo-url>
cd ia
```

1. **Installation par module**

**Classification :**

```bash
cd Classification
pip install -r requirements.txt
python train_xgboost.py  # Entraîner le modèle
python api_class.py      # Lancer l'API
```

**Prédiction :**

```bash
cd Prediction
pip install -r requirements.txt
# Configurer la connexion Oracle dans api_catboost.py
python train_catboost.py  # Entraîner le modèle
python api_catboost.py    # Lancer l'API
```

**Recommandation :**

```bash
cd recommandation
pip install -r requirements.txt
python rec-xgb.py    # Entraîner le modèle
python xgb-api.py    # Lancer l'API
```

### 🐳 Installation Docker

Chaque module dispose de son propre Dockerfile :

```bash
# Classification
cd Classification
docker build -t ia-classification .
docker run -p 5000:5000 ia-classification

# Prédiction
cd Prediction
docker build -t ia-prediction .
docker run -p 5001:5000 ia-prediction

# Recommandation
cd recommandation
docker build -t ia-recommandation .
docker run -p 5002:5000 ia-recommandation
```

## 📚 Utilisation

### Classification

```python
import requests

response = requests.post('http://localhost:5000/class', 
    json={"description": "Achat supermarché Carrefour"})
print(response.json())
# {"prediction": "Alimentation", "confidence": 0.95}
```

### Prédiction

```python
response = requests.get('http://localhost:5001/predict')
print(response.json())
# {"predictions": [{"client": "CLI001", "predicted_amount": 150.75}]}
```

### Recommandation

```python
response = requests.get('http://localhost:5002/api/recommend?client_id=CLI001&top_n=5')
print(response.json())
# {"recommendations": ["Produit A", "Produit B", "Produit C"]}
```

## 🔌 API Endpoints

### Classification (Port 5000)

- `GET /` : Status de l'API
- `POST /class` : Classification d'une transaction
  - Body : `{"description": "text"}`

### Prédiction (Port 5001)

- `GET /` : Status de l'API
- `GET /predict` : Prédictions pour tous les clients
- `GET /predict/<client_id>` : Prédiction pour un client spécifique

### Recommandation (Port 5002)

- `GET /api/recommend` : Recommandations personnalisées
  - Params : `client_id`, `top_n` (optionnel)

## 🛠️ Technologies utilisées

| Module | ML Library | Web Framework | Database |
|--------|------------|---------------|----------|
| Classification | scikit-learn, XGBoost | Flask | - |
| Prédiction | CatBoost, XGBoost | Flask | Oracle DB |
| Recommandation | XGBoost | Flask | CSV |

**Librairies communes** :

- Flask & Flask-CORS
- pandas & numpy
- joblib (sérialisation)

## 📁 Structure du projet

```text
ia/
├── Classification/
│   ├── api_class.py                    # API Flask
│   ├── train_xgboost.py               # Entraînement XGBoost
│   ├── train-random.py                # Entraînement Random Forest
│   ├── test_xgboost.py                # Tests du modèle
│   ├── transaction_classifier_*.pkl    # Modèles sauvegardés
│   ├── vectorizer_*.pkl               # Vectoriseurs
│   ├── label_encoder.pkl              # Encodeur de labels
│   ├── requirements.txt
│   └── Dockerfile
│
├── Prediction/
│   ├── api_catboost.py                # API Flask CatBoost
│   ├── train_catboost.py              # Entraînement CatBoost
│   ├── predict_catboost.py            # Script prédiction
│   ├── train_xgb.py                   # Entraînement XGBoost
│   ├── saved_models1/                 # Modèles CatBoost
│   ├── saved_modelxgb/                # Modèles XGBoost
│   ├── oracle/                        # Client Oracle
│   ├── requirements.txt
│   └── Dockerfile
│
└── recommandation/
    ├── xgb-api.py                     # API Flask
    ├── rec-xgb.py                     # Entraînement XGBoost
    ├── transactions.csv               # Données d'entraînement
    ├── models/                        # Modèles et encodeurs
    ├── requirements.txt
    └── Dockerfile
```

## 🔧 Configuration

### Base de données Oracle (Module Prédiction)

Modifier les paramètres de connexion dans `api_catboost.py` :

```python
dsn = "your-oracle-host:1521/your-service"
conn = oracledb.connect(
    user="your_user",
    password="your_password", 
    dsn=dsn
)
```

### Variables d'environnement

Créer un fichier `.env` pour chaque module :

```env
# Prédiction
ORACLE_USER=system
ORACLE_PASSWORD=oracle
ORACLE_DSN=oracle-xe:1521/XEPDB1

# Classification  
MODEL_PATH=./models/
LOG_LEVEL=INFO

# Recommandation
DATA_PATH=./transactions.csv
TOP_N_DEFAULT=5
```

## 🚦 Status et Monitoring

Chaque API expose un endpoint de status :

- Classification : `GET http://localhost:5000/`
- Prédiction : `GET http://localhost:5001/`
- Recommandation : `GET http://localhost:5002/`

## 👥 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Auteurs** : Équipe IA PFM  
**Version** : 1.0.0  
**Date** : Août 2025
