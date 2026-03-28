// Importation des dependances principales de l'application.
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const userRoute = require("./routes/utilisateurR");
const clientRoute = require("./routes/clientR");
const creditRoute = require("./routes/creditR");
const paiementRoute = require("./routes/paiementR");
const Konekte = require("./db/db");
const errorHandler = require("./middlewares/errorHandler");

// Initialisation de l'environnement et du serveur.
dotenv.config();
const app = express();
Konekte();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/utilisateur", userRoute);
app.use("/api/clients", clientRoute);
app.use("/api/credits", creditRoute);
app.use("/api/paiements", paiementRoute);

// Route par defaut utile pour un test rapide.
app.get("/", (req, res) => {
  res.send("API de gestion des credits en ecoute");
});

app.use(errorHandler);

// Lancement du serveur Express.
app.listen(process.env.PORT, () => {
  console.log("serveur en ecoute");
});
