const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      "scholarship",
      req.params.id
    );

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(
      null,
      `${file.fieldname}-${Date.now()}${extension}`
    );
  },
});

// Allowed File Types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG and PDF files are allowed."),
      false
    );
  }
};

// Multer Upload Instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;