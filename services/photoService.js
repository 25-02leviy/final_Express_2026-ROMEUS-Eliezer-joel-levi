const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const uploadsRoot = path.join(__dirname, "..", "uploads", "clients");

const sauvegarderBufferImage = async (buffer) => {
  await fs.mkdir(uploadsRoot, { recursive: true });

  const filename = `client-${Date.now()}.jpg`;
  const filePath = path.join(uploadsRoot, filename);

  await sharp(buffer)
    .resize(600, 600, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toFile(filePath);

  return {
    filename,
    url: `/uploads/clients/${filename}`,
  };
};

// Sauvegarde une image base64 en local et retourne son chemin public.
const enregistrerPhotoClient = async (photoBase64) => {
  if (!photoBase64) {
    return null;
  }

  const match = photoBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    const error = new Error(
      "Le format de photoBase64 est invalide. Utilisez une image data URI."
    );
    error.status = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], "base64");

  return sauvegarderBufferImage(buffer);
};

// Sauvegarde une image envoyee via multipart/form-data.
const enregistrerPhotoClientDepuisFichier = async (file) => {
  if (!file) {
    return null;
  }

  return sauvegarderBufferImage(file.buffer);
};

module.exports = {
  enregistrerPhotoClient,
  enregistrerPhotoClientDepuisFichier,
};
