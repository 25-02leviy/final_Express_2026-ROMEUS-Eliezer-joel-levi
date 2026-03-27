const jwt = require("jsonwebtoken");
const utilisateur = require("../models/utilisateur");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Aucun token fourni, acces refuse",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || process.env.TOKEN_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "JWT_SECRET ou TOKEN_SECRET est requis dans le fichier .env",
      });
    }

    const decoded = jwt.verify(token, secret);
    const user = await utilisateur.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expire",
      error: error.message,
    });
  }
};
