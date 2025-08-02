# 🏦 PFM Backend - TijariWise API

## 📋 Description du Projet

**TijariWise Backend** est l'API REST Spring Boot du système de gestion financière personnelle TijariWise. Cette API permet aux utilisateurs de gérer leurs transactions bancaires, comptes et d'intégrer des fonctionnalités d'intelligence artificielle pour la catégorisation automatique des transactions.

### Objectifs du Backend
- Fournir une API REST sécurisée pour la gestion financière
- Automatiser le traitement des transactions via Spring Batch
- Intégrer les services d'IA pour la catégorisation
- Gérer l'authentification et l'autorisation des utilisateurs

---

## 🔧 Technologies Utilisées
- **Framework** : Spring Boot 3.4.2
- **Base de données** : Oracle Database 18.4.0-XE
- **Sécurité** : Spring Security + JWT
- **Traitement par lots** : Spring Batch
- **ORM** : JPA/Hibernate
- **Conteneurisation** : Docker
- **Build Tool** : Maven

---

## 📁 Structure du Projet

```
pfm-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/pfm/pfmbackend/
│   │   │       ├── PfmBackendApplication.java
│   │   │       ├── batch/              # Configuration Spring Batch
│   │   │       ├── config/             # Configuration Spring
│   │   │       ├── controller/         # Contrôleurs REST
│   │   │       ├── dto/               # Objets de transfert de données
│   │   │       ├── model/             # Entités JPA
│   │   │       ├── repository/        # Repositories JPA
│   │   │       ├── security/          # Configuration sécurité
│   │   │       └── service/           # Services métier
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/                          # Tests unitaires
├── resources/                         # Ressources externes
│   └── transactions11.csv           # Fichier CSV de test
├── Dockerfile                        # Configuration Docker
├── pom.xml                          # Configuration Maven
└── README.md
```

---

## ⚡ Fonctionnalités Principales

### 👤 Gestion des Utilisateurs

- **Inscription/Connexion** sécurisée avec JWT
- **Authentification** par email/mot de passe
- **Gestion de profil** utilisateur
- **Chiffrement** des mots de passe avec BCrypt

### 🏦 Gestion des Comptes Bancaires

- **Création** de comptes bancaires multiples
- **Association** utilisateur-comptes
- **Gestion des IBAN** et devises
- **Suivi des soldes**

### 💳 Gestion des Transactions

- **Import automatique** via fichiers CSV
- **Ajout manuel** de transactions
- **Catégorisation automatique** par IA
- **Filtrage et recherche** avancée
- **Détection des doublons**

### 📊 Analyses et Statistiques

- **Répartition par catégories** de dépenses
- **Évolution mensuelle** des transactions
- **Dernières transactions** en temps réel
- **Graphiques** et visualisations

### 🤖 Intelligence Artificielle

- **Classification automatique** des transactions via API externe
- **Intégration** avec services de recommandations
- **Prédictions** de dépenses futures
- **Analyses comportementales**

### 🔄 Traitement par Lots (Batch)

- **Import automatique** de fichiers CSV
- **Surveillance en temps réel** des modifications
- **Traitement asynchrone** des données
- **Logs détaillés** d'exécution

---

## 🔐 Sécurité

### 🛡️ Authentification et Autorisation

- **JWT (JSON Web Token)** pour l'authentification stateless
- **BCrypt** pour le hachage des mots de passe
- **Spring Security** pour la sécurisation des endpoints
- **CORS** configuré pour l'accès cross-origin

### 🔒 Protection des Données

- **Endpoints protégés** : Tous sauf `/auth/**`
- **Validation** des données d'entrée
- **Gestion des sessions** stateless
- **Chiffrement** des communications

---

## 🚀 Installation et Démarrage

### 📋 Prérequis

- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- Oracle Database 18c+ (ou via Docker)

### ⚡ Démarrage Rapide

#### Option 1: Avec Docker Compose (Recommandé)

1. **Cloner le repository**

```bash
git clone <repository-url>
cd pfm-backend
```

2. **Démarrer avec Docker Compose**

```bash
docker-compose up -d
```

#### Option 2: Démarrage Local

1. **Démarrer Oracle Database**

2. **Configurer l'application**

3. **Compiler et démarrer**


### 🔧 Configuration

L'API est accessible sur `http://localhost:8081`

---

## 🔄 Traitement par Lots (Spring Batch)

### 📁 Format des Fichiers CSV

```csv
bhLib,dco,mon,sen,iban,produit
```

### ⚙️ Configuration du Batch

- **Surveillance automatique** : Toutes les 5 secondes
- **Localisation** : `/resources/transactions11.csv`
- **Traitement** : Classification IA + Insertion DB
- **Détection doublons** : Automatique

### 🔍 Surveillance des Fichiers

Le système surveille automatiquement les modifications du fichier CSV et lance le traitement dès qu'un changement est détecté.

---

##  Intégration Intelligence Artificielle

### 🏷️ Classification des Transactions

- **Endpoint externe** : Services de classification IA
- **Méthode** : POST vers API de classification
- **Entrée** : Description de la transaction
- **Sortie** : Catégorie prédite (Alimentation, Transport, Loisirs, etc.)
- **Intégration** : Via RestTemplate Spring

### 📈 Services IA Supportés

- **Classification** : Catégorisation automatique des transactions
- **Prédiction** : Prédictions de dépenses futures  
- **Recommandations** : Recommandations personnalisées

---

##  Docker

### 📦 Build de l'Image

```bash
# Build de l'image Docker
docker build -t pfm-backend .

# Run du conteneur
docker run -p 8081:8081 \
  -e ORACLE_HOST=host.docker.internal \
  -e ORACLE_PORT=1521 \
  pfm-backend
```

---

**🏦 PFM Backend - TijariWise API - Votre solution backend pour la gestion financière personnelle** 🚀