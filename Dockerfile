# Stage 1 : Compiler et construire le code source Angular

# Téléchargement de l'image node pour installer les dépendances du projet
FROM node:18-alpine3.19 AS build

WORKDIR /app
# Copie du code dans le /app
COPY . .
# Installation des dépendances
RUN npm install
# Construction de l'application
RUN npm run build

# Stage 2 : Mettre à disposition un serveur web

# Téléchargement d'une image nginx
FROM nginx:alpine3.19

# Importation de notre configuration nginx à la place de celle par defaut
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copier le resultat du "build" dans mon serveur
COPY --from=build /app/dist/cinephoria-web /usr/share/nginx/html

# Ecouter sur le port 80
EXPOSE 80