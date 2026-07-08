const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Application Workflow History
|--------------------------------------------------------------------------
*/

const getApplicationHistory = async (applicationId) => {

  const sql = `
    SELECT

      h.id,

      h.previous_status,

      h.current_status,

      h.remarks,

      h.sanctioned_amount,

      h.changed_at,

      a.username AS admin_name

    FROM application_status_history h

    LEFT JOIN admins a
      ON h.changed_by = a.id

    WHERE h.application_id = ?

    ORDER BY h.changed_at ASC
  `;

  const [rows] = await db.query(sql, [applicationId]);

  return rows;

};

module.exports = {
  getApplicationHistory,
};