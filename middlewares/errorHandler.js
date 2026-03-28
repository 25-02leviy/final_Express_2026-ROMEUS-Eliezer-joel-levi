// Middleware centralise de gestion d'erreur.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Erreur de validation",
      error: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: "Une valeur unique existe deja en base",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "ID invalide",
      error: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token invalide",
      error: err.message,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expire",
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

module.exports = errorHandler;
