const mongoose = require("mongoose");

// Kredi
const creditSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    produit: {
      type: String,
      required: true,
      trim: true,
    },
    quantite: {
      type: Number,
      required: true,
      min: 0.01,
    },
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    paiementsTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    resteAPayer: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
      type: String,
      enum: ["EN_ATTENTE", "PARTIEL", "SOLDE"],
      default: "EN_ATTENTE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Credit", creditSchema);


