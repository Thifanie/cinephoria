const { contextBridge } = require("electron");

// Script de préchargement qui expose les versions de votre application de Chrome, Node et Electron dans le moteur de rendu
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  //Nous pouvons exposer des variables en plus des fonctions
});
