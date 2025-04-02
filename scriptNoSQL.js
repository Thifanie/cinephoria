const dbName = "cinephoria-mongodb";
const db = db.getSiblingDB(dbName); // Accéder à la base de données

// Si la collection "users" n'existe pas, la créer et insérer un utilisateur test
if (!db.getCollectionNames().includes("users")) {
  db.createCollection("users");
  db.users.insertOne({
    username: "john_doe",
    email: "john@example.com",
    password: "123456",
    firstname: "John",
    name: "DOE",
    role: "user",
  });

  print('Collection "users" créée avec succès.');
} else {
  print('La collection "users" existe déjà.');
}
