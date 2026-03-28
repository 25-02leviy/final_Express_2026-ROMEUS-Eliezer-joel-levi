const client = require("../models/client");
const Client = require("../models/client");
const Credit = require("../models/credit");
const asyncHandler = require("../middlewares/asyncHandler");
const {
  enregistrerPhotoClient,
  enregistrerPhotoClientDepuisFichier,
} = require("../services/photoService");

// Creation d'un client lye a l'utilisateur connecte.
exports.ajouterClient = asyncHandler(async (req, res) => {
  const { nom, telephone, adresse, foto } = req.body || {};

  if (!nom || !telephone || !adresse) {
    return res.status(400).json({
      message: "nom, telephone et adresse sont requis",
    });
  }

  const telephoneNormalise = String(telephone).trim();
  const photo = req.file
    ? await enregistrerPhotoClientDepuisFichier(req.file)
    : await enregistrerPhotoClient(foto);

  const client = await Client.create({
    utilisateur: req.user._id,
    nom,
    telephone: telephoneNormalise,
    adresse,
    photo,
  });

  res.status(201).json({
    message: "Client ajoute avec succes",
    client,
  });
});

// Liste complete des clients de l'utilisateur.
exports.listerClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ utilisateur: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    total: clients.length,
    clients,
  });
});

// Suppression d'un client si aucun credit n'est encore rattache.
exports.supprimerClient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const creditLie = await Credit.findOne({
    utilisateur: req.user._id,
    client: id,
  });

  if (creditLie) {
    return res.status(409).json({
      message: "Impossible de supprimer ce client car il possede deja un credit",
    });
  }

  const client = await Client.findOneAndDelete({
    _id: id,
    utilisateur: req.user._id,
  });

  if (!client) {
    return res.status(404).json({ message: "Client non trouve" });
  }

  res.status(200).json({
    message: "Client supprime avec succes",
    client,
  });
});


// cheche c pa tel.
exports.findOne_tel = asyncHandler(async (req, res) => {
  const oneUser = await client.findOne({
    telephone: String(req.params.telephone || "").trim(),
  });

  if (!oneUser) {
    return res.status(404).json({ message: "client non trouve" });
  }

  res.status(200).json(oneUser);
});
