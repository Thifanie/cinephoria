module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    files: [
      { pattern: "src/app/**/*.spec.ts", watched: true }, // Teste les fichiers .spec.ts
      { pattern: "src/**/*.(ts|js|html)", watched: false }, // Exclure des fichiers problématiques
    ],

    // Configuration CORS avec proxy
    proxies: {
      "/api/": "http://localhost:3000/api/", // Exemple de proxy
    },
    client: {
      clearContext: false, // Pour éviter de supprimer la page de test après l'exécution
    },
    // Ajout de l'option CORS pour le serveur Karma
    customLaunchers: {
      ChromeNoSecurity: {
        base: "Chrome",
        flags: ["--disable-web-security", "--user-data-dir=/tmp/chrome"],
      },
    },
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [
        { type: "html", subdir: "lcov-report" }, // Pour le rapport HTML
        { type: "lcovonly", subdir: ".", file: "lcov-report.json" }, // Pour le rapport LCOV
        { type: "json", subdir: ".", file: "coverage.json" }, // Pour le rapport JSON
        { type: "text-summary" }, // Pour un résumé dans la console
      ],
    },
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
    useIframe: false, // Désactiver l'iframe de Karma
  });
};
