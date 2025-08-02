# 📱 TijariWise - Frontend Mobile

> Application mobile de gestion financière personnelle développée avec React Native & Expo

[![React Native](https://img.shields.io/badge/React_Native-0.79.5-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.17-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

## 🚀 Aperçu

TijariWise est une application mobile moderne qui permet aux utilisateurs de gérer leurs finances personnelles avec des fonctionnalités avancées d'analyse et de prédiction basées sur l'IA.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification sécurisée** avec biométrie (TouchID/FaceID)
- 💳 **Gestion multi-comptes** avec support des devises
- 📊 **Tableaux de bord interactifs** avec graphiques en temps réel
- 💰 **Suivi des transactions** avec filtrage avancé
- 🔮 **Prédictions IA** pour les dépenses futures
- 🎨 **Thèmes adaptatifs** (clair/sombre/automatique)
- 📱 **Interface Material Design** responsive

## 🛠️ Technologies

### Core Stack
- **React Native** 0.79.5 - Framework mobile cross-platform
- **Expo** 53.0.17 - Plateforme de développement
- **TypeScript** 5.8.3 - Typage statique
- **React Navigation** v7 - Navigation native

### UI & Design
- **React Native Paper** - Material Design
- **React Native Vector Icons** - Iconographie
- **React Native Reanimated** - Animations fluides
- **Expo Blur** - Effets visuels

### Sécurité & Storage
- **Expo Local Authentication** - Biométrie
- **AsyncStorage** - Stockage local sécurisé
- **Axios** - Client HTTP avec intercepteurs JWT

### Graphiques & Visualisation
- **React Native Chart Kit** - Graphiques statistiques
- **React Native SVG Charts** - Graphiques vectoriels
- **D3 Shape** - Formes mathématiques

## 📋 Prérequis

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (pour Android) ou **Xcode** (pour iOS)

## 🔧 Installation

### 1. Cloner le repository
```bash
git clone <repository-url>
cd TijariWise
```

### 2. Installer les dépendances
```bash
npm install --legacy-peer-deps
```

### 3. Configuration
Créer un fichier `.env` :
```env
API_BASE_URL=http://your-backend-url:8081
```

### 4. Lancer l'application
```bash
# Développement
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🐳 Docker

### Build de l'image
```bash
docker build -t tijariwise-mobile .
```

### Lancement du conteneur
```bash
docker run -p 8082:8082 -p 19000:19000 tijariwise-mobile
```

L'application sera accessible via Expo Go en scannant le QR code.

## 📁 Structure du Projet

```
src/
├── components/              # Composants réutilisables
│   ├── TopHeader.tsx       # En-tête principal
│   └── AnimatedList/       # Listes avec animations
├── context/                # Gestion d'état globale
│   ├── AuthContext.tsx     # Authentification
│   └── ThemeContext.tsx    # Système de thèmes
├── navigation/             # Configuration navigation
│   ├── AppNavigator.tsx    # Navigation principale
│   ├── BottomTabs.tsx      # Onglets inférieurs
│   └── routes.ts           # Types de routes
├── screens/                # Écrans de l'application
│   ├── LoginScreen.tsx     # Connexion
│   ├── HomeScreen.tsx      # Tableau de bord
│   ├── TransactionsScreen.tsx  # Gestion transactions
│   ├── PredictionScreen.tsx    # Prédictions IA
│   ├── ProfileScreen.tsx       # Profil utilisateur
│   └── tabs/              # Onglets spécialisés
├── services/              # Services externes
│   └── api.ts            # Client HTTP
└── themes/               # Configuration thèmes
    └── colors.ts         # Palettes de couleurs
```

## 🔐 Sécurité

### Authentification
- **JWT Bearer Tokens** avec expiration automatique
- **Biométrie native** (TouchID, FaceID, Fingerprint)
- **Stockage sécurisé** avec AsyncStorage chiffré
- **Intercepteurs HTTP** pour la gestion des tokens

### Protection des Données
- Validation stricte des entrées utilisateur
- Pas de stockage de mots de passe en local
- Communication HTTPS obligatoire
- Logs sécurisés sans données sensibles

## 🎨 Thèmes

L'application supporte 3 modes d'affichage :

- **🌞 Thème Clair** : Interface lumineuse optimisée
- **🌙 Thème Sombre** : Mode économie d'énergie

Palette de couleurs Attijari :
- **Rouge Principal** : `#D62027`
- **Orange Accent** : `#FF9A00`

## 📊 Fonctionnalités Avancées

### Tableau de Bord
- Soldes des comptes en temps réel
- Graphiques interactifs (barres, lignes, secteurs)
- Transactions récentes avec navigation
- Animations fluides

### Transactions
- Liste avec pagination optimisée
- Filtrage multi-critères avancé
- Recherche textuelle instantanée
- Catégorisation avec emojis

### Prédictions IA
- Analyse des habitudes de dépense
- Prédictions mensuelles par catégorie
- Alertes de dépassement budgétaire
- Conseils personnalisés

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Coverage
npm run test:coverage
```

## 📱 Déploiement

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
expo build:android --release-channel production
expo build:ios --release-channel production
```

### Store Deployment
```bash
# Google Play Store
expo upload:android

# Apple App Store
expo upload:ios
```
---