# Stage 1 : Compiler et construire l'application Angular

# Téléchargement de l'image node pour installer les dépendances du projet
FROM node:18-alpine3.19 AS build

WORKDIR /app

# Installer Python, Make et G++ pour node-gyp
# RUN apk add --no-cache python3 make g++

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installe les dépendances et recompile bcrypt pour l’architecture Linux du conteneur 
RUN npm install
# && npm uninstall bcrypt && npm install bcrypt --build-from-source 

# Copier le reste du projet dans le /app
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer Nginx
CMD ["npm", "start"]