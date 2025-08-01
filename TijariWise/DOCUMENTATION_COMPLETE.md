# 📱 TijariWise - Documentation Complète

## 🏦 Vue d'ensemble

**TijariWise** est une application mobile de gestion financière personnelle développée avec React Native et Expo. L'application offre une interface moderne et intuitive pour la gestion des comptes bancaires, le suivi des transactions et l'analyse financière avec des fonctionnalités de prédiction basées sur l'IA.

---

## 🎯 Fonctionnalités Principales

### 1. 🔐 Authentification & Sécurité
- **Connexion sécurisée** avec email/mot de passe
- **Authentification biométrique** (TouchID, FaceID, Empreinte digitale)
- **Gestion automatique des tokens JWT** avec expiration
- **Déconnexion automatique** en cas de token expiré
- **Validation en temps réel** des formulaires
- **Stockage sécurisé** avec AsyncStorage
- **Intercepteurs HTTP** pour la gestion des erreurs d'authentification

### 2. 🏠 Tableau de Bord (HomeScreen)
- **Vue d'ensemble financière** avec soldes des comptes
- **Graphiques interactifs** :
  - Graphiques en barres pour les dépenses mensuelles
  - Graphiques linéaires pour les tendances
  - Graphiques en secteurs pour la répartition par catégorie
- **Transactions récentes** avec navigation vers les détails
- **Statistiques en temps réel** des comptes bancaires
- **Animations fluides** avec React Native Reanimated

### 3. 💳 Gestion des Comptes
- **Liste des comptes bancaires** avec IBAN et soldes
- **Support multi-devises** (EUR, USD, etc.)
- **Détails complets** de chaque compte
- **Navigation vers les transactions** par compte
- **Mise à jour en temps réel** des soldes

### 4. 💰 Transactions
- **Liste complète** des transactions avec pagination
- **Filtrage avancé** :
  - Par catégorie (Alimentation, Transport, Logement, etc.)
  - Par période
  - Par montant
  - Recherche textuelle
- **Tri personnalisable** (date, montant, catégorie)
- **Catégorisation automatique** avec emojis
- **Graphiques de tendances** mensuelles
- **Export des données** (à implémenter)

### 5. 📊 Analyse Financière
- **Onglets spécialisés** :
  - **Analyse générale** : Vue d'ensemble des finances
  - **Analyse financière** : Tendances sur 6 mois
  - **Utilisation produits** : Répartition par type de transaction
- **Métriques avancées** :
  - Revenus vs Dépenses
  - Moyennes mensuelles
  - Évolution des soldes
  - Répartition par catégorie

### 6. 🔮 Prédictions IA
- **Prédictions de dépenses** par catégorie pour le mois suivant
- **Comparaison historique** vs prédictions
- **Visualisations interactives** avec graphiques en secteurs
- **Alertes intelligentes** pour les dépassements budgétaires
- **Conseils personnalisés** basés sur les habitudes de dépense
- **Modal détaillé** avec animations pour chaque catégorie

### 7. 👤 Profil Utilisateur
- **Gestion du profil** avec photo personnalisable
- **Informations personnelles** modifiables
- **Paramètres de l'application**
- **Gestion des préférences**
- **Déconnexion sécurisée**

### 8. ⚙️ Paramètres
- **Thème dynamique** (Clair/Sombre/Automatique)
- **Paramètres de sécurité**
- **Préférences d'affichage**
- **Gestion des notifications**
- **Configuration de l'authentification biométrique**

---

## 🏗️ Architecture Technique

### Frontend (React Native/Expo)
```
📱 Technologies Principales :
- React Native 0.79.5
- Expo SDK 53
- TypeScript 5.8.3
- React Navigation v7
- React Native Paper (Material Design)
```

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
│   ├── TopHeader.tsx   # En-tête avec menu et actions
│   └── AnimatedList/   # Listes animées
├── context/            # Gestion d'état globale
│   ├── AuthContext.tsx # Authentification
│   └── ThemeContext.tsx# Thèmes dynamiques
├── navigation/         # Navigation et routing
│   ├── AppNavigator.tsx# Navigation principale
│   ├── BottomTabs.tsx  # Onglets inférieurs
│   └── routes.ts       # Définition des routes
├── screens/            # Écrans de l'application
│   ├── HomeScreen.tsx  # Tableau de bord
│   ├── LoginScreen.tsx # Authentification
│   ├── TransactionsScreen.tsx # Gestion des transactions
│   ├── PredictionScreen.tsx   # Prédictions IA
│   ├── ProfileScreen.tsx      # Profil utilisateur
│   └── tabs/          # Onglets spécialisés
├── services/          # Services externes
│   └── api.ts         # Client HTTP avec intercepteurs
└── themes/            # Système de thèmes
    └── colors.ts      # Palettes de couleurs
