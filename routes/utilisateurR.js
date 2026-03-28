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
  utilisateurC.ajouteUtilisateur
);
routeur.post("/login", utilisateurC.login);
routeur.get("/me", protect, utilisateurC.profil);//pou wh enfomasyon sou user ou konekte a men fow t fh login avant🥴
routeur.get("/all",  utilisateurC.aficheyo);
routeur.get("/recherche/:telephone", protect, utilisateurC.findOne_tel);
routeur.get("/recherche/nom/:nom", protect, utilisateurC.findOne_nom);
routeur.delete("/delete/:telephone", protect, utilisateurC.delete);

module.exports = routeur;

// add
// {
//   "nom": "Romeus Eliezer",
//   "telephone": 36334731,
//   "adresse": "pignon",
//   "password": "Passssss1!"
// }
// http://localhost:2502/api/utilisateur/add
// login
// {
//   "telephone": 36334731,
//   "password": "Passssss1!"
// }
// http://localhost:2502/api/utilisateur/login
// profil utilisateur connecte
// http://localhost:2502/api/utilisateur/me
// liste utilisateurs
// http://localhost:2502/api/utilisateur/all
// recherche par telephone
// http://localhost:2502/api/utilisateur/recherche/36334731
//avek kndisyn ke token ou valid
// recherche par nom
// http://localhost:2502/api/utilisateur/recherche/nom/Romeus Eliezer
// suppression
//http://localhost:2502/api/utilisateur/delete/36334731
