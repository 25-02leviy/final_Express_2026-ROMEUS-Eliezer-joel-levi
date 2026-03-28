const express = require("express");
const creditC = require("../controllers/creditC");
const { protect } = require("../middlewares/authMiddlewares");

const routeur = express.Router();

// Routes de gestion des ventes a credit.
routeur.post("/", protect, creditC.ajouterCredit);
routeur.get("/", protect, creditC.listerCredits);
routeur.get("/:id", protect, creditC.detailCredit);

module.exports = routeur;

// ajouter credit
// {
//   "clientId": "ID_DU_CLIENT",
//   "produit": "ciment",
//   "quantite": 50,
//   "montantTotal": 10000
// }
// http://localhost:2502/api/credits/
// liste des credits
// http://localhost:2502/api/credits/
// detail d'un credit
// http://localhost:2502/api/credits/ID_DU_CREDIT

