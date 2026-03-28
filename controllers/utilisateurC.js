const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilisateur = require("../models/utilisateur");
const asyncHandler = require("../middlewares/asyncHandler");

const getJwtSecret = () => process.env.JWT_SECRET || process.env.TOKEN_SECRET;

const genererToken = (userId) => {
  const secret = getJwtSecret();

  if (!secret) {
    const error = new Error("JWT_SECRET ou TOKEN_SECRET est requis dans le fichier .env");
    error.status = 500;
    throw error;
  }

  return jwt.sign({ id: userId }, secret, { expiresIn: "1d" });
};

const sanitizeUser = (user) => ({
  id: user._id,
  nom: user.nom,
  telephone: user.telephone,
  adresse: user.adresse,
});

// Inscription d'un nouvel utilisateur avec retour du token.
exports.ajouteUtilisateur = asyncHandler(async (req, res) => {
  const { nom, telephone, adresse, password } = req.body || {};
  const telephoneNormalise = String(telephone || "").trim();

  if (!nom || !telephoneNormalise || !adresse || !password) {
    return res.status(400).json({
      message: "nom, telephone, adresse et password sont requis",
    });
  }

  //verifikasyn pou evite redondans
const utilisateurExistant = await utilisateur.findOne({
  $or: [
    { telephone: telephoneNormalise },
    { nom: nom }
  ]
});

if (utilisateurExistant) {
  if (utilisateurExistant.telephone === telephoneNormalise) {
    return res.status(409).json({
      message: "Un utilisateur avec ce numero existe deja",
    });
  }

  if (utilisateurExistant.nom === nom) {
    return res.status(409).json({
      message: "Un utilisateur avec ce nom existe deja",
    });
  }
}

  // Creation du compte apres verification des donnees.
  const nouveauUtilisateur = await utilisateur.create({
    nom,
    telephone: telephoneNormalise,
    adresse,
    password,
  });

  // Emission du token pour eviter une connexion immediate supplementaire.
  const token = genererToken(nouveauUtilisateur._id);

  res.status(201).json({
    message: "Utilisateur ajoute avec succes",
    token,
    utilisateur: sanitizeUser(nouveauUtilisateur),
  });
});

// Alias conserve pour ne pas casser d'anciens imports.
exports.ajouteItilisate = exports.ajouteUtilisateur;

// Connexion d'un utilisateur existant.
exports.login = asyncHandler(async (req, res) => {
  const { telephone, password } = req.body || {};
  const telephoneNormalise = String(telephone || "").trim();

  if (!telephoneNormalise || !password) {
    return res.status(400).json({
      message: "telephone et password sont requis",
    });
  }

  const user = await utilisateur.findOne({ telephone: telephoneNormalise });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouve" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  const token = genererToken(user._id);

  res.status(200).json({
    message: "Connexion reussie",
    token,
    utilisateur: sanitizeUser(user),
  });
});

// Profil de l'utilisateur connecte.
exports.profil = async (req, res) => {
  res.status(200).json({
    utilisateur: req.user,
  });
};

// tout user, san modpass tyo
exports.aficheyo = asyncHandler(async (req, res) => {
  const tout = await utilisateur.find().select("-password");
  res.status(200).json(tout);
});

// Recherche d'un utilisateur par numero de telephone.
exports.findOne_tel = asyncHandler(async (req, res) => {
  const oneUser = await utilisateur
    .findOne({ telephone: String(req.params.telephone || "").trim() })
    .select("-password");

  if (!oneUser) {
    return res.status(404).json({ message: "Utilisateur non trouve" });
  }

  res.status(200).json(oneUser);
});

// Recherche d'un utilisateur par nom complet.
exports.findOne_nom = asyncHandler(async (req, res) => {
  const oneUser = await utilisateur
    .findOne({ nom: new RegExp(`^${req.params.nom}$`, "i") })
    .select("-password");

  if (!oneUser) {
    return res.status(404).json({ message: "Utilisateur non trouve" });
  }

  res.status(200).json(oneUser);
});

// Suppression d'un utilisateur par telephone.
exports.delete = asyncHandler(async (req, res) => {
  const deleteUser = await utilisateur
    .findOneAndDelete({ telephone: String(req.params.telephone || "").trim() })
    .select("-password");

  if (!deleteUser) {
    return res.status(404).json({ message: "Utilisateur non trouve" });
  }

  res.status(200).json({
    message: "Utilisateur supprime avec succes",
    utilisateur: deleteUser,
  });
});
