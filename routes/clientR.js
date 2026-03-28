const express = require("express");
const clientC = require("../controllers/clientC");
const { protect } = require("../middlewares/authMiddlewares");
const { uploadClientPhoto } = require("../middlewares/uploads");

const routeur = express.Router();

// Routes .
routeur.post("/addClient", protect, uploadClientPhoto, clientC.ajouterClient);
routeur.get("/allC", protect, clientC.listerClients);
routeur.get("/:telephone", protect, clientC.findOne_tel);
routeur.delete("/:id", protect, clientC.supprimerClient);

module.exports = routeur;

// ajouter client
// form-data :
// nom = Jean Pierre
// telephone = 38112233
// adresse = Cap-Haitien
// foto = [fichier image]
// http://localhost:2502/api/clients/addClient
// liste des clients
// http://localhost:2502/api/clients/allC
// supprimer client
// http://localhost:2502/api/clients/ID_DU_CLIENT

