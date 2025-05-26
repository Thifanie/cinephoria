# Stage 1 : Compiler et construire l'application Angular

# Téléchargement de l'image node pour installer les dépendances du projet
FROM node:22-alpine AS build

# Crée un utilisateur non root (pour éviter que quelqu'un exploite une faille avec les droits root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Donner les permissions à appuser sur /app et installer les dépendances
# (en tant que root)
RUN chown -R appuser:appgroup /app && npm install

# Copier le reste du projet dans le /app
COPY . .

# Donner à nouveau les permissions sur tous les fichiers copiés
RUN chown -R appuser:appgroup /app

# Copier le script wait-for-db.sh dans le conteneur
COPY ./wait-for-db.sh /app/wait-for-db.sh

# Donner les permissions d'exécution au script
RUN chmod +x /app/wait-for-db.sh

# Passe à l'utilisateur non root
USER appuser

# Exposer le port 3000
EXPOSE 3000

# Exécuter le script wait-for-db.sh
CMD ["/bin/sh", "/app/wait-for-db.sh"]
