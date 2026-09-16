const multer = require("multer");
const crypto = require("crypto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set in your .env file
  api_key: process.env.CLOUDINARY_API_KEY, // Set in your .env file
  api_secret: process.env.CLOUDINARY_API_SECRET, // Set in your .env file
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ProductsPhotos", // Folder name in Cloudinary
    allowed_formats: ["jpeg", "jpg", "png"], // Allowed file formats
    // Random id, not the uploader's original filename - avoids leaking
    // whatever PII an admin's local filename might contain into a public URL.
    public_id: () => crypto.randomBytes(16).toString("hex"),
  },
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(file.originalname.toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

module.exports = upload;
