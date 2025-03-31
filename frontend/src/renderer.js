// Utilise l'API DOM document.getElementById pour remplacer le texte affiché par l'élément HTML dont la propriété id a pour valeur info.
console.log("renderer chargé !");
const information = document.getElementById("info");
information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`;
