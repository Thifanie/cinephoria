const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "shuttle.proxy.rlwy.net",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "WQFTfSUkYnwNqqaiMdJiHegLcCcCQqLj",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || "11449",
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
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
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
