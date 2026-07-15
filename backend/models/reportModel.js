const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Application Report
|--------------------------------------------------------------------------
*/

const getApplicationReport = async (filters = {}) => {

  let sql = `
    SELECT

      application_id,

      student_name,

      district,

      college_name,

      course,

      status,

      sanctioned_amount,

      created_at

    FROM scholarship_applications

    WHERE 1 = 1
  `;

  const values = [];

  if (filters.status) {

    sql += ` AND status = ?`;

    values.push(filters.status);

  }

  if (filters.district) {

    sql += ` AND district = ?`;

    values.push(filters.district);

  }

  if (filters.gender) {

    sql += ` AND gender = ?`;

    values.push(filters.gender);

  }

  sql += ` ORDER BY created_at DESC`;

  const [rows] =
    await db.query(sql, values);

  return rows;

};

module.exports = {

  getApplicationReport,

};