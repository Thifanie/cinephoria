// Connexion à la base données SQL MariaDB

const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  acquireTimeout: 10000, // Timeout d'acquisition plus long
  waitForConnections: true, // Attend une connexion libre au lieu de planter
  connectTimeout: 10000, // Timeout de connexion
  idleTimeout: 60000, // Garde les connexions ouvertes plus longtemps
  allowPublicKeyRetrieval: true,
  cachingRsaPublicKey: false,
});

// Test immédiat de la connexion à la base
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Connexion MariaDB établie avec succès !");
    conn.release(); // Libérer la connexion après test
  })
  .catch((err) => {
    console.error("❌ Échec de connexion à MariaDB :", err.message);
  });

module.exports = Object.freeze({
  pool: pool,
});

// Connexion à la base données NoSQL MongoDB

const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/cinephoria-mongodb?authSource=admin`,
    {
      serverSelectionTimeoutMS: 5000, // Timeout pour choisir un serveur
      connectTimeoutMS: 10000, // Timeout de connexion
    }
  )
  .then(() => console.log("✅ Connexion MongoDB établie avec succès !"))
  .catch((err) => {
    console.error("❌ Échec de connexion à MongoDB", err);
    console.error("Stack trace:", err.stack);
  });
