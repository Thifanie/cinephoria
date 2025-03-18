# # Utilisation de Docker Compose pour gérer les services
# FROM docker:cli

# WORKDIR /app

# # Copie des fichiers nécessaires
# COPY . .

# # Lancer Docker Compose
# CMD ["docker-compose", "up", "-d", "--build"]

# Utiliser une image de base officielle de Node.js
FROM node:14-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet dans l'image
COPY . .

# Installer les dépendances
RUN npm install

# Exposer le port 80
EXPOSE 80

# Lancer l'application
CMD ["npm", "start"]
