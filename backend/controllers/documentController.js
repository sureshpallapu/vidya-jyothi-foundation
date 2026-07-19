const path = require("path");
const fs = require("fs");

const {
  getApplicationById,
  saveDocuments,
  saveDocumentVerification,
} = require("../models/scholarshipModel");

const {
  verifyDocuments,
} = require("../services/documentVerificationService");

/*
|--------------------------------------------------------------------------
| Upload Documents
|--------------------------------------------------------------------------
*/
const uploadDocuments = async (req, res) => {
  try {
    const identifier = req.params.id;

    console.log("===== DOCUMENT UPLOAD STARTED =====");
    console.log("Received identifier:", identifier);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    console.log("Uploaded files:", Object.keys(req.files));

    const student = await getApplicationById(identifier);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // IMPORTANT:
    // application_documents.application_id is INT,
    // so use scholarship_applications.id
    const applicationId = student.id;

    console.log("Application DB ID:", applicationId);
    console.log("Application Number:", student.application_id);
    console.log("Student:", student.student_name);

    const documents = Object.keys(req.files).map((key) => {
      const file = req.files[key][0];

      return {
        applicationId: applicationId,
        documentName: key,
        fileName: file.filename,
      };
    });

    const verification = await verifyDocuments(
  req.files,
  student
);

console.log(
  "Document verification result:",
  verification
);

/*
|--------------------------------------------------------------------------
| Save Uploaded Documents
|--------------------------------------------------------------------------
*/

await saveDocuments(documents);

console.log(
  "Documents saved successfully."
);

/*
|--------------------------------------------------------------------------
| Save Aadhaar OCR Verification Result
|--------------------------------------------------------------------------
*/

if (verification?.aadhaar) {
  await saveDocumentVerification(
    student.id,
    "aadhaar",
    verification.aadhaar
  );

  console.log(
    "Aadhaar OCR verification saved successfully."
  );
}

    console.log("Documents saved successfully.");

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully.",
      verification,
    });

  } catch (error) {
    console.error(
      "DOCUMENT UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload documents.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| Download Document
|--------------------------------------------------------------------------
*/

const downloadDocument = async (req, res) => {
  try {
    const {
      applicationId,
      fileName,
    } = req.params;

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "scholarship",
      applicationId,
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.download(filePath);

  } catch (error) {
    console.error(
      "DOCUMENT DOWNLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to download document.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocuments,
  downloadDocument,
};