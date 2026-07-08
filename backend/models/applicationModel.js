const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

const getDashboardStats = async () => {

  const sql = `
    SELECT

      COUNT(*) AS totalApplications,

      SUM(status = 'Submitted') AS submitted,

      SUM(status = 'Documents Verified') AS documentsVerified,

      SUM(status = 'Under Review') AS underReview,

      SUM(status = 'Approved') AS approved,

      SUM(status = 'Rejected') AS rejected,

      SUM(status = 'Scholarship Released') AS scholarshipReleased

    FROM scholarship_applications
  `;

  const [rows] = await db.query(sql);

  const stats = rows[0];

  return {

    totalApplications:
      Number(stats.totalApplications),

    submitted:
      Number(stats.submitted),

    documentsVerified:
      Number(stats.documentsVerified),

    underReview:
      Number(stats.underReview),

    approved:
      Number(stats.approved),

    rejected:
      Number(stats.rejected),

    scholarshipReleased:
      Number(stats.scholarshipReleased),

  };

};

/*
|--------------------------------------------------------------------------
| Applications List
|--------------------------------------------------------------------------
*/

const getApplications = async () => {

  const sql = `
    SELECT

      id,

      application_id,

      student_name,

      mobile,

      aadhaar,

      college_name,

      district,

      status,

      created_at

    FROM scholarship_applications

    WHERE is_deleted = FALSE

    ORDER BY created_at DESC
  `;

  const [rows] = await db.query(sql);

  return rows;

};

module.exports = {
  getDashboardStats,
  getApplications,
};