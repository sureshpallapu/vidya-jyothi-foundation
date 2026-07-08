const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Current Application
|--------------------------------------------------------------------------
*/

const getApplicationById = async (id) => {

  const sql = `
    SELECT *
    FROM scholarship_applications
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql,[id]);

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Save Status History
|--------------------------------------------------------------------------
*/

const saveStatusHistory = async (data) => {

  const sql = `
    INSERT INTO application_status_history
    (
      application_id,
      previous_status,
      current_status,
      remarks,
      sanctioned_amount,
      changed_by
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql,[
      data.applicationId,
      data.previousStatus,
      data.currentStatus,
      data.remarks,
      data.sanctionedAmount,
      data.changedBy,
  ]);

  return result;

};

/*
|--------------------------------------------------------------------------
| Update Application
|--------------------------------------------------------------------------
*/

const updateApplicationStatus = async (
    id,
    fields
) => {

  const sql = `
      UPDATE scholarship_applications
      SET
        status=?,
        remarks=?,
        sanctioned_amount=?,
        verified_by=?,
        verified_at=?,
        approved_by=?,
        approved_at=?
      WHERE id=?
  `;

  const [result] = await db.query(sql,[
      fields.status,
      fields.remarks,
      fields.sanctionedAmount,
      fields.verifiedBy,
      fields.verifiedAt,
      fields.approvedBy,
      fields.approvedAt,
      id,
  ]);

  return result;

};

module.exports = {
  getApplicationById,
  saveStatusHistory,
  updateApplicationStatus,
};