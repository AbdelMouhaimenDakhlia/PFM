# 🏦 PFM (Personal Finance Management) - TijariWise

## 📋 Description du Projet

**TijariWise** est une application complète de gestion financière personnelle qui permet aux utilisateurs de suivre leurs transactions bancaires, analyser leurs dépenses et recevoir des recommandations intelligentes basées sur l'IA.

### 🎯 Objectifs
- Centraliser la gestion des finances personnelles
- Automatiser la catégorisation des transactions
- Fournir des analyses et recommandations intelligentes
- Offrir une interface mobile intuitive

---

## 🏗️ Architecture du Système

### 📦 Structure du Projet
```
PFM-TijariWise/
├── pfm-backend/          # API REST Spring Boot
├── ia/
│   ├── Classification/   # API de classification des transactions
│   ├── Prediction/       # API de prédiction budgétaire
│   └── Recommandation/   # API de recommandations
├── TijariWise/          # Application mobile React Native/Expo
└── docker-compose.yml   # Orchestration des services
```

### 🔧 Technologies Utilisées

#### Backend (pfm-backend)
- **Framework** : Spring Boot 3.4.2
- **Base de données** : Oracle Database 18.4.0-XE
- **Sécurité** : Spring Security + JWT
- **Traitement par lots** : Spring Batch
- **ORM** : JPA/Hibernate
- **Conteneurisation** : Docker

#### Intelligence Artificielle
- **Classification** : Python + CatBoost (Classification des transactions)
- **Prédiction** : Python + ML (Prédiction budgétaire)
- **Recommandations** : Python + XGBoost (Recommandations personnalisées)

#### Frontend Mobile
- **Framework** : React Native + Expo
- **Plateforme** : iOS/Android

#### Infrastructure
- **Orchestration** : Docker Compose
- **Base de données** : Oracle XE en conteneur

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
- **Classification automatique** des transactions
- **Recommandations personnalisées** basées sur l'historique
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

### 🚫 Endpoints Publics
```
POST /auth/login     # Connexion utilisateur
POST /auth/register  # Inscription utilisateur
```

### 🔐 Endpoints Protégés (JWT requis)
```
# Utilisateurs
GET    /api/utilisateurs/me     # Profil utilisateur
PUT    /api/utilisateurs/me     # Mise à jour profil

# Comptes bancaires
GET    /api/comptes/me          # Mes comptes
POST   /api/comptes/{userId}    # Créer un compte

# Transactions
GET    /api/transactions/me     # Mes transactions
GET    /api/transactions/stats  # Statistiques
GET    /api/transactions/monthly # Évolution mensuelle
POST   /api/transactions/{compteId} # Ajouter transaction

# IA et Batch
GET    /api/ia-results/{categorie} # Résultats IA
POST   /api/batch/categorize    # Lancer traitement batch
```

---

## 🚀 Installation et Déploiement

### ⚡ Démarrage Rapide avec Docker

1. **Cloner le projet**
```bash
git clone <repository-url>
cd PFM-TijariWise
```

2. **Lancer tous les services**
```bash
docker-compose up -d
```

3. **Vérifier le statut**
```bash
docker-compose ps
```

### 🔧 Services et Ports

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 8081 | API REST Spring Boot |
| Oracle DB | 1521 | Base de données Oracle XE |
| Oracle Console | 8080 | Interface web Oracle |
| IA Classification | 5002 | API de classification des transactions |
| IA Prédiction | 5001 | API de prédiction budgétaire |
| IA Recommandation | 5000 | API de recommandations |
| Mobile App | 8082, 19000-19002 | App React Native/Expo |

### 📊 Surveillance et Logs

```bash
# Logs du backend
docker logs gitlab-copie-backend-1 --tail 50

# Logs de la base de données
docker logs oracle-xe --tail 20

# Logs des services IA
docker logs gitlab-copie-classification-1 --tail 20
docker logs gitlab-copie-prediction-1 --tail 20
docker logs gitlab-copie-recommandation-1 --tail 20
```

---

## 🔄 Traitement par Lots (Batch Processing)

### 📁 Format des Fichiers CSV
```csv
bhLib,dco,mon,sen,iban,produit
"Salaire mensuel","2024-01-15",2500.00,"C","IBAN123456","Compte courant"
"Supermarché","2024-01-16",-85.50,"D","IBAN123456","Carte de crédit"
```

### ⚙️ Configuration du Batch
- **Surveillance automatique** : Toutes les 5 secondes
- **Localisation** : `/data/transactions11.csv`
- **Traitement** : Classification IA + Insertion DB
- **Détection doublons** : Automatique

### 🔍 Surveillance des Fichiers
Le système surveille automatiquement les modifications du fichier CSV et lance le traitement dès qu'un changement est détecté.

---

## 🧠 Intelligence Artificielle

