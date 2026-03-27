const express = require("express");
const utilisateurC = require("../controllers/utilisateurC");
const {
  registerValidation,
  handleValidationErrors,
} = require("../middlewares/registerValidation");
const { protect } = require("../middlewares/authMiddlewares");

const routeur = express.Router();

routeur.post(
  "/add",
  registerValidation,
  handleValidationErrors,
  utilisateurC.ajouteItilisate
);
routeur.post("/login", utilisateurC.login);
routeur.get("/all", utilisateurC.aficheyo);
routeur.get("/recherche/:telephone", protect, utilisateurC.findOne_tel);
routeur.get("/recherche/nom/:nom", protect, utilisateurC.findOne_nom);
routeur.delete("/delete/:telephone", protect, utilisateurC.delete);

module.exports = routeur;

//add
// {
//   "nom": "Romeus Eliezer",
//   "telephone": 36334731,
//   "adresse": "pignon",
//   "password": "passssssss!"
// }
//recherche pa tel
//http://localhost:2502/api/utilisateur/recherche/telephone/:36334731
//rechech pa non
//http://localhost:2502/api/utilisateur/recherche/nom/romeus eliezer
//efase
//http://localhost:2502/api/utilisateur/delete/36334731




