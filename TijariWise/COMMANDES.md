# 🚀 TijariWise Mobile - Commandes Docker

## Démarrage rapide

```powershell
# 1. Construire l'image
docker build -t abdelmouhaimen/mobile:v6 .

# 2. Démarrer
docker-compose up -d

# 3. Voir QR code
docker logs tijariwise-expo

# 4. Arrêter
docker-compose down
```

## Images Docker

- `abdelmouhaimen/mobile:v6` - **Version actuelle** (API dynamique)
- `abdelmouhaimen/mobile:v5` - Configuration API optimisée
- `abdelmouhaimen/mobile:v4` - Tunnel mode et permissions
- `abdelmouhaimen/mobile:v3` - Metro port 8082
- `abdelmouhaimen/mobile:v2` - Corrections dépendances
- `abdelmouhaimen/mobile:v1` - Version initiale

## Commandes essentielles

### Construction et gestion

```powershell
# Images
docker build -t abdelmouhaimen/mobile:v6 .
docker images
docker rmi abdelmouhaimen/mobile:v5

# Conteneurs
docker-compose up -d
docker-compose down
docker-compose restart tijariwise-mobile
docker logs tijariwise-expo

# Debug
docker exec -it tijariwise-expo bash
docker stats tijariwise-expo
```

### Docker Compose

```powershell
# Gestion complète
docker-compose up -d --build    # Démarrer avec rebuild
docker-compose logs -f          # Logs temps réel
docker-compose restart          # Redémarrer
docker-compose down -v          # Arrêter et supprimer volumes
```

## Configuration API v6

### Variables d'environnement

```yaml
environment:
  - API_BASE_URL=http://192.168.0.169:8081
  - REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.169
  - RCT_METRO_PORT=8082
```

### Migration vers v6

```powershell
# 1. Construire v6
docker build -t abdelmouhaimen/mobile:v6 .

# 2. Mettre à jour docker-compose.yml
# Changer image: abdelmouhaimen/mobile:v6

# 3. Relancer
docker-compose down && docker-compose up -d
```

## Accès et ports

- **Metro Bundler** : Port 8082
- **Expo DevTools** : Ports 19000-19002
- **Web** : `http://localhost:8082`
- **Mobile** : Scanner QR code avec Expo Go

## Dépannage

```powershell
# Diagnostic
docker logs tijariwise-expo                # Erreurs
docker ps                                  # Status conteneurs
docker-compose restart tijariwise-mobile   # Redémarrer
docker system prune -f                     # Nettoyer

# Reconstruction complète
docker-compose down -v
docker rmi abdelmouhaimen/mobile:v6
docker build -t abdelmouhaimen/mobile:v6 .
docker-compose up -d
```

## API Configuration

- **Backend URL** : `http://192.168.0.169:8081`
- **Login endpoint** : `/auth/login`
- **Test credentials** : `mouha@pfm.com` / `mypassword`
- **Token JWT** : Géré automatiquement

**Version** : Juillet 2025 - v6
