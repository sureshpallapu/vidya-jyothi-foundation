const db = require("../config/db");

/**
 * Check duplicate Aadhaar or Mobile for the current scholarship cycle
 */
const checkDuplicateApplication = (aadhaar, mobile, cycleId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        application_id,
        aadhaar,
        mobile
      FROM scholarship_applications
      WHERE cycle_id = ?
      AND (
        aadhaar = ?
        OR mobile = ?
      )
      LIMIT 1
    `;

    db.query(sql, [cycleId, aadhaar, mobile], (err, result) => {
      if (err) return reject(err);

      resolve(result);
    });
  });
};

/**
 * Save Scholarship Application
 */
const createApplication = (applicationData) => {
  return new Promise((resolve, reject) => {

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

    db.query(
      sql,
      [
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
      ],
      (err, result) => {
        if (err) return reject(err);

        resolve(result);
      }
    );
  });
};

/**
 * Save Uploaded Documents
 */
const saveDocuments = (documents) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO application_documents
      (application_id, document_name, file_name)
      VALUES (?, ?, ?)
    `;

    const promises = documents.map((document) => {
      return new Promise((res, rej) => {
        db.query(
          sql,
          [
            document.applicationId,
            document.documentName,
            document.fileName,
          ],
          (err, result) => {
            if (err) return rej(err);
            res(result);
          }
        );
      });
    });

    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};


/**
 * Get Application Status
 */
const getApplicationStatus = (applicationId, aadhaar) => {
  return new Promise((resolve, reject) => {

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

      WHERE
        application_id = ?
      AND
        aadhaar = ?
      LIMIT 1
    `;

    db.query(
      sql,
      [applicationId, aadhaar],
      (err, result) => {

        if (err) return reject(err);

        resolve(result);

      }
    );

  });
};
module.exports = {
  createApplication,
  checkDuplicateApplication,
  saveDocuments,
  getApplicationStatus,
};