const db = require("../config/db");

/**
 * Check duplicate Aadhaar or Mobile for the current scholarship cycle
 */
const checkDuplicateApplication = async (aadhaar, mobile, cycleId) => {
  const sql = `
    SELECT application_id, aadhaar, mobile
    FROM scholarship_applications
    WHERE cycle_id = ?
    AND (aadhaar = ? OR mobile = ?)
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [cycleId, aadhaar, mobile]);

  return rows;
};

/**
 * Save Scholarship Application
 */
const createApplication = async (applicationData) => {
  const sql = `
    INSERT INTO scholarship_applications (
      application_id,
      application_sequence,
      cycle_id,
      application_source,

      student_name,
      father_name,
      mother_name,
      dob,
      gender,
      mobile,
      email,
      aadhaar,
      photo_url,

      address,
      district,
      state,
      pincode,

      college_name,
      course,
      study_year,
      previous_qualification,
      previous_percentage,

      annual_family_income,
      sanctioned_amount,
      scholarship_purpose,

      bank_name,
      account_number,
      ifsc_code
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,?,?,?,?
    )
  `;

  const [result] = await db.query(sql, [
    applicationData.applicationId,
    applicationData.applicationSequence,
    applicationData.cycleId,
    applicationData.applicationSource,

    applicationData.studentName,
    applicationData.fatherName,
    applicationData.motherName,
    applicationData.dob,
    applicationData.gender,
    applicationData.mobile,
    applicationData.email,
    applicationData.aadhaar,
    applicationData.photoUrl,

    applicationData.address,
    applicationData.district,
    applicationData.state,
    applicationData.pincode,

    applicationData.collegeName,
    applicationData.course,
    applicationData.studyYear,
    applicationData.previousQualification,
    applicationData.previousPercentage,

    applicationData.annualFamilyIncome,
    applicationData.sanctionedAmount,
    applicationData.scholarshipPurpose,

    applicationData.bankName,
    applicationData.accountNumber,
    applicationData.ifscCode,
  ]);

  return result;
};

/**
 * Save Uploaded Documents
 */
const saveDocuments = async (documents) => {
  const sql = `
    INSERT INTO application_documents
    (application_id, document_name, file_name)
    VALUES (?, ?, ?)
  `;

  // Run all inserts in parallel; each db.query call already returns a
  // promise under mysql2/promise, so no manual Promise wrapping is needed.
  const results = await Promise.all(
    documents.map((document) =>
      db.query(sql, [
        document.applicationId,
        document.documentName,
        document.fileName,
      ])
    )
  );

  return results.map(([result]) => result);
};

/**
 * Get Application Status
 */
const getApplicationStatus = async (applicationId, aadhaar) => {
  const sql = `
    SELECT
      application_id,
      student_name,
      mobile,
      aadhaar,
      status,
      remarks,
      created_at,
      updated_at
    FROM scholarship_applications
    WHERE application_id = ?
    AND aadhaar = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [applicationId, aadhaar]);

  return rows;
};

/*
|--------------------------------------------------------------------------
| Check Aadhaar Duplicate
|--------------------------------------------------------------------------
*/

const checkAadhaarExists = async (aadhaar) => {

  const [rows] = await db.execute(

    `
      SELECT
        application_id,
        student_name,
        status,
        created_at
      FROM scholarship_applications
      WHERE aadhaar = ?
      LIMIT 1
    `,
    [aadhaar]

  );

  return rows[0] || null;

};

const getApplicationById = async (identifier) => {
  const [rows] = await db.query(
    `
      SELECT
        id,
        application_id,
        student_name,
        father_name,
        dob,
        gender,
        aadhaar
      FROM scholarship_applications
      WHERE id = ?
         OR application_id = ?
      LIMIT 1
    `,
    [identifier, identifier]
  );

  return rows[0] || null;
};


/**
 * Save Document OCR Verification Result
 */
const saveDocumentVerification = async (
  applicationId,
  documentName,
  verificationResult
) => {
  const verification =
    verificationResult.verification || {};

  const extracted =
    verificationResult.extracted || {};

  let verificationStatus = "FAILED";

  if (verificationResult.success) {
    verificationStatus =
      verificationResult.overallVerified
        ? "VERIFIED"
        : "MISMATCH";
  }

  let verificationMessage;

  if (verificationStatus === "VERIFIED") {
    verificationMessage =
      "OCR verification successful. The Aadhaar details match the information provided in the application. Manual document verification by the officer is still required.";
  } else if (verificationStatus === "MISMATCH") {
    const mismatches = [];

    if (verification.aadhaarMatched === false) {
      mismatches.push("Aadhaar Number");
    }

    if (verification.nameMatched === false) {
      mismatches.push("Student Name");
    }

    if (verification.dobMatched === false) {
      mismatches.push("Date of Birth");
    }

    if (verification.genderMatched === false) {
      mismatches.push("Gender");
    }

    verificationMessage =
      mismatches.length > 0
        ? `OCR detected mismatched information: ${mismatches.join(
            ", "
          )}. Manual verification by the document officer is required.`
        : "OCR verification could not fully verify the Aadhaar document. Manual verification is required.";
  } else {
    verificationMessage =
      "OCR verification failed. The uploaded document requires manual verification by the document officer.";
  }

  const sql = `
    INSERT INTO document_verifications (
      application_id,
      document_name,
      verification_status,
      overall_verified,

      aadhaar_matched,
      name_matched,
      dob_matched,
      gender_matched,

      extracted_aadhaar,
      extracted_name,
      extracted_dob,
      extracted_gender,

      verification_message
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    applicationId,
    documentName,
    verificationStatus,
    verificationResult.overallVerified ? 1 : 0,

    verification.aadhaarMatched ?? null,
    verification.nameMatched ?? null,
    verification.dobMatched ?? null,
    verification.genderMatched ?? null,

    extracted.aadhaarNumber || null,
    extracted.name || null,
    extracted.dob || null,
    extracted.gender || null,

    verificationMessage,
  ]);

  return result;
};


module.exports = {
  createApplication,
  checkDuplicateApplication,
  saveDocuments,
  getApplicationStatus,
  checkAadhaarExists,
  getApplicationById,
  saveDocumentVerification,
};