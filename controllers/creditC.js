const Client = require("../models/client");
const Credit = require("../models/credit");
const Paiement = require("../models/paiement");
const asyncHandler = require("../middlewares/asyncHandler");

// Creation d'une vente a credit pour un client existant.
exports.ajouterCredit = asyncHandler(async (req, res) => {
  const { clientId, produit, quantite, montantTotal } = req.body || {};

  if (!clientId || !produit || !quantite || !montantTotal) {
    return res.status(400).json({
      message: "clientId, produit, quantite et montantTotal sont requis",
    });
  }

  const client = await Client.findOne({
    _id: clientId,
    utilisateur: req.user._id,
  });

  if (!client) {
    return res.status(404).json({ message: "Client non trouve" });
  }

  const montant = Number(montantTotal);
  const quantiteValeur = Number(quantite);

  if (
    Number.isNaN(montant) ||
    montant <= 0 ||
    Number.isNaN(quantiteValeur) ||
    quantiteValeur <= 0
  ) {
    return res.status(400).json({
      message: "quantite et montantTotal doivent etre superieurs a 0",
    });
  }

  const credit = await Credit.create({
    utilisateur: req.user._id,
    client: client._id,
    produit,
    quantite: quantiteValeur,
    montantTotal: montant,
    resteAPayer: montant,
  });

  const creditPopule = await Credit.findById(credit._id).populate(
    "client",
    "nom telephone adresse photo"
  );

  res.status(201).json({
    message: "Credit enregistre avec succes",
    credit: creditPopule,
  });
});

// Liste de tous les credits avec resume client.
exports.listerCredits = asyncHandler(async (req, res) => {
  const credits = await Credit.find({ utilisateur: req.user._id })
    .populate("client", "nom telephone adresse photo")
    .sort({ createdAt: -1 });

  res.status(200).json({
    total: credits.length,
    credits,
  });
});

// Detail d'un credit avec historique de paiements.
exports.detailCredit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const credit = await Credit.findOne({
    _id: id,
    utilisateur: req.user._id,
  }).populate("client", "nom telephone adresse photo");

  if (!credit) {
    return res.status(404).json({ message: "Credit non trouve" });
  }

  const paiements = await Paiement.find({
    credit: credit._id,
    utilisateur: req.user._id,
  }).sort({ datePaiement: -1 });

  res.status(200).json({
    credit,
    paiements,
  });
});
