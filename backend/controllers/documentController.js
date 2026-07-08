const path = require("path");
const fs = require("fs");

const Scholarship = require("../models/scholarshipModel");

const uploadDocuments = async (req, res) => {
  try {
    const applicationId = req.params.id;

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    const documents = [];

    Object.keys(req.files).forEach((key) => {
      const file = req.files[key][0];

      documents.push({
        applicationId,
        documentName: key,
        fileName: file.filename,
      });
    });

    await Scholarship.saveDocuments(documents);

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload documents.",
    });

  }
};

module.exports = {
  uploadDocuments,
};