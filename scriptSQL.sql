-- Script SQL pour créer et peupler la table "films" dans la base de données cinephoria
-- Auteur : Thifanie CHRISTINE  
-- Date : 6/03/2025
-- Base de données : cinephoria
-- Version SQL : MariaDB 11.5
-- Prérequis : Aucune donnée initiale

-- 1. Création de la table "films"
-- Cette table stocke les informations des films de l'application.
CREATE TABLE films (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique du film
    title VARCHAR(100) NOT NULL,                -- Titre du film
    actors VARCHAR(300) NOT NULL,               -- Liste des acteurs jouant dans le film
    description VARCHAR(999) NOT NULL,          -- Court synopsis du film
    minAge INT,                                 -- Age minimum recommandé pour regarder le film
    favorite TINYINT(1) DEFAULT 0,              -- Booléen si le film est un coup de coeur ou pas
    opiniondecimal(2, 1),                       -- Note global du film
    moviePoster VARCHAR(100) NOT NULL,          -- URL de l'affiche du film
    onView TINYINT(1) default 0 NOT NULL        -- Booléen si le film est actuellement à l'affiche ou pas
);

-- 2. Création de la table "type"
-- Cette table stocke les genres de films.
CREATE TABLE type (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique du genre
    type VARCHAR(50) NOT NULL,                  -- Genre de film
);

-- 3. Création de la table "films_type"
-- Cette table est une table de jointure entre les tables films et type.
CREATE TABLE films_type (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique
    idFilm INT NOT NULL,                        -- Identifiant du film
    idType INT NOT NULL,                        -- Identifiant du genre
    CONSTRAINT films_type_films_id_fk
        FOREIGN KEY (idFilm) REFERENCES films (id),
    CONSTRAINT films_type_type_id_fk
        FOREIGN KEY (idType) REFERENCES type (id)
);

-- 4. Création de la table "cinema"
-- Cette table stocke les cinémas.
CREATE TABLE cinema (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique du cinéma
    name VARCHAR(50) NOT NULL,                  -- Nom du cinéma
);

-- 5. Création de la table "quality"
-- Cette table stocke les qualités de film.
CREATE TABLE quality (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de la qualité de film
    quality VARCHAR(30) NOT NULL,               -- Type de qualité
    price INT NOT NULL,                         -- Prix de la séance à cette qualité
);

-- 6. Création de la table "room"
-- Cette table stocke les salles de cinéma.
CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de la salle de cinéma
    name VARCHAR(20) NOT NULL,                  -- Nom de la salle de cinéma
    places INT NOT NULL,                        -- Nombre de places total dans la salle
    idCinema INT NOT NULL,                      -- Identifiant du cinéma associé à la salle
    idQuality INT NOT NULL,                     -- Identifiant de la qualité associée à la salle
    CONSTRAINT room_cinema_id_fk
        FOREIGN KEY (idCinema) REFERENCES cinema (id),
    CONSTRAINT room_quality_id_fk
        FOREIGN KEY (idQuality) REFERENCES quality (id)
);

-- 7. Création de la table "session"
-- Cette table stocke les séances de film.
CREATE TABLE session (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de la séance de film
    date VARCHAR(15) NOT NULL,                  -- Date de la séance de film
    startHour VARCHAR(10) NOT NULL,             -- Heure de début de la séance
    endHour VARCHAR(10) NOT NULL,               -- Heure de fin de la séance
    idFilm INT NOT NULL,                        -- Identifiant du film associé à la séance
    idCinema INT NOT NULL,                      -- Identifiant du cinéma associé à la séance
    idRoom INT NOT NULL,                        -- Identifiant de la salle de cinéma associée à la séance
    reservedSeats VARCHAR(200),                 -- Sièges réservés
    CONSTRAINT session_cinema_id_fk
        FOREIGN KEY (idCinema) REFERENCES cinema (id),
    CONSTRAINT session_films_id_fk
        FOREIGN KEY (idFilm) REFERENCES films (id)
);

-- 8. Création de la table "user"
-- Cette table stocke les utilisateurs inscrits sur l'application.
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de l'utilisateur
    firstname VARCHAR(20) NOT NULL,             -- Prénom de l'utilisateur
    name VARCHAR(20) NOT NULL,                  -- Nom de l'utilisateur
    username VARCHAR(20) NOT NULL,              -- Nom d'utilisateur
    email VARCHAR(40) NOT NULL,                 -- Adresse mail de l'utilisateur
    password VARCHAR(300) NOT NULL,             -- Mot de passe de l'utilisateur
    role VARCHAR(20),                           -- Rôle de l'utilisateur
);

-- 9. Création de la table "order"
-- Cette table stocke les réservations de séances de film.
CREATE TABLE order (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de la réservation
    idUser INT NOT NULL,                        -- Identifiant de l'utilisateur associé à la réservation
    idFilm INT NOT NULL,                        -- Identifiant du film associé à la réservation
    idCinema INT NOT NULL,                      -- Identifiant du cinéma associé à la réservation
    idSession INT NOT NULL,                     -- Identifiant de la séance de film associée à la réservation
    idRoom INT NOT NULL,                        -- Identifiant de la salle de cinéma associée à la réservation
    date VARCHAR(30) NOT NULL,                  -- Date de la réservation
    viewed TINYINT(1) NOT NULL,                 -- Booléen si la séance a été visionnée ou pas
    placesNumber VARCHAR(200) NOT NULL,         -- Les numéros des sièges réservés
    pric INT NOT NULL,                          -- Prix de la réservation
    CONSTRAINT order_cinema_id_fk
        FOREIGN KEY (idCinema) REFERENCES cinema (id),
    CONSTRAINT order_films_id_fk
        FOREIGN KEY (idFilm) REFERENCES films (id)
    CONSTRAINT order_room_id_fk
        FOREIGN KEY (idRoom) REFERENCES room (id)
    CONSTRAINT order_session_id_fk
        FOREIGN KEY (idSession) REFERENCES session (id)
    CONSTRAINT order_users_id_fk
        FOREIGN KEY (idUser) REFERENCES user (id)
);

-- 10. Création de la table "opinion"
-- Cette table stocke les avis d'utilisateur sur un film.
CREATE TABLE opinion (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identifiant unique de l'avis
    idUser INT NOT NULL,                        -- Identifiant de l'utilisateur associé à l'avis
    idFilm INT NOT NULL,                        -- Identifiant du film associé à l'avis
    note INT NOT NULL,                          -- Note donnée par l'utilisateur
    description VARCHAR(500) NOT NULL,          -- Description de l'avis
    CONSTRAINT opinion_films_id_fk
        FOREIGN KEY (idFilm) REFERENCES films (id)
    CONSTRAINT opinion_user_id_fk
        FOREIGN KEY (idUser) REFERENCES user (id)
);

-- 2. Insertion de données d'exemple
-- Ces utilisateurs sont ajoutés pour tester l'application et les fonctionnalités de connexion.
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@cinephoria.com', 'hashed_password'),
('john_doe', 'john.doe@cinephoria.com', 'hashed_password');

-- Script terminé. La table "users" a été créée et les données ont été insérées avec succès.
