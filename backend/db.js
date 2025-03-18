const mysql = require("mysql2");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
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
