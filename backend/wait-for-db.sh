#!/bin/bash

# Attendre que MariaDB soit prêt
until nc -z -v -w30 mariadb 3306; do
  echo "En attente de MariaDB..."
  sleep 1
done

# Démarrer le backend
npm start
