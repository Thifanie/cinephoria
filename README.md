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

## Lancement en local

Pour lancer le projet en local :

- Partie front : commande "npm start"
- Partie back : commande "node projects\cinephoria-web\src\server.js"

Quand le serveur est en route, ouvrir le navigateur à l'URL `http://localhost:4200/`. L'application se recharge automatiquement lors de changement dans les fichiers sources.

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

## Ressources additionnelles

Pour plus d'informations sur le CLI Angular, visiter la page https://angular.dev/tools/cli.
