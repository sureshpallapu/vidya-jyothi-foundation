const {
  getApplicationDetails,
  getApplicationDocuments,
  getApplicationVerification,
} = require("../models/applicationDetailsModel");

// Get Single Scholarship Application
const applicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get application
    const application = await getApplicationDetails(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Get documents and OCR verification
    const [uploadedDocuments, verification] = await Promise.all([
      getApplicationDocuments(id),
      getApplicationVerification(id),
    ]);

    // Convert documents array into object
    const documents = {};

    uploadedDocuments.forEach((doc) => {
      documents[doc.document_name] = doc;
    });

    // Return application details
    return res.status(200).json({
      success: true,
      data: {
        application,
        documents,
        verification,
      },
    });
  } catch (error) {
    console.error("Application details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application details.",
    });
  }
};

module.exports = {
  applicationDetails,
};