const { app, BrowserWindow } = require("electron");
const path = require("node:path");

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

app.whenReady().then(() => {
  createWindow();

  // Ouverture d'une fenêtre si aucune n'est ouverte (macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitter l'application quand toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
