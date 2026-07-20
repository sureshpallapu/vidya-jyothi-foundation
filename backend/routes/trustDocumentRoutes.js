const express = require("express");

const router = express.Router();

const trustDocumentController = require("../controllers/trustDocumentController");

const {
  uploadTrustDocument,
  handleUploadError,
} = require("../middleware/trustDocumentUpload");

// Import your authentication middleware
// Example:
// const { authenticateToken } = require("../middleware/authMiddleware");

// ===============================
// Dashboard
// ===============================

router.get(
  "/statistics",
  // authenticateToken,
  trustDocumentController.getStatistics
);

// ===============================
// Categories
// ===============================

router.get(
  "/categories",
  // authenticateToken,
  trustDocumentController.getCategories
);

// ===============================
// List Documents
// ===============================

router.get(
  "/",
  // authenticateToken,
  trustDocumentController.getAllDocuments
);

// ===============================
// Get Single Document
// ===============================

router.get(
  "/:id",
  // authenticateToken,
  trustDocumentController.getDocumentById
);

// ===============================
// Upload Document
// ===============================

router.post(
  "/",
  // authenticateToken,
  uploadTrustDocument,
  handleUploadError,
  trustDocumentController.createDocument
);

// ===============================
// Update Metadata
// ===============================

router.put(
  "/:id",
  uploadTrustDocument,
  handleUploadError,
  trustDocumentController.updateDocument
);
// ===============================
// Replace Uploaded File
// ===============================

router.put(
  "/:id/replace",
  // authenticateToken,
  uploadTrustDocument,
  handleUploadError,
  trustDocumentController.replaceDocument
);

// ===============================
// Archive
// ===============================

router.put(
  "/:id/archive",
  // authenticateToken,
  trustDocumentController.archiveDocument
);

// ===============================
// Preview
// ===============================

router.get(
  "/:id/preview",
  // authenticateToken,
  trustDocumentController.previewDocument
);

// ===============================
// Download
// ===============================

router.get(
  "/:id/download",
  // authenticateToken,
  trustDocumentController.downloadDocument
);

module.exports = router;