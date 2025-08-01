# 🔄 Système Batch TijariWise

## 📋 Vue d'Ensemble

Le système batch traite automatiquement les transactions bancaires depuis des fichiers CSV avec classification IA intégrée.

**Fonctionnement** : CSV → Surveillance (5s) → Lecture → Classification IA → Base de données

## 🏗️ Architecture

### 📦 Composants
- **BatchScheduler** : Surveillance automatique du fichier CSV
- **Reader** : Lecture des données CSV
- **Processor** : Classification IA des transactions  
- **Writer** : Insertion en base Oracle

## ⚙️ Configuration

### 📄 Variables Principales (application.properties)
```properties
pfm.batch.csv.path=/data/transactions11.csv
spring.batch.job.enabled=true
```

##  Format CSV

### 📋 Structure
```csv
bhLib,dco,mon,sen,iban,produit
"Description","YYYY-MM-DD",montant,"C/D","IBAN","Type"
```

### 📊 Colonnes
- **bhLib** : Description de la transaction
- **dco** : Date (YYYY-MM-DD)  
- **mon** : Montant (positif=crédit, négatif=débit)
- **sen** : Sens ("C"=Crédit, "D"=Débit)
- **iban** : IBAN du compte
- **produit** : Type de produit bancaire

### ✅ Exemple
```csv
"Salaire juillet","2024-07-29",2500.00,"C","IBAN123456","Virement"
"Courses Carrefour","2024-07-29",-89.50,"D","IBAN123456","Carte"
```

## 🕒 Surveillance Automatique

**Fréquence** : Vérification toutes les 5 secondes  
**Déclenchement** : Si le fichier CSV est modifié  
**Traitement** : Automatique, aucune intervention requise

## 🤖 Classification IA

**API** : `http://localhost:5002/class`  
**Modèle** : CatBoost Classifier  
**Catégories** : Alimentation, Transport, Loisirs, Santé, Logement, Autres

**Format** :
```json
// Requête
{"description": "Achat Carrefour"}

// Réponse  
{"categorie": "Alimentation", "confidence": 0.89}
```

## 💾 Écriture en Base de Données

**Writer** : JpaItemWriter  
**Gestion doublons** : Vérification automatique  
**Association** : Liaison avec compte bancaire via IBAN

## 📊 Monitoring

### � Vérification Status
```bash
# Statut conteneurs
docker ps | grep -E "(backend|classification)"

# Logs temps réel
docker logs gitlab-copie-backend-1 -f
```

### 📋 Logs de Performance
```
🚀 Job démarré - Fichier: transactions11.csv
📊 Transactions traitées: 1,250
✅ Succès: 1,247 (99.8%) | ❌ Erreurs: 3 (0.2%)
⏱️ Durée: 45.2s | 📈 Débit: 27.6 tx/sec
```

## 🚀 Utilisation Pratique

### 📝 Ajouter des Nouvelles Transactions

**3 Méthodes disponibles :**

1. **Modification directe** dans le conteneur
2. **Copie de fichier** vers le conteneur  
3. **Volume partagé** (recommandé)

### ⏱️ Délais de Traitement
- **Détection** : Maximum 5 secondes
- **1-100 transactions** : ~5-10 secondes
- **100-1000 transactions** : ~30-60 secondes

## 🔧 Dépannage

### ❌ Problèmes Courants

**Batch ne se déclenche pas** :
```bash
docker exec gitlab-copie-backend-1 ls -la /data/transactions11.csv
docker logs gitlab-copie-backend-1 | grep ERROR
```

**Erreurs IA (Catégorie "ERREUR_API")** :
```bash
# Vérifier le service de classification
docker ps | grep classification
curl http://localhost:5002/health

# Redémarrer le service IA si nécessaire
docker restart gitlab-copie-classification-1
```

**Solutions d'urgence** :
```bash
# Relancer manuellement
curl -X POST http://localhost:8081/api/batch/categorize

# Redémarrer le service
docker restart gitlab-copie-backend-1
```

### 📋 Explication des Messages de Log

**Log de succès typique** :
```
✅ Transaction insérée pour IBAN IBAN7 | Montant: 1200.0 | Catégorie: Alimentation | Date: 2025-05-31
```

**Si catégorie = "ERREUR_API"** :
- L'API de classification IA n'est pas disponible
- La transaction est quand même sauvegardée
- Solution : Redémarrer le service classification

## 📚 Références

### � Endpoints Utiles
- **Backend Health** : `http://localhost:8081/actuator/health`
- **IA Classification** : `http://localhost:5002/class`  
- **Oracle Console** : `http://localhost:8080/apex`

### 📁 Fichiers Clés
- `application.properties` : Configuration Spring Boot
- `BatchScheduler.java` : Surveillance automatique
- `TransactionItemProcessor.java` : Classification IA

---

**🔄 Système Batch TijariWise - Traitement Automatisé et Intelligent** 🚀
