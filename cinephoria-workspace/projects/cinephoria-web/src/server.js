const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

app.use(cors());

app.get("/api/films", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT title, actors, description, minage, favorite, opinion, movieposter, onview, GROUP_CONCAT(type SEPARATOR ', ') AS type FROM films JOIN films_type ON films.id = films_type.idFilm JOIN type ON films_type.idType = type.id GROUP BY films.id"
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

app.listen(3000, () => {
  console.log("Serveur listening on port 3000");
});
