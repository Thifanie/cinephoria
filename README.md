# cinephoria-web

Ce projet a été généré en utilisant [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.
Le back-end a été géré par nodeJS version 22.12.0.

# Pré-requis

Les outils utilisés sont :

- Visual Studio Code pour l'IDE
- Angular CLI pour la partie front
- nodeJS pour la partie back
- Mariadb pour la base de données SQL :
  - DataGrip a été utilisé pour la gestion de la base de données
  - il faut créer une base de données et remplacer les valeurs par défaut dans le fichier .env par les informations de connexion à la base de données

# Architecture

Le projet sépare le front-end du back-end par deux sous-dossiers appelés "frontend" et "backend".
Ces deux dossiers possèdent chacun un fichier package.json et un Dockerfile.
Le dossier "frontend" comporte le dossier src et public de l'application.
Le dossier "backend" contient le serveur Express, le fichier relatif à la base de données, les routes, et le service de récupération de données de l'application.

## Lancement en local

Pour lancer le projet en local :

- Partie front : dans le dossier "frontend", commande "npm start"
- Partie back : dans le dossier "backend", commande "node server.js"

Quand le serveur est en route, ouvrir le navigateur à l'URL `http://localhost:4200/`. L'application se recharge automatiquement lors de changement dans les fichiers sources.

# Docker

Un fichier Dockerfile a été créé dans les dossiers "frontend" et "backend" et un fichier "docker-compose.yml" à la racine du projet. Les Dockerfile permettent la création des images correspondantes et le fichier "docker-compose.yml" permet de relier les conteneurs entre eux.
A la racine du projet, taper la commande "docker compose --env-file backend/.env up -d --build" pour créer les images et conteneurs frontend, backend et mariadb connectés entre eux.

## Gestion du projet Angular

Pour générer un nouveau composant :

```bash
ng generate component component-name
```

Pour générer un nouveau service :

```bash
ng generate service service-name
```

Pour générer un nouveau pipe :

```bash
ng generate pipe pipe-name
```

## Building

Pour build le projet :

```bash
npm build
```

Cette commande va compiler le projet et stocker les fichiers de build générés dans le dossier `dist/`.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Sonarqube

Lancer l'image Docker de Sonarqube : docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
Se connecter sur http://localhost:9000 avec ses identifiants Sonarqube
Pour analyser un dossier (frontend ou backend) :

- installer le scanner à la racine du dossier avec la commande : npm install --save-dev sonarqube-scanner
- créer un fichier sonar-project.properties à la racine du dossier contenant les propriétés pour réaliser le scan
- ajouter le script "sonar": "npx sonarqube-scanner" dans le package.json
- lancer la commande : npm run sonar
- consulter les résultats sur http://localhost:9000

## Ressources additionnelles

Pour plus d'informations sur le CLI Angular, visiter la page https://angular.dev/tools/cli.
