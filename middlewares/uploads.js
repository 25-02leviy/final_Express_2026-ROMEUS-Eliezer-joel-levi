const multer = require("multer");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const uploadClientPhoto = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      const error = new Error("Le fichier foto doit etre une image valide");
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
}).single("foto");

module.exports = {
  uploadClientPhoto,
};
