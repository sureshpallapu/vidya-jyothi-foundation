const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Scholarship Application Details
|--------------------------------------------------------------------------
*/

const getApplicationDetails = async (id) => {

  const sql = `
    SELECT *
    FROM scholarship_applications
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [id]);

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Get Uploaded Documents
|--------------------------------------------------------------------------
*/

const getApplicationDocuments = async (applicationId) => {

  const sql = `
    SELECT
      id,
      application_id,
      document_name,
      file_name,
      uploaded_at
    FROM application_documents
    WHERE application_id = ?
    ORDER BY id ASC
  `;

  const [rows] = await db.query(sql, [applicationId]);

  return rows;

};

module.exports = {
  getApplicationDetails,
  getApplicationDocuments,
};