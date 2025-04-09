const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectionLimit: 10,
  waitForConnections: true, // Attend une connexion libre au lieu de planter
  connectTimeout: 10000, // Timeout de connexion
  idleTimeout: 60000, // Garde les connexions ouvertes plus longtemps
});

module.exports = Object.freeze({
  pool: pool,
});

// Connexion à la base données NoSQL MongoDB

const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPWD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}`,
    // `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/cinephoria-mongodb`,
    // Ajout ?authSource=admin pour utilisation en local
    {
      serverSelectionTimeoutMS: 5000, // Timeout pour choisir un serveur
      connectTimeoutMS: 10000, // Timeout de connexion
    }
  )
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
    console.error("Stack trace:", err.stack);
  });
