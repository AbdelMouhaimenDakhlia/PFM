# Dockerfile pour application mobile React Native/Expo
FROM node:18-alpine

# Installation des outils système nécessaires
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    bash \
    curl

# Création d'un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S expo -u 1001 -G nodejs

# Définit le répertoire de travail
WORKDIR /app

# Changement de propriétaire du répertoire
RUN chown -R expo:nodejs /app
RUN mkdir -p /home/expo/.expo && chown -R expo:nodejs /home/expo/.expo
USER expo

# Copie des fichiers de dépendances
COPY --chown=expo:nodejs package*.json ./

# Installation des dépendances avec résolution des conflits
RUN npm install --legacy-peer-deps

# Installation d'Expo CLI globalement
USER root
RUN npm install -g @expo/cli @expo/ngrok
USER expo

# Copie du code source
COPY --chown=expo:nodejs . .

# Expose les ports nécessaires pour Expo
# 8082: Metro bundler
# 19000: Expo DevTools
# 19001: Expo DevTools
# 19002: Expo DevTools
EXPOSE 8082 19000 19001 19002

# Variables d'environnement pour Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
ENV RCT_METRO_PORT=8082

# Commande par défaut pour démarrer le serveur de développement avec QR code
CMD ["npx", "expo", "start", "--tunnel", "--port", "8082"]