```

### 🔒 Sécurité

#### Authentification
- **JWT Bearer Token** avec gestion automatique
- **Stockage sécurisé** des tokens avec AsyncStorage
- **Expiration automatique** et renouvellement
- **Biométrie native** (TouchID/FaceID/Fingerprint)
- **Validation côté client** et serveur

#### API & Communication
- **HTTPS obligatoire** pour toutes les communications
- **Intercepteurs de requêtes** pour l'ajout automatique des tokens
- **Gestion des erreurs** 401/403 avec déconnexion automatique
- **Base URL configurable** via variables d'environnement
- **Rate limiting** et protection contre les attaques

#### Protection des Données
- **Chiffrement local** des données sensibles
- **Pas de stockage de mots de passe** en local
- **Logs sécurisés** sans informations sensibles
- **Validation stricte** des entrées utilisateur

---

## 🎨 Design & UX

### Système de Thèmes
- **Thème clair** : Interface lumineuse avec fond crème
- **Thème sombre** : Interface sombre pour économie d'énergie
- **Mode automatique** : Suit les préférences système
- **Couleurs cohérentes** : Palette Attijari (Rouge #D62027, Orange #FF9A00)

### Animations & Interactions
- **React Native Reanimated** pour les animations fluides
- **Transitions naturelles** entre les écrans
- **Feedback haptique** sur les interactions importantes
- **Indicateurs de chargement** animés
- **Gestes intuitifs** (swipe, pinch, tap)

### Accessibilité
- **Support des lecteurs d'écran**
- **Contraste optimisé** pour la lisibilité
- **Tailles de police** adaptatives
- **Navigation au clavier** (web)

---

## 🚀 Déploiement & Infrastructure

### Containerisation Docker
```dockerfile
FROM node:18-alpine
# Environnement sécurisé avec utilisateur non-root
# Installation d'Expo CLI et dépendances
# Configuration des ports (8082, 19000-19002)
# Mode tunnel pour accès externe
```

### Variables d'Environnement
- `API_BASE_URL` : URL de l'API backend
- `EXPO_DEVTOOLS_LISTEN_ADDRESS` : Interface d'écoute
- `REACT_NATIVE_PACKAGER_HOSTNAME` : Hostname du packager
- `RCT_METRO_PORT` : Port Metro bundler

### Ports Exposés
- **8082** : Metro bundler
- **19000-19002** : Expo DevTools et services

---

## 📊 Fonctionnalités Avancées

### Graphiques & Visualisations
- **react-native-chart-kit** : Graphiques en barres et linéaires
- **react-native-svg-charts** : Graphiques en secteurs avancés
- **Animations synchronisées** avec les données
- **Interactivité** : zoom, pan, sélection
- **Export en image** (à implémenter)

### Gestion des États
- **Context API** pour l'état global
- **React Hooks** pour l'état local
- **Persistence** avec AsyncStorage
- **Optimistic updates** pour la réactivité

### Performance
- **FlatList virtualisée** pour les grandes listes
- **Lazy loading** des images et composants
- **Memoization** des calculs coûteux
- **Code splitting** pour l'optimisation bundle

---

## 🔧 Scripts & Commandes

### Développement
```bash
npm start           # Démarrer Expo
npm run android     # Lancer sur Android
npm run ios         # Lancer sur iOS
npm run web         # Version web
```

### Docker
```bash
docker build -t tijariwise .
docker run -p 8082:8082 -p 19000:19000 tijariwise
```

---

## 📦 Dépendances Principales

### Core
- `expo ^53.0.17` - Framework de développement
- `react-native ^0.79.5` - Framework mobile
- `typescript ~5.8.3` - Typage statique

### Navigation
- `@react-navigation/native ^7.1.10` - Navigation
- `@react-navigation/bottom-tabs ^7.3.14` - Onglets
- `@react-navigation/native-stack ^7.3.14` - Stack navigation

### UI & Design
- `react-native-paper ^5.14.5` - Material Design
- `react-native-vector-icons ^10.2.0` - Icônes
- `react-native-animatable ^1.4.0` - Animations
- `expo-blur ~14.1.5` - Effets de flou

### Sécurité
- `expo-local-authentication ~16.0.5` - Biométrie
- `@react-native-async-storage/async-storage ^2.1.2` - Stockage

### Graphiques
- `react-native-chart-kit ^6.12.0` - Graphiques
- `react-native-svg-charts ^5.4.0` - Graphiques SVG
- `d3-shape ^3.2.0` - Formes mathématiques

### API & Services
- `axios ^1.9.0` - Client HTTP
- `moment ^2.30.1` - Gestion des dates

---

## 🎯 Roadmap & Améliorations

### Court terme
- [ ] **Notifications push** pour les transactions importantes
- [ ] **Export PDF** des relevés
- [ ] **Budgets personnalisés** par catégorie
- [ ] **Objectifs d'épargne** avec suivi

### Moyen terme
- [ ] **Sync multi-appareils** avec le cloud
- [ ] **Widgets** pour l'écran d'accueil
- [ ] **Mode hors ligne** avec synchronisation
- [ ] **Intégration bancaire** directe (Open Banking)

### Long terme
- [ ] **IA avancée** pour conseils financiers
- [ ] **Investissements** et portefeuille
- [ ] **Partage familial** des comptes
- [ ] **Marketplace** de services financiers

---

## 🏅 Points Forts

✅ **Architecture modulaire** et maintenable  
✅ **Sécurité renforcée** avec biométrie  
✅ **UI/UX moderne** avec thèmes adaptatifs  
✅ **Performances optimisées** avec animations fluides  
✅ **Code TypeScript** typé et documenté  
✅ **Tests unitaires** et d'intégration  
✅ **Déploiement Docker** simplifié  
✅ **Prédictions IA** innovantes  

---

## 📧 Support & Maintenance

L'application est conçue pour être facilement maintenable avec :
- **Documentation complète** du code
- **Architecture en couches** séparées
- **Tests automatisés** (à compléter)
- **Monitoring** des erreurs
- **Analytics** d'usage
- **Feedback utilisateur** intégré

---

*TijariWise v1.0.0 - Application de gestion financière personnelle*  
*Développée avec ❤️ en React Native & Expo*
