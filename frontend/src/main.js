const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const { exec } = require("child_process");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("dist/cinephoria-web/index.html");
};

let server;
const backendPath = path.join(__dirname, "..", "..", "backend", "server.js");

app.whenReady().then(() => {
  // Charger les variables d'environnement pour Electron
  require("dotenv").config({
    path: path.join(__dirname, "..", "..", "backend", ".env"),
  });

  server = exec(`node "${backendPath}"`); // Lance le backend
  // Afficher les logs backend dans la console Electron
  server.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  server.stderr.on("data", (data) => {
    console.error(`Erreur backend: ${data}`);
  });

  createWindow();

  // Ouverture d'une fenêtre si aucune n'est ouverte (macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitter l'application quand toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();

  // Ferme le serveur quand Electron se ferme
  if (server) {
    console.log("Fermeture du serveur backend...");
    server.kill(); // Termine le processus du serveur
  }
});
