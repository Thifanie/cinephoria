const functions = require("firebase-functions");
const express = require("express");
const { app } = require("./dist/cinephoria-web/server/main");

const server = express();
server.use("/", app);

exports.ssr = functions.https.onRequest(server);
