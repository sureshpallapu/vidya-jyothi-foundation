const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

const getDashboardStatistics = async () => {
  /*
  |--------------------------------------------------------------------------
  | Applications Summary
  |--------------------------------------------------------------------------
  */
  const [applicationStats] = await db.query(`
    SELECT
      COUNT(*) AS totalApplications,
      SUM(status='Submitted') AS submitted,
      SUM(status='Documents Verified') AS verified,
      SUM(status='Under Review') AS underReview,
      SUM(status='Approved') AS approved,
      SUM(status='Rejected') AS rejected,
      SUM(status='Scholarship Released') AS released,
      COALESCE(SUM(sanctioned_amount),0) AS sanctionedAmount
    FROM scholarship_applications
  `);

  /*
  |--------------------------------------------------------------------------
  | Admin Count
  |--------------------------------------------------------------------------
  */
  const [adminStats] = await db.query(`
    SELECT
      COUNT(*) AS totalAdmins
    FROM admins
    WHERE status='ACTIVE'
  `);

  /*
  |--------------------------------------------------------------------------
  | Scholarship Released Amount
  |--------------------------------------------------------------------------
  */
  const [releasedAmount] = await db.query(`
    SELECT
      COALESCE(SUM(sanctioned_amount),0) AS releasedAmount
    FROM scholarship_applications
    WHERE status='Scholarship Released'
  `);

  /*
  |--------------------------------------------------------------------------
  | Monthly Applications
  |--------------------------------------------------------------------------
  */
  const [monthlyApplications] = await db.query(`
    SELECT
      MONTH(created_at) AS month,
      COUNT(*) AS total
    FROM scholarship_applications
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at)
  `);

  /*
|--------------------------------------------------------------------------
| Status Distribution
|--------------------------------------------------------------------------
*/

const [statusDistribution] = await db.query(`

  SELECT

    status,

    COUNT(*) AS total

  FROM scholarship_applications

  GROUP BY status

  ORDER BY status

`);


/*
|--------------------------------------------------------------------------
| District Distribution
|--------------------------------------------------------------------------
*/

const [districtDistribution] = await db.query(`

  SELECT

    district,

    COUNT(*) AS total

  FROM scholarship_applications

  WHERE district IS NOT NULL
    AND district <> ''

  GROUP BY district

  ORDER BY total DESC

`);


/*
|--------------------------------------------------------------------------
| Gender Distribution
|--------------------------------------------------------------------------
*/

const [genderDistribution] = await db.query(`

  SELECT

    gender,

    COUNT(*) AS total

  FROM scholarship_applications

  WHERE gender IS NOT NULL
    AND gender <> ''

  GROUP BY gender

  ORDER BY total DESC

`);

/*
|--------------------------------------------------------------------------
| Recent Applications
|--------------------------------------------------------------------------
*/

const [recentApplications] = await db.query(`

  SELECT

    application_id,

    student_name,

    district,

    status,

    created_at

  FROM scholarship_applications

  ORDER BY created_at DESC

  LIMIT 10

`);


/*
|--------------------------------------------------------------------------
| Recent Workflow Activity
|--------------------------------------------------------------------------
*/

const [recentActivities] = await db.query(`

  SELECT

    h.current_status,

    h.previous_status,

    h.changed_at,

    a.full_name,

    sa.application_id

  FROM application_status_history h

  INNER JOIN admins a

    ON h.changed_by = a.id

  INNER JOIN scholarship_applications sa

    ON sa.id = h.application_id

  ORDER BY h.changed_at DESC

  LIMIT 10

`);


return {

  statistics: {

    ...applicationStats[0],

    ...adminStats[0],

    ...releasedAmount[0],

  },

  monthlyApplications,

  statusDistribution,

  districtDistribution,

  genderDistribution,

  recentApplications,

  recentActivities
};
 


};

module.exports = {
  getDashboardStatistics,
};