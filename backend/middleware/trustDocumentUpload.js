const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

/**
 * Allowed MIME Types
 */
const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Create Upload Folder Automatically
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const uploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      "trust-documents",
      year,
      month
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const now = new Date();

    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const random = crypto.randomBytes(4).toString("hex");

    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${timestamp}_${random}${extension}`;

    cb(null, filename);
  },
});

/**
 * Validate File Type
 */
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only PDF, JPG, JPEG, PNG and WEBP files are allowed."
    ),
    false
  );
};

/**
 * Multer Upload Configuration
 */
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

/**
 * Middleware
 * Upload Single Document
 */
const uploadTrustDocument = upload.single("document");

/**
 * Handle Multer Errors
 */
const handleUploadError = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "Maximum file size is 10 MB.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });
    }
  }

  return res.status(400).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  uploadTrustDocument,
  handleUploadError,
};