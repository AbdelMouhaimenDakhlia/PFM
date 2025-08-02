# 🏦 PFM Backend - TijariWise API

## 📋 Description du Projet

**TijariWise Backend** est l'API REST Spring Boot du système de gestion financière personnelle TijariWise. Cette API permet aux utilisateurs de gérer leurs transactions bancaires, comptes et d'intégrer des fonctionnalités d'intelligence artificielle pour la catégorisation automatique des transactions.

### � Objectifs du Backend
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

### 🚫 Endpoints Publics

```http
POST /auth/login     # Connexion utilisateur
POST /auth/register  # Inscription utilisateur
```

### 🔐 Endpoints Protégés (JWT requis)

```http
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

```bash
docker run -d --name oracle-xe \
  -p 1521:1521 -p 5500:5500 \
  -e ORACLE_PASSWORD=oracle \
  container-registry.oracle.com/database/express:18.4.0-xe
```

2. **Configurer l'application**

```bash
# Copier le fichier de configuration
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Modifier les paramètres de base de données si nécessaire
```

3. **Compiler et démarrer**

```bash
./mvnw clean compile
./mvnw spring-boot:run
```

### 🔧 Configuration

L'API est accessible sur `http://localhost:8081`

---

## 🔄 Traitement par Lots (Spring Batch)

### 📁 Format des Fichiers CSV

```csv
bhLib,dco,mon,sen,iban,produit
"Salaire mensuel","2024-01-15",2500.00,"C","IBAN123456","Compte courant"
"Supermarché","2024-01-16",-85.50,"D","IBAN123456","Carte de crédit"
```

### ⚙️ Configuration du Batch

- **Surveillance automatique** : Toutes les 5 secondes
- **Localisation** : `/resources/transactions11.csv`
- **Traitement** : Classification IA + Insertion DB
- **Détection doublons** : Automatique

### 🔍 Surveillance des Fichiers

Le système surveille automatiquement les modifications du fichier CSV et lance le traitement dès qu'un changement est détecté.

---

## � Intégration Intelligence Artificielle

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

### 🧪 Exécution des Tests

```bash
# Tests unitaires
./mvnw test

# Tests d'intégration
./mvnw verify

# Rapport de couverture
./mvnw jacoco:report
```

---

## � Docker

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

### 🔧 Docker Compose

Le projet inclut un `docker-compose.yml` pour démarrer l'ensemble de l'infrastructure :

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les services
docker-compose down
```

---

## 🚨 Dépannage

### ❌ Problèmes Courants

#### Connexion Base de Données

- Vérifier qu'Oracle est démarré : `docker ps`
- Tester la connectivité : `telnet localhost 1521`
- Vérifier les logs : `docker logs oracle-xe`

#### Batch ne fonctionne pas

- Vérifier l'existence du fichier CSV
- Contrôler les permissions du répertoire
- Consulter les logs Spring Batch

#### Erreurs JWT

- Vérifier la configuration `app.jwtSecret`
- Contrôler l'expiration du token
- Valider le format du token dans les headers

---

## 📈 Évolutions Futures

### 🎯 Roadmap Backend

- [ ] **Migration PostgreSQL** pour améliorer les performances
- [ ] **Cache Redis** pour optimiser les requêtes fréquentes
- [ ] **Tests automatisés** complets avec TestContainers
- [ ] **Monitoring** avec Spring Boot Actuator
- [ ] **Métriques** et observabilité
- [ ] **API versioning** pour la compatibilité
- [ ] **Rate limiting** pour protéger l'API
- [ ] **Swagger/OpenAPI** documentation

### 🔧 Améliorations Techniques

- [ ] **Microservices** architecture avec Spring Cloud
- [ ] **Event-driven** architecture avec Spring Cloud Stream
- [ ] **CQRS** pattern pour séparer lecture/écriture
- [ ] **Circuit breaker** pour la résilience
- [ ] **Distributed tracing** avec Sleuth

---

## 👥 Contribution

### 🤝 Comment Contribuer

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Pousser** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### 📝 Standards de Code

- **Java 17+** avec les features modernes
- **Spring Boot** best practices
- **Tests unitaires** obligatoires
- **Documentation** JavaDoc
- **Formatting** avec Google Java Style

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

Pour toute question ou support technique :

- **Issues** : Créer une issue GitHub
- **Documentation** : Consulter ce README et les JavaDocs
- **Wiki** : Documentation détaillée disponible dans le wiki

---

**🏦 PFM Backend - TijariWise API - Votre solution backend pour la gestion financière personnelle** 🚀