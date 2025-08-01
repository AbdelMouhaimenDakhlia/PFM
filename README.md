# 🏦 PFM - Personal Finance Management

<div align="center">
  <h3>Une solution complète de gestion financière personnelle avec IA</h3>
  
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
  ![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
</div>

---

## 📱 TijariWise - Application Mobile

**TijariWise** est une application mobile moderne développée avec React Native et Expo, offrant une gestion financière personnelle intelligente avec des fonctionnalités de prédiction basées sur l'IA.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification sécurisée** avec biométrie (TouchID)
- 🏠 **Tableau de bord interactif** avec graphiques en temps réel
- 💳 **Gestion multi-comptes** avec support multi-devises
- 💰 **Suivi des transactions** avec catégorisation automatique
- 📊 **Analyses financières avancées** sur 1 mois
- 🔮 **Prédictions IA** pour les dépenses futures
- 🎨 **Thèmes adaptatifs** (Clair/Sombre/Automatique)
- ⚡ **Animations fluides** avec React Native Reanimated

### 🛠️ Technologies

- **Frontend**: React Native 0.79.5, Expo SDK 53, TypeScript
- **Navigation**: React Navigation v7
- **UI**: React Native Paper (Material Design)
- **Graphiques**: react-native-chart-kit, react-native-svg-charts
- **Sécurité**: JWT, AsyncStorage, Biométrie native

---

## 🚀 Backend Spring Boot

Le backend est développé en Java avec Spring Boot, offrant une API RESTful robuste et sécurisée.

### 🔧 Fonctionnalités Backend

- 🔑 **API REST sécurisée** avec JWT
- 🏦 **Gestion des comptes bancaires**
- 💸 **Traitement des transactions**
- 👤 **Gestion des utilisateurs**
- 📊 **Endpoints d'analyse financière**
- 🔄 **Intégration avec les services IA**

### 🛠️ Technologies

- **Framework**: Spring Boot 3.x
- **Base de données**: Oracle Database
- **Sécurité**: Spring Security, JWT
- **Build**: Maven
- **Containerisation**: Docker

---

## 🤖 Services IA

Trois microservices IA spécialisés pour l'analyse et la prédiction financière.

### 1. 📊 Classification des Transactions
- **Catégorisation automatique** des transactions
- **Modèles**: Random Forest, XGBoost
- **Précision**: >95% sur les catégories principales

### 2. 🔮 Prédiction des Dépenses
- **Prédictions mensuelles** par catégorie
- **Modèles**: CatBoost, XGBoost
- **Horizon**: 1-6 mois avec intervalles de confiance

### 3. 💡 Recommandations Personnalisées
- **Conseils financiers intelligents**
- **Analyse des habitudes** de dépense
- **Alertes budgétaires** personnalisées

### 🛠️ Technologies IA

- **Frameworks**: scikit-learn, XGBoost, CatBoost
- **API**: Flask/FastAPI avec endpoints RESTful
- **Déploiement**: Docker containers
- **Données**: Preprocessing avec pandas, numpy

---

## 🗄️ Base de Données Oracle

Configuration complète d'Oracle Database pour la persistance des données.

### 📋 Schéma Principal

- **Utilisateurs** et authentification
- **Comptes bancaires** avec IBAN
- **Transactions** avec métadonnées complètes
- **Catégories** et classifications
- **Analyses** et rapports historiques

### 🔧 Outils

- **Oracle Database** 21c Enterprise Edition
- **Dump de données** inclus (`mydb_clean.dmp`)
- **Scripts d'initialisation** automatisés
- **Docker image**  Oracle

---

## 🏗️ Architecture du Projet

```
📦 PFM/
├── 📱 TijariWise/              # Application React Native
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   ├── screens/            # Écrans de l'application
│   │   ├── navigation/         # Navigation et routing
│   │   ├── context/            # Gestion d'état globale
│   │   ├── services/           # Services API
│   │   └── themes/             # Système de thèmes
│   └── Dockerfile
│
├── 🚀 pfm-backend/             # API Spring Boot
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── Dockerfile
│
├── 🤖 ia/                      # Services IA
│   ├── Classification/         # Classification des transactions
│   ├── Prediction/             # Prédiction des dépenses
│   └── recommandation/         # Système de recommandations
│
├── 🗄️ Oracle/                  # Base de données Oracle
│   ├── docker-images/          # Images Docker officielles
│   ├── mydb_clean.dmp          # Dump de données
│   └── scripts/                # Scripts d'initialisation
│
└── 🐳 docker-compose.yml       # Orchestration complète
```

---

## 🚀 Installation et Démarrage

### Prérequis

- Docker & Docker Compose
- Node.js 18+ (pour le développement mobile)
- Java 17+ (pour le développement backend)
- Python 3.9+ (pour les services IA)

### 🐳 Démarrage Rapide avec Docker

```bash
# Cloner le repository
git clone https://github.com/AbdelMouhaimenDakhlia/PFM.git
cd PFM

# Lancer tous les services
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

### 📱 Développement Mobile

```bash
cd TijariWise
npm install
npm start

# Sur votre appareil mobile avec Expo Go
# Scanner le QR code affiché
```

### 🚀 Développement Backend

```bash
cd pfm-backend
./mvnw spring-boot:run

# API disponible sur http://localhost:8080
```

### 🤖 Services IA

```bash
# Classification
cd ia/Classification
pip install -r requirements.txt
python api_class.py

# Prédiction
cd ia/Prediction
pip install -r requirements.txt
python api_catboost.py

# Recommandations
cd ia/recommandation
pip install -r requirements.txt
python xgb-api.py
```

---

## 📊 Services et Ports

| Service | Port | Description |
|---------|------|-------------|
| 📱 TijariWise | 8082, 19000-19002 | Application React Native |
| 🚀 Backend API | 8080 | API Spring Boot |
| 🗄️ Oracle DB | 1521 | Base de données Oracle |
| 🤖 Classification IA | 5000 | Service de classification |
| 🔮 Prédiction IA | 5001 | Service de prédiction |
| 💡 Recommandations | 5002 | Service de recommandations |

---

## 🔒 Sécurité

- **JWT Authentication** avec expiration automatique
- **Authentification biométrique** native
- **HTTPS** obligatoire en production
- **Chiffrement** des données sensibles
- **Rate limiting** sur les APIs
- **Validation** stricte des entrées

---

## 📈 Performances

- **Architecture microservices** scalable
- **Cache** intelligent pour les prédictions
- **Lazy loading** des composants React Native
- **Optimisations Oracle** avec indexation
- **Monitoring** en temps réel

---

## 👥 Développeur

**Abdel Mouhaiemen Dakhlia** - Ingénieur Informatique

Développé entièrement par moi-même avec passion pour créer une solution complète de gestion financière personnelle :

- 📱 **Application Mobile**: React Native & Expo avec TypeScript
- 🚀 **API Backend**: Spring Boot & Oracle Database  
- 🤖 **Intelligence Artificielle**: Python, Machine Learning
- 🐳 **DevOps**: Docker, Containerisation & Orchestration
- 🎨 **UI/UX Design**: Interface moderne et intuitive

---

##  Let's Connect
<p align="center">
  <a href="https://www.linkedin.com/in/mouhadakhlia/" target="_blank">
    <img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <a href="https://www.instagram.com/mouha9/" target="_blank">
    <img src="https://img.shields.io/badge/-Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/>
  </a>
  <a href="mailto:Abdelmouhaimen.dakhlia@esprit.tn">
    <img src="https://img.shields.io/badge/-Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://abdelmouhaimendakhlia.github.io/CV/" target="_blank">
    <img src="https://img.shields.io/badge/-View%20My%20CV-blue?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

---

<div align="center">
  <h3>🌟 N'oubliez pas de donner une étoile si ce projet vous plaît ! 🌟</h3>
</div>
