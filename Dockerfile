# Utilisation de Docker Compose pour gérer les services
FROM docker:cli

WORKDIR /app

# Copie des fichiers nécessaires
COPY . .

# Lancer Docker Compose
CMD ["docker-compose", "--env-file", "backend/.env", "up", "-d", "--build"]
