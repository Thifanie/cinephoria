const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "host.docker.internal",
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

module.exports = Object.freeze({
  pool: pool,
});
