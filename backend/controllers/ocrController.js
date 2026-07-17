const fs = require("fs");

const {
  verifyAadhaar,
} = require("../services/ocr/aadhaarVerifier");

/*
|--------------------------------------------------------------------------
| Delete Temporary OCR File
|--------------------------------------------------------------------------
*/

const deleteTempFile = (filePath) => {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "Failed to delete temporary OCR file:",
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| Existing OCR Test Controller
|--------------------------------------------------------------------------
*/

const testOCR = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    filePath = req.file.path;

    const studentData = {
      aadhaarNumber: req.body.aadhaar || "",
      fullName: req.body.studentName || "",
      dateOfBirth: req.body.dob || "",
      gender: req.body.gender || "",
    };

    const result = await verifyAadhaar(
      filePath,
      studentData
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "OCR TEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "OCR verification failed.",
      error: error.message,
    });
  } finally {
    deleteTempFile(filePath);
  }
};

/*
|--------------------------------------------------------------------------
| Instant Aadhaar Verification
|--------------------------------------------------------------------------
*/

const verifyAadhaarUpload = async (req, res) => {
  let filePath = null;

  try {
    console.log(
      "===== INSTANT AADHAAR VERIFICATION STARTED ====="
    );

    /*
    |--------------------------------------------------------------------------
    | Check Uploaded File
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        verificationStatus: "NO_FILE",
        message:
          "Please upload an Aadhaar document.",
      });
    }

    filePath = req.file.path;

    /*
    |--------------------------------------------------------------------------
    | Get Applicant Form Data
    |--------------------------------------------------------------------------
    */

    const {
      aadhaar,
      studentName,
      dob,
      gender,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Basic Aadhaar Validation
    |--------------------------------------------------------------------------
    */

    const cleanAadhaar = (
      aadhaar || ""
    ).replace(/\s/g, "");

    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return res.status(400).json({
        success: false,
        verificationStatus:
          "INVALID_AADHAAR_NUMBER",

        message:
          "Please enter a valid 12-digit Aadhaar number before uploading the Aadhaar document.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Student Data
    |--------------------------------------------------------------------------
    */

    const studentData = {
      aadhaarNumber: cleanAadhaar,
      fullName: studentName || "",
      dateOfBirth: dob || "",
      gender: gender || "",
    };

    /*
    |--------------------------------------------------------------------------
    | Run OCR + Verification
    |--------------------------------------------------------------------------
    */

    const result = await verifyAadhaar(
      filePath,
      studentData
    );

    console.log(
      "Instant Aadhaar verification result:",
      {
        isAadhaar: result.isAadhaar,
        verification: result.verification,
        overallVerified:
          result.overallVerified,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Not Aadhaar Document
    |--------------------------------------------------------------------------
    */

    if (!result.isAadhaar) {
      return res.status(200).json({
        success: true,

        verificationStatus:
          "INVALID_DOCUMENT",

        verified: false,

        message:
          "The uploaded document could not be identified as an Aadhaar document. Please upload a valid and clear Aadhaar document.",

        extracted: result.extracted,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Aadhaar Number Mismatch
    |--------------------------------------------------------------------------
    */

    if (
      !result.verification
        ?.aadhaarMatched
    ) {
      return res.status(200).json({
        success: true,

        verificationStatus:
          "AADHAAR_MISMATCH",

        verified: false,

        message:
          "The Aadhaar number in the uploaded document does not match the Aadhaar number entered in your application. Please check the number or upload the correct Aadhaar document.",

        extracted: result.extracted,

        verification:
          result.verification,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | All Important Details Match
    |--------------------------------------------------------------------------
    */

    if (result.overallVerified) {
      return res.status(200).json({
        success: true,

        verificationStatus:
          "VERIFIED",

        verified: true,

        message:
          "Aadhaar document validated successfully. The Aadhaar details match the information provided in your application. The document will also be reviewed by the verification officer during application processing.",

        extracted: result.extracted,

        verification:
          result.verification,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Aadhaar Is Valid But Some Personal Details Differ
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      verificationStatus:
        "DETAILS_MISMATCH",

      verified: false,

      message:
        "The uploaded document appears to be a valid Aadhaar document, but some details do not match the information entered in your application. Please review your details. The document may also be reviewed by the verification officer.",

      extracted: result.extracted,

      verification:
        result.verification,
    });

  } catch (error) {
    console.error(
      "INSTANT AADHAAR VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      verificationStatus:
        "VERIFICATION_ERROR",

      verified: false,

      message:
        "We could not verify the Aadhaar document. Please upload a clear Aadhaar image and try again.",

      error: error.message,
    });
  } finally {
    /*
    |--------------------------------------------------------------------------
    | Remove Temporary OCR File
    |--------------------------------------------------------------------------
    |
    | This endpoint is only for verification.
    | The actual document will still be saved later by your normal
    | scholarship document upload API.
    |
    |--------------------------------------------------------------------------
    */

    deleteTempFile(filePath);
  }
};

module.exports = {
  testOCR,
  verifyAadhaarUpload,
};