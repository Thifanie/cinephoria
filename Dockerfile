# Stage 1 : Compiler et construire l'application Angular

# Téléchargement de l'image node pour installer les dépendances du projet
FROM node:18-alpine3.19 AS build

WORKDIR /app

# Copier les fichiers nécessaires, installation des dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du projet dans le /app
COPY . .

# Construction de l'application
RUN npm run build --prod

# Stage 2 : Mettre à disposition un serveur web nginx

# Téléchargement d'une image nginx
FROM nginx:alpine3.19

# Copier le resultat du "build" dans mon serveur
COPY --from=build /app/dist/cinephoria-web /usr/share/nginx/html

# Copier la configuration Nginx personnalisée à la place de celle par defaut
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]