const mongoose = require("mongoose");

// Connexion MongoDB centralisee.
const Konekte = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion reussie");
  } catch (error) {
    console.log("ERROR :", error.message);
  }
};

module.exports = Konekte;
