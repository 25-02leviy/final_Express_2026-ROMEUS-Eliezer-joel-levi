const Credit = require("../models/credit");
const Paiement = require("../models/paiement");
const asyncHandler = require("../middlewares/asyncHandler");
const mongoose = require("mongoose");

const calculerStatut = (resteAPayer, montantTotal) => {
  if (resteAPayer <= 0) {
    return "SOLDE";
  }

  if (resteAPayer < montantTotal) {
    return "PARTIEL";
  }

  return "EN_ATTENTE";
};

// Ajout d'un paiement sur un credit 
exports.ajouterPaiement = asyncHandler(async (req, res) => {
  const { creditId, montant, note, datePaiement } = req.body || {};

  if (!creditId || !montant) {
    return res.status(400).json({
      message: "creditId et montant sont requis",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(creditId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const credit = await Credit.findOne({
    _id: creditId,
    utilisateur: req.user._id,
  });

  if (!credit) {
    return res.status(404).json({ message: "Credit non trouve" });
  }

  const montantVerse = Number(montant);
  if (Number.isNaN(montantVerse) || montantVerse <= 0) {
    return res.status(400).json({
      message: "Le montant du paiement doit etre superieur a 0",
    });
  }

  if (montantVerse > credit.resteAPayer) {
    return res.status(400).json({
      message: "Le paiement depasse le reste a payer",
    });
  }

  const paiement = await Paiement.create({
    utilisateur: req.user._id,
    credit: credit._id,
    montant: montantVerse,
    note,
    datePaiement: datePaiement || undefined,
  });

  credit.paiementsTotal += montantVerse;
  credit.resteAPayer = Number(
    (credit.montantTotal - credit.paiementsTotal).toFixed(2)
  );
  credit.statut = calculerStatut(credit.resteAPayer, credit.montantTotal);
  await credit.save();

  res.status(201).json({
    message: "Paiement ajoute avec succes",
    paiement,
    credit,
  });
});

// Historique complet des paiements d'un credit.
exports.historiquePaiements = asyncHandler(async (req, res) => {
  const { creditId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(creditId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const credit = await Credit.findOne({
    _id: creditId,
    utilisateur: req.user._id,
  }).populate("client", "nom telephone adresse");

  if (!credit) {
    return res.status(404).json({ message: "Credit non trouve" });
  }

  const paiements = await Paiement.find({
    credit: creditId,
    utilisateur: req.user._id,
  }).sort({ datePaiement: -1 });

  res.status(200).json({
    credit,
    totalPaiements: paiements.length,
    paiements,
    resteAPayer: credit.resteAPayer,
  });
});
