const express = require("express");
const app = express();
const db = require("./db");

app.get("/api/films", async (req, res) => {
  try {
    const result = await db.pool.query("select * from cinephoria.films");
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
