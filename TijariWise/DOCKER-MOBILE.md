# Documentation Docker pour TijariWise Mobile

## 📱 Application Mobile React Native/Expo

Configuration Docker optimisée pour le développement mobile React Native avec Expo SDK 53.0.17.

## 🚀 Démarrage rapide

```powershell
# Démarrer l'environnement
docker-compose up -d

# Voir le QR code
docker logs tijariwise-expo

# Arrêter
docker-compose down
```

## 📱 Images Docker

- **abdelmouhaimen/mobile:v6** : Version actuelle avec API dynamique
- **abdelmouhaimen/mobile:v5** : Configuration API optimisée
- **abdelmouhaimen/mobile:v4** : Tunnel mode et permissions
- **abdelmouhaimen/mobile:v3** : Tunnel mode (QR code)
- **abdelmouhaimen/mobile:v2** : LAN mode
- **abdelmouhaimen/mobile:v1** : Version initiale

## 📱 Test mobile avec QR Code

1. **Installez Expo Go** sur votre téléphone
2. **Lancez** : `docker-compose up -d`
3. **Voir QR code** : `docker logs tijariwise-expo`
4. **Scannez** avec Expo Go

## 🔧 Commandes essentielles

```powershell
# Construction
docker build -t abdelmouhaimen/mobile:v6 .

# Gestion conteneur
docker-compose up -d
docker-compose restart tijariwise-mobile
docker-compose down

# Logs et debug
docker logs tijariwise-expo
docker-compose exec tijariwise-mobile bash
```

## 🌐 Ports et accès

- **8082** : Metro Bundler
- **19000-19002** : Expo DevTools
- **Web** : http://localhost:8082

## 🔗 Configuration API v6

```yaml
environment:
  - API_BASE_URL=http://192.168.0.169:8081
  - REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.169
  - RCT_METRO_PORT=8082
```

- **Backend** : `http://192.168.0.169:8081`
- **Login** : `/auth/login`
- **Test** : `mouha@pfm.com` / `mypassword`

## 🔍 Dépannage rapide

```powershell
# Problèmes courants
docker logs tijariwise-expo              # Voir les erreurs
docker-compose restart tijariwise-mobile # Redémarrer
docker system prune -f                   # Nettoyer
docker-compose build --no-cache          # Reconstruire
```

**Version** : Juillet 2025 - v6
