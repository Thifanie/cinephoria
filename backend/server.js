const express = require("express");
const app = express();
app.disable("x-powered-by"); // Pour masquer l'en-tête HTTP et éviter l'identification de la technologie par des attaquants

const helmet = require("helmet");
// Appliquer les protections par défaut de Helmet (middleware de sécurité pour Express qui ajoute automatiquement plusieurs en-têtes HTTP pour protéger l'application contre des vulnérabilités courantes)
app.use(helmet());

const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
require("dotenv").config();

// Configuration plus sécurisée de CORS
const cors = require("cors");
const corsOptions = {
  origin: [
    "http://localhost:4200",
    "https://cinephoria-frontend-production.up.railway.app",
  ], // Autorise uniquement ces origines
  methods: ["GET", "POST", "PUT", "DELETE"], // Limite les méthodes autorisées
  allowedHeaders: ["Content-Type", "Authorization"], // Limite les en-têtes autorisés
  credentials: true, // Permet d’envoyer les cookies ou les en-têtes d’autorisation si nécessaire
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// Définir un modèle MongoDB pour l'utilisateur
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/films", async (req, res) => {
  try {
    const [films] = await db.pool.query(
      "SELECT films.id, title, actors, description, minage, favorite, opinion, movieposter, onview, GROUP_CONCAT(type SEPARATOR ', ') AS type FROM films JOIN films_type ON films.id = films_type.idFilm JOIN type ON films_type.idType = type.id GROUP BY films.id"
    );
    res.send(films);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
    console.error("Erreur lors de la récupération des films :", err);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/api/admin", async (req, res) => {
  try {
    const result = await db.pool.query(
      "select email, password from railway.admin WHERE name='CHRISTINE'"
    );
    res.send(result[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des utilisateurs :",
      err.message
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

app.get("/api/type", async (req, res) => {
  try {
    const result = await db.pool.query("select * from type");
    res.send(result[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/session/:id", async (req, res) => {
  try {
    const filmId = req.params.id; // Récupère l'id du film depuis l'URL
    const result = await db.pool.query(
      "SELECT session.id, date, startHour, endHour, idFilm, cinema.name AS cinemaName, room.name AS roomName FROM session JOIN railway.cinema on session.idCinema = cinema.id JOIN railway.room ON session.idRoom = room.id WHERE idFilm = ?",
      [filmId] // Paramètre sécurisé pour éviter l'injection SQL
    );
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/session/booking/:id", async (req, res) => {
  try {
    const sessionId = req.params.id; // Récupère l'id de la séance depuis l'URL
    const result = await db.pool.query(
      "SELECT date, startHour, endHour, idFilm, cinema.name AS cinemaName, room.name AS roomName, railway.quality.quality AS quality, railway.quality.price as price, railway.films.moviePoster as moviePoster, railway.films.title, reservedSeats FROM railway.session JOIN railway.cinema on session.idCinema = cinema.id JOIN railway.room ON session.idRoom = room.id JOIN railway.quality ON room.idQuality = quality.id JOIN railway.films ON session.idFilm = films.id WHERE session.id = ?",
      [sessionId] // Paramètre sécurisé pour éviter l'injection SQL
    );
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/session", async (req, res) => {
  try {
    const cinemaId = req.query.cinemaId; // Utilisation de req.query pour accéder au paramètre de la query string

    const result = await db.pool.query(
      "SELECT session.id, date, startHour, endHour, room.name AS roomName, films.title as filmTitle FROM railway.session JOIN railway.room ON session.idRoom = room.id JOIN railway.films ON session.idFilm = films.id WHERE session.idCinema = ?",
      [cinemaId] // Paramètre sécurisé pour éviter l'injection SQL);
    );
    res.send(result[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/session/seats/:id", async (req, res) => {
  try {
    const sessionId = req.params.id; // Utilisation de req.query pour accéder au paramètre de la query string

    const result = await db.pool.query(
      "SELECT room.places FROM railway.session JOIN railway.room ON session.idRoom = room.id WHERE session.id = ?",
      [sessionId] // Paramètre sécurisé pour éviter l'injection SQL);
    );
    res.send(result[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/session/reservedSeats/:id", async (req, res) => {
  try {
    const sessionId = req.params.id; // Utilisation de req.query pour accéder au paramètre de la query string
    console.log("ID session : ", sessionId);
    const result = await db.pool.query(
      "SELECT session.reservedSeats FROM railway.session WHERE session.id = ?",
      [sessionId] // Paramètre sécurisé pour éviter l'injection SQL);
    );
    res.json(result[0][0].reservedSeats);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/room", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM railway.room");
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/room/:cinema", async (req, res) => {
  try {
    const cinema = req.params.cinema; // Utilisation de req.query pour accéder au paramètre de la query string
    const result = await db.pool.query(
      "SELECT room.name FROM railway.room JOIN railway.cinema ON cinema.id = room.idCinema WHERE cinema.name = ?",
      [cinema] // Paramètre sécurisé pour éviter l'injection SQL);
    );
    res.send(result[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération des films :", err.message);
  }
});

app.get("/api/quality", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM railway.quality");
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/cinema", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM railway.cinema");
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/order/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Récupère l'id de l'utilisateur depuis l'URL

    const result = await db.pool.query(
      "SELECT `order`.id, `order`.idUser, `order`.idFilm, `order`.date, `order`.price, `order`.viewed, `order`.placesNumber, `order`.opinionSent, films.moviePoster, films.title, films.actors, films.description, cinema.name as cinemaName, room.name as roomName, quality.quality, session.startHour, session.endHour, session.date as sessionDate, opinion.description as opinionDescription, opinion.note as note FROM `order` JOIN railway.films ON `order`.idFilm = films.id JOIN railway.cinema ON `order`.idCinema = cinema.id JOIN railway.room ON `order`.idRoom = room.id JOIN railway.quality ON room.idQuality = quality.id JOIN railway.session ON `order`.idSession = session.id LEFT JOIN railway.opinion ON `order`.id = opinion.idOrder WHERE `order`.idUser = ? ORDER BY `order`.id DESC",
      [userId] // Paramètre sécurisé pour éviter l'injection SQL
    );

    if (result[0].length === 0) {
      return res
        .status(404)
        .send({ error: "Aucune réservation trouvée pour cet utilisateur" });
    }

    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.post("/api/films", async (req, res) => {
  try {
    const {
      title,
      actors,
      description,
      minAge,
      favorite,
      opinion,
      moviePoster,
      onView,
      types,
    } = req.body;
    console.log("Données reçues:", req.body); // ✅ Vérifier les données avant l'insertion
    const result = await db.pool.query(
      "INSERT INTO films (title, actors, description, minAge, favorite, opinion, moviePoster, onView) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        actors,
        description,
        minAge,
        favorite,
        opinion,
        moviePoster,
        onView,
      ]
    );
    // ✅ Récupérer l'ID du dernier film ajouté
    const insertedFilmId = result.insertId;
    // ✅ Récupérer le film nouvellement inséré
    const [newFilm] = await db.pool.query("SELECT * FROM films WHERE id = ?", [
      insertedFilmId,
    ]);

    // Ajouter les genres du film ajouté à la table de jointure films_type
    if (types && Array.isArray(types)) {
      // Utilisation de Promise.all pour insérer chaque type de manière asynchrone
      await Promise.all(
        types.map((typeId) =>
          db.pool.query(
            "INSERT INTO films_type (idFilm, idType) VALUES (?, ?)",
            [insertedFilmId, typeId]
          )
        )
      );
    }

    res.status(201).json(newFilm);
  } catch (err) {
    console.error("Error inserting film:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { firstname, name, username, email, password, role } = req.body;

    // Vérifier que l'utilisateur existe déjà avec le même email ou nom d'utilisateur
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "L'utilisateur ou l'email existe déjà" });
    }

    // Générer un sel et hacher le mot de passe
    const saltRounds = 10; // Nombre d'itérations pour renforcer le hachage
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstname,
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Sauvegarder l'utilisateur dans MongoDB
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Vérifier que l'utilisateur existe déjà avec le même email ou nom d'utilisateur
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "L'email n'est pas enregistré" });
  } else if (
    existingUser &&
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return res.status(401).json({ message: "Mot de passe incorrect" });
  }

  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.post("/api/order", async (req, res) => {
  try {
    const {
      idUser,
      idFilm,
      cinemaName,
      idSession,
      roomName,
      date,
      viewed,
      placesNumber,
      price,
      opinionSent,
    } = req.body;

    const cinemaResult = await db.pool.query(
      "SELECT cinema.id FROM cinema WHERE cinema.name = ?",
      [cinemaName]
    );
    const roomResult = await db.pool.query(
      "SELECT room.id FROM room WHERE room.name = ?",
      [roomName]
    );

    const idCinema = cinemaResult[0][0].id; // Extraire l'ID du cinéma
    const idRoom = roomResult[0][0].id; // Extraire l'ID de la salle

    console.log("Données reçues:", req.body); // ✅ Vérifier les données avant l'insertion
    const result = await db.pool.query(
      "INSERT INTO `order` (idUser, idFilm, idCinema, idSession, idRoom, date, viewed, placesNumber, price, opinionSent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        idUser,
        idFilm,
        idCinema,
        idSession,
        idRoom,
        date,
        viewed,
        placesNumber,
        price,
        opinionSent,
      ]
    );

    // On récupère les places réservées de la session actuelle
    const reservedSeatsResult = await db.pool.query(
      "SELECT reservedSeats FROM railway.session WHERE session.id = ?",
      [idSession]
    );

    console.log(reservedSeatsResult[0][0].reservedSeats);

    // Si des places sont déjà réservées, les places de la réservation actuelle sont ajoutées à la liste des places
    //  réservées de la session actuelle
    if (
      reservedSeatsResult[0][0].reservedSeats !== "" &&
      reservedSeatsResult[0][0].reservedSeats !== null
    ) {
      await db.pool.query(
        "UPDATE railway.session SET reservedSeats = CONCAT(reservedSeats, ', ', ?) WHERE session.id = ?",
        [placesNumber, idSession]
      );
      // Sinon elles remplacent la valeur nulle de la colonne des places réservées de la session actuelle.
    } else if (
      reservedSeatsResult[0][0].reservedSeats === "" ||
      reservedSeatsResult[0][0].reservedSeats === null
    ) {
      await db.pool.query(
        "UPDATE railway.session SET reservedSeats = ? WHERE id = ?",
        [placesNumber, idSession]
      );
    }

    // ✅ Récupérer l'ID de la dernière réservation ajoutée
    const insertedOrderId = result.insertId;
    // ✅ Récupérer la réservation nouvellement insérée
    const [newOrder] = await db.pool.query(
      "SELECT * FROM `order` WHERE id = ?",
      [insertedOrderId]
    );

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/opinion", async (req, res) => {
  try {
    const { idOrder, idUser, idFilm, note, description } = req.body;

    console.log("Données reçues:", req.body); // ✅ Vérifier les données avant l'insertion
    const result = await db.pool.query(
      "INSERT INTO opinion (idUser, idFilm, idOrder, note, description) VALUES (?, ?, ?, ?, ?)",
      [idUser, idFilm, idOrder, note, description]
    );

    // ✅ Récupérer l'ID du dernier avis ajouté
    const insertedOpinionId = result.insertId;
    // ✅ Récupérer l'avis nouvellement inséré
    const [newOpinion] = await db.pool.query(
      "SELECT * FROM opinion WHERE id = ?",
      [insertedOpinionId]
    );

    await db.pool.query(
      "UPDATE railway.`order` SET opinionSent = 1 WHERE `order`.id = ?",
      [idOrder]
    );

    res.status(201).json(newOpinion);
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/session", async (req, res) => {
  try {
    const { filmTitle, cinema, room, date, startHour, endHour } = req.body;

    console.log("Données reçues:", req.body); // ✅ Vérifier les données avant l'insertion

    const idFilm = await db.pool.query(
      "SELECT films.id FROM railway.films WHERE title = ?",
      [filmTitle]
    );

    const idCinema = await db.pool.query(
      "SELECT cinema.id FROM railway.cinema WHERE name = ?",
      [cinema]
    );

    const idRoom = await db.pool.query(
      "SELECT room.id FROM railway.room WHERE name = ?",
      [room]
    );

    const result = await db.pool.query(
      "INSERT INTO session (date, startHour, endHour, idFilm, idCinema, idRoom) VALUES (?, ?, ?, ?, ?, ?)",
      [date, startHour, endHour, idFilm[0].id, idCinema[0].id, idRoom[0].id]
    );

    // ✅ Récupérer l'ID de la séance ajoutée
    const insertedSessionId = result.insertId;
    // ✅ Récupérer la séance ajoutée
    const [newSession] = await db.pool.query(
      "SELECT * FROM session WHERE id = ?",
      [insertedSessionId]
    );

    res.status(201).json(newSession);
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/films/:title", async (req, res) => {
  const connection = await db.pool.getConnection();
  try {
    const filmTitle = req.params.title; // Récupère le titre du film depuis l'URL
    const {
      actors,
      description,
      favorite,
      minAge,
      moviePoster,
      onView,
      opinion,
      types,
    } = req.body;

    // Début de la transaction
    await connection.beginTransaction();

    await connection.query(
      "UPDATE railway.films SET actors = ?, description = ?, favorite = ?, minAge = ?, moviePoster = ?, onView = ?, opinion = ? WHERE films.title = ?",
      [
        actors,
        description,
        favorite,
        minAge,
        moviePoster,
        onView,
        opinion,
        filmTitle,
      ] // Paramètre sécurisé pour éviter l'injection SQL
    );

    const filmId = await connection.query(
      "SELECT films.id FROM railway.films WHERE films.title = ?",
      [filmTitle]
    );

    await connection.query("DELETE FROM railway.films_type WHERE idFilm = ?", [
      filmId[0].id,
    ]);

    for (const typeId of types) {
      await connection.query(
        "INSERT INTO railway.films_type (idFilm, idType) VALUES (?, ?)",
        [filmId[0].id, typeId] // Paramètre sécurisé pour éviter l'injection SQL
      );
    }

    // Validation de la transaction
    await connection.commit();

    res.send({ message: "Film mis à jour avec succès !" });
  } catch (err) {
    // Annulation en cas d'erreur
    await connection.rollback();
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).send({ error: "Erreur serveur" });
  } finally {
    // Libération de la connexion
    connection.release();
  }
});

app.post("/api/films/delete/:title", async (req, res) => {
  const connection = await db.pool.getConnection();

  try {
    const filmTitle = req.params.title; // Récupération du paramètre dans l'URL

    // Début de la transaction
    await connection.beginTransaction();

    const filmId = await connection.query(
      "SELECT films.id FROM railway.films WHERE films.title = ?",
      [filmTitle]
    );

    await connection.query("DELETE FROM railway.films_type WHERE idFilm = ?", [
      filmId[0].id,
    ]);

    await connection.query("DELETE FROM railway.films WHERE title = ?", [
      filmTitle,
    ]);

    // Validation de la transaction
    await connection.commit();
  } catch (err) {
    // Annulation en cas d'erreur
    await connection.rollback();
    console.error("Erreur lors de la suppression :", err);
    res.status(500).send({ error: "Erreur serveur" });
  } finally {
    // Libération de la connexion
    connection.release();
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur listening on http://0.0.0.0:${port}`);
});
