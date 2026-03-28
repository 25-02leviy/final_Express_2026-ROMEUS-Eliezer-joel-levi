const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema principal des comptes qui se connectent a l'application.
const utilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    adresse: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },

);

// Hash automatique du mot de passe avant enregistrement.
utilisateurSchema.pre("save", async function preSave() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
