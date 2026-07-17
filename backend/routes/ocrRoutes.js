const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  testOCR,
  verifyAadhaarUpload,
} = require("../controllers/ocrController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Ensure OCR Upload Folder Exists
|--------------------------------------------------------------------------
*/

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "ocr"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| Multer Storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `aadhaar-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

/*
|--------------------------------------------------------------------------
| Allowed File Types
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG and PNG files are allowed for Aadhaar verification."
      )
    );
  }

  cb(null, true);
};

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| Existing OCR Test Route
|--------------------------------------------------------------------------
*/

router.post(
  "/test",
  upload.single("document"),
  testOCR
);

/*
|--------------------------------------------------------------------------
| Aadhaar Instant Verification Route
|--------------------------------------------------------------------------
|
| POST /api/ocr/verify-aadhaar
|
| FormData:
|
| document    -> Aadhaar image
| aadhaar     -> 12 digit Aadhaar number
| studentName -> Applicant name
| dob         -> Applicant DOB
| gender      -> Applicant gender
|
|--------------------------------------------------------------------------
*/

router.post(
  "/verify-aadhaar",
  upload.single("document"),
  verifyAadhaarUpload
);

module.exports = router;