const registerValidation = (req, res, next) => {
  const body = req.body || {};
  const { nom, telephone, adresse, password } = body;
  const errors = [];

  if (!req.body) {
    errors.push({
      field: "body",
      message: "Le corps de la requete est requis en JSON",
    });
  }

  if (!nom || String(nom).trim().length < 3) {
    errors.push({
      field: "nom",
      message: "Le nom complet est requis et doit contenir au moins 3 caracteres",
    });
  }

  const telephoneString = String(telephone || "").trim();
  if (!telephoneString || !/^\d{8,11}$/.test(telephoneString)) {
    errors.push({
      field: "telephone",
      message: "Le numero de telephone doit contenir entre 8 et 11 chiffres",
    });
  }

  if (!adresse || String(adresse).trim().length < 3) {
    errors.push({
      field: "adresse",
      message: "L'adresse est requise",
    });
  }

  if (
    !password ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/.test(password)
  ) {
    errors.push({
      field: "password",
      message:
        "Le mot de passe doit contenir entre 8 et 20 caracteres, avec majuscule, minuscule, chiffre et caractere special",
    });
  }

  req.validationErrors = errors;
  next();
};

const handleValidationErrors = (req, res, next) => {
  if (req.validationErrors && req.validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: req.validationErrors,
    });
  }

  next();
};

module.exports = {
  registerValidation,
  handleValidationErrors,
};
