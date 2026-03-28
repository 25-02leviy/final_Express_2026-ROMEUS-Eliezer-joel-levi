const express = require("express");
const paiementC = require("../controllers/paiementC");
const { protect } = require("../middlewares/authMiddlewares");

const routeur = express.Router();

// Routes de paiement et d'historique.
routeur.post("/", protect, paiementC.ajouterPaiement);
routeur.get("/credit/:creditId", protect, paiementC.historiquePaiements);

module.exports = routeur;

// ajouter paiement
// {
//   "creditId": "ID_DU_CREDIT",
//   "montant": 2500,
//   "note": "premier versement",
//   "datePaiement": "2026-03-27"
// }
// http://localhost:2502/api/paiements/
// historique des paiements d'un credit
// http://localhost:2502/api/paiements/credit/ID_DU_CREDIT

