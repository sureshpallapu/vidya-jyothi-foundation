const fs = require("fs");
const path = require("path");

const trustDocumentModel = require("../models/trustDocumentModel");

/**
 * Create Document
 */
const createDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document.",
      });
    }

    const {
      category_id,
      document_name,
      document_number,
      issuing_authority,
      issue_date,
      expiry_date,
      is_permanent,
      description,
    } = req.body;

    if (!category_id || !document_name) {
      return res.status(400).json({
        success: false,
        message: "Category and Document Name are required.",
      });
    }
const documentId = await trustDocumentModel.createDocument({
  category_id,
  document_name,
  document_number,
  issuing_authority,

  issue_date: issue_date || null,
  expiry_date: expiry_date || null,

  is_permanent: is_permanent || 0,

  description,
  original_file_name: req.file.originalname,
  stored_file_name: req.file.filename,
  file_path: req.file.path,
  mime_type: req.file.mimetype,
  file_extension: path.extname(req.file.originalname).replace(".", ""),
  file_size: req.file.size,

  created_by: req.user?.id || null,
});

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document_id: documentId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload document.",
    });
  }
};

/**
 * Get All Documents
 */
const getAllDocuments = async (req, res) => {
  try {
    const documents = await trustDocumentModel.getAllDocuments();

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch documents.",
    });
  }
};

/**
 * Get Single Document
 */
const getDocumentById = async (req, res) => {
  try {
    const document = await trustDocumentModel.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch document.",
    });
  }
};

/**
 * Update Metadata
 */
const updateDocument = async (req, res) => {
  try {

    console.log("Body:", req.body);
    console.log("File:", req.file);

    await trustDocumentModel.updateDocument(
      req.params.id,
      {
        ...req.body,
        updated_by: req.user?.id || null,
      }
    );

    res.json({
      success: true,
      message: "Document updated successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update document.",
    });
  }
};

/**
 * Replace Uploaded File
 */
const replaceDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const existing = await trustDocumentModel.getDocumentById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    // Delete old file
    if (existing.file_path && fs.existsSync(existing.file_path)) {
      fs.unlinkSync(existing.file_path);
    }

    await trustDocumentModel.replaceDocumentFile(
      req.params.id,
      {
        original_file_name: req.file.originalname,
        stored_file_name: req.file.filename,
        file_path: req.file.path,
        mime_type: req.file.mimetype,
        file_extension: path.extname(req.file.originalname).replace(".", ""),
        file_size: req.file.size,
      },
      req.user?.id || null
    );

    res.json({
      success: true,
      message: "Document replaced successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to replace document.",
    });
  }
};

/**
 * Archive Document
 */
const archiveDocument = async (req, res) => {
  try {

    const document =
      await trustDocumentModel.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const newStatus =
      document.status === "ACTIVE"
        ? "ARCHIVED"
        : "ACTIVE";

    await trustDocumentModel.updateStatus(
      req.params.id,
      newStatus,
      req.user?.id || null
    );

    res.json({
      success: true,
      message:
        newStatus === "ACTIVE"
          ? "Document restored successfully."
          : "Document archived successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update document status.",
    });

  }
};

/**
 * Download Document
 */
const downloadDocument = async (req, res) => {
  try {
    const document = await trustDocumentModel.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }
console.log("File Path:", document.file_path);
console.log("Exists:", fs.existsSync(document.file_path));
console.log("Original File:", document.original_file_name);
    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    res.download(document.file_path, document.original_file_name);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Download failed.",
    });
  }
};

/**
 * Preview Document
 */
const previewDocument = async (req, res) => {
  try {
    const document = await trustDocumentModel.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    res.sendFile(path.resolve(document.file_path));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Preview failed.",
    });
  }
};

/**
 * Categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await trustDocumentModel.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch categories.",
    });
  }
};

/**
 * Dashboard Statistics
 */
const getStatistics = async (req, res) => {
  try {
    const stats = await trustDocumentModel.getStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch statistics.",
    });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  replaceDocument,
  archiveDocument,
  downloadDocument,
  previewDocument,
  getCategories,
  getStatistics,
};