### 🏷️ Classification des Transactions
- **Service** : Classification
- **Modèle** : CatBoost Classifier
- **Port** : 5002
- **Fonction** : Catégorisation automatique des transactions
- **Entrée** : Description de la transaction
- **Sortie** : Catégorie prédite (Alimentation, Transport, Loisirs, etc.)
- **Endpoint** : `POST http://localhost:5002/class`

### � Prédiction Budgétaire
- **Service** : Prediction
- **Modèle** : Machine Learning pour prédictions financières
- **Port** : 5001
- **Fonction** : Prédiction des dépenses et budgets futurs
- **Entrée** : Historique des transactions utilisateur
- **Sortie** : Prédictions de dépenses et tendances budgétaires
- **Endpoint** : `POST http://localhost:5001/predict`

### 🎯 Système de Recommandations
- **Service** : Recommandation
- **Modèle** : XGBoost Regressor
- **Port** : 5000
- **Fonction** : Recommandations personnalisées de produits financiers
- **Entrée** : Profil utilisateur et historique des transactions
- **Sortie** : Recommandations de produits financiers personnalisés
- **Endpoint** : `GET http://localhost:5000/recommendations`

---

## 💾 Base de Données

### 📋 Modèle de Données

#### Utilisateur (UTILISATEUR)
```sql
- id (PK)
- nom
- email (UNIQUE)
- mot_de_passe (ENCRYPTED)
- cli (Identifiant client)
```

#### Compte Bancaire (COMPT_BANCAIRE)
```sql
- id (PK)
- iban (UNIQUE)
- solde
- devise
- user_id (FK)
- date_ouverture
```

#### Transaction (TRANSACTION)
```sql
- id (PK)
- montant
- description
- date_trans
- type (Crédit/Débit)
- categorie_transaction
- produit
- compt_id (FK)
```

#### Résultats IA (IA_RESULT)
```sql
- id (PK)
- categorie
- confidence_score
- transaction_id (FK)
```

---

## 🔧 Configuration

### ⚙️ Variables d'Environnement

#### Backend
```properties
ORACLE_HOST=oracle-xe
ORACLE_PORT=1521
ORACLE_DB=XE
ORACLE_USER=system
ORACLE_PASS=oracle
```

#### Base de Données
```properties
spring.datasource.url=jdbc:oracle:thin:@//oracle-xe:1521/XEPDB1
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### Batch Processing
```properties
pfm.batch.csv.path=/data/transactions11.csv
spring.batch.job.enabled=true
```

---

## 🧪 Tests et Développement

### 🔍 Tests d'API
```bash
# Test de connexion
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","motDePasse":"password"}'

# Test d'endpoint protégé
curl -X GET http://localhost:8081/api/transactions/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 📱 Développement Mobile
```bash
cd TijariWise
npm install
npm start
```

---

## 🚨 Dépannage

### ❌ Problèmes Courants

#### Batch ne fonctionne pas
- Vérifier l'existence du fichier CSV : `/data/transactions11.csv`
- Contrôler les logs : `docker logs gitlab-copie-backend-1`
- Vérifier les permissions du volume monté

#### Connexion Base de Données
- S'assurer qu'Oracle est démarré : `docker ps`
- Vérifier les logs Oracle : `docker logs oracle-xe`
- Tester la connectivité réseau entre conteneurs

#### Erreurs IA
- Vérifier le statut des services IA : `docker ps`
- Contrôler les logs des APIs : `docker logs gitlab-copie-prediction-1`

---

## 📈 Évolutions Futures

### 🎯 Roadmap
- [ ] **Dashboard avancé** avec plus de graphiques
- [ ] **Alertes** de dépenses personnalisées
- [ ] **Export PDF** des rapports
- [ ] **API mobile** native (iOS/Android)
- [ ] **Synchronisation** bancaire automatique
- [ ] **Budgets** et objectifs financiers
- [ ] **Multi-devises** avancé
- [ ] **Mode offline** pour l'application mobile

### 🔧 Améliorations Techniques
- [ ] Migration vers **PostgreSQL** 
- [ ] **Microservices** avec Spring Cloud
- [ ] **Cache Redis** pour les performances
- [ ] **Tests automatisés** complets
- [ ] **CI/CD Pipeline** avec GitLab
- [ ] **Monitoring** avec Prometheus/Grafana

---

## 👥 Équipe et Contribution

### 👨‍💻 Développeur Principal
**Abdel Mouhaiemen Dakhlia** - Développeur Full-Stack

### 🤝 Contribution
Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

Pour toute question ou support :
- **Email** : abdel.dakhlia@example.com
- **Issues** : Créer une issue GitHub
- **Documentation** : Consulter ce README

---

**💡 TijariWise - Votre partenaire intelligent pour la gestion financière personnelle** 🚀