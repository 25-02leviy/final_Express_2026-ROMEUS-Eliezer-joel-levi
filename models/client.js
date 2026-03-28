const mongoose = require("mongoose");

// Les clients appartiennent a un utilisateur connecte precis.
const clientSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      index: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    adresse: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      filename: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

// Empeche les doublons de telephone pour un meme proprietaire.
clientSchema.index({ utilisateur: 1, telephone: 1 }, { unique: true });

module.exports = mongoose.model("Client", clientSchema);
