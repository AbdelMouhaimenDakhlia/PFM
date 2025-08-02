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
