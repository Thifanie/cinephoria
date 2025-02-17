const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/api/films", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT films.id, title, actors, description, minage, favorite, opinion, movieposter, onview, GROUP_CONCAT(type SEPARATOR ', ') AS type FROM films JOIN films_type ON films.id = films_type.idFilm JOIN type ON films_type.idType = type.id GROUP BY films.id"
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/api/admin", async (req, res) => {
  try {
    const result = await db.pool.query(
      "select email, password from cinephoria.admin WHERE name='CHRISTINE'"
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const result = await db.pool.query(
      "select email, password from cinephoria.user"
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/api/type", async (req, res) => {
  try {
    const result = await db.pool.query("select * from type");
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/api/session/:id", async (req, res) => {
  try {
    const filmId = req.params.id; // Récupère l'id du film depuis l'URL
    const result = await db.pool.query(
      "SELECT date, startHour, endHour, idFilm, cinema.name AS cinemaName, room.name AS roomName FROM cinephoria.session JOIN cinephoria.cinema on session.idCinema = cinema.id JOIN cinephoria.room ON session.idRoom = room.id WHERE idFilm = ?",
      [filmId] // Paramètre sécurisé pour éviter l'injection SQL
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/session", async (req, res) => {
  try {
    const cinemaId = req.query.cinemaId; // Utilisation de req.query pour accéder au paramètre de la query string
    console.log(cinemaId);
    const result = await db.pool.query(
      "SELECT date, startHour, endHour, room.name AS roomName, films.title as filmTitle FROM cinephoria.session JOIN cinephoria.room ON session.idRoom = room.id JOIN cinephoria.films ON session.idFilm = films.id WHERE session.idCinema = ?",
      [cinemaId] // Paramètre sécurisé pour éviter l'injection SQL);
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/api/room", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM cinephoria.room");
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/quality", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM cinephoria.quality");
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Erreur serveur" });
  }
});

app.get("/api/cinema", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM cinephoria.cinema");
    res.send(result);
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

app.post("/api/user", async (req, res) => {
  try {
    const { firstname, name, username, email, password } = req.body;

    // Générer un sel et hacher le mot de passe
    const saltRounds = 10; // Nombre d'itérations pour renforcer le hachage
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    req.body = { firstname, name, username, email, hashedPassword };

    console.log("Données reçues:", req.body); // ✅ Vérifier les données avant l'insertion
    const result = await db.pool.query(
      "INSERT INTO user (firstname, name, username, email, password) VALUES (?, ?, ?, ?, ?)",
      [firstname, name, username, email, hashedPassword]
    );
    // ✅ Récupérer l'ID du dernier utilisateur ajouté
    const insertedUserId = result.insertId;
    // ✅ Récupérer l'utilisateur nouvellement inséré
    const [newUser] = await db.pool.query("SELECT * FROM user WHERE id = ?", [
      insertedUserId,
    ]);

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db.pool.query(
    "SELECT * FROM cinephoria.user WHERE email = ?",
    [email]
  );
  if (
    !user ||
    user.password !== password
    // || !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.listen(3000, () => {
  console.log("Serveur listening on port 3000");
});
