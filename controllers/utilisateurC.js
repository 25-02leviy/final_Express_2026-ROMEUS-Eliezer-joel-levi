const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilisateur = require("../models/utilisateur");

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
//ajoute
exports.ajouteItilisate = async (req, res, next) => {
  try {
    const { nom, telephone, adresse, password } = req.body || {};

    if (!nom || !telephone || !adresse || !password) {
      return res.status(400).json({
        message: "nom, telephone, adresse et password sont requis",
      });
    }

    const uExist = await utilisateur.findOne({ telephone, nom });
    const nomExist = await utilisateur.findOne({
      nom: new RegExp(`^${nom}$`, "i"),
    });

    if (uExist) {
      return res.status(409).json({
        message: "Un utilisateur avec ces numeros existe deja",
      });
    }

    if (nomExist) {
      return res.status(409).json({
        message: "Un utilisateur avec ce nom existe deja",
      });
    }

    //pou afiche itilisate a ak info li io  apen kew kreyel
    const nouveauUtilisateur = await utilisateur.create({
      nom,
      telephone,
      adresse,
      password,
    });
//token
    const token = genererToken(nouveauUtilisateur._id);

    res.status(201).json({
      message: "Utilisateur ajoute avec succes",
      token,
      utilisateur: sanitizeUser(nouveauUtilisateur),
    });
  } catch (error) {
    next(error);
  }
};

//konekte
exports.login = async (req, res, next) => {
  try {
    const { telephone, password } = req.body;

    const user = await utilisateur.findOne({ telephone });
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
  } catch (error) {
    next(error);
  }
};

//rechechr tout
exports.aficheyo = async (req, res, next) => {
  try {
    const tout = await utilisateur.find().select("-password");
    res.status(200).json(tout);
  } catch (error) {
    next(error);
  }
};

//pa tel.
exports.findOne_tel = async (req, res, next) => {
  try {
    const oneUser = await utilisateur
      .findOne({ telephone: req.params.telephone })
      .select("-password");

    if (!oneUser) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    res.status(200).json(oneUser);
  } catch (error) {
    next(error);
  }
};

//pa nom.
exports.findOne_nom = async (req, res, next) => {
  try {
    const oneUser = await utilisateur
      .findOne({ nom: new RegExp(`^${req.params.nom}$`, "i") })
      .select("-password");

    if (!oneUser) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    res.status(200).json(oneUser);
  } catch (error) {
    next(error);
  }
};

//efase(telefon)
exports.delete = async (req, res, next) => {
  try {
    const deleteUser = await utilisateur
      .findOneAndDelete({ telephone: req.params.telephone })
      .select("-password");

    if (!deleteUser) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    res.status(200).json({
      message: "Utilisateur supprime avec succes",
      utilisateur: deleteUser,
    });
  } catch (error) {
    next(error);
  }
};
