const mongoose = require("mongoose");

// Historique des paiements appliques a un credit.
const paiementSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      index: true,
    },
    credit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credit",
      required: true,
      index: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0.01,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    datePaiement: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Paiement", paiementSchema);
