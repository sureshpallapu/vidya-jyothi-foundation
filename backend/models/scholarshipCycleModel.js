const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get All Scholarship Cycles
|--------------------------------------------------------------------------
*/

const getScholarshipCycles = async () => {

  const sql = `
    SELECT
      id,
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date,
      created_at
    FROM scholarship_cycles
    ORDER BY scholarship_year DESC
  `;

  const [rows] = await db.query(sql);

  return rows;

};

/*
|--------------------------------------------------------------------------
| Get Scholarship Cycle By ID
|--------------------------------------------------------------------------
*/

const getScholarshipCycleById = async (id) => {

  const sql = `
    SELECT
      id,
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date,
      created_at
    FROM scholarship_cycles
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [id]);

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Create Scholarship Cycle
|--------------------------------------------------------------------------
*/

const createScholarshipCycle = async (data) => {

  const sql = `
    INSERT INTO scholarship_cycles
    (
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    data.scholarship_year,
    data.title,
    data.is_active,
    data.start_date,
    data.end_date,
  ]);

  return result;

};

/*
|--------------------------------------------------------------------------
| Update Scholarship Cycle
|--------------------------------------------------------------------------
*/

const updateScholarshipCycle = async (
  id,
  data
) => {

  const sql = `
    UPDATE scholarship_cycles
    SET
      scholarship_year = ?,
      title = ?,
      is_active = ?,
      start_date = ?,
      end_date = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [
    data.scholarship_year,
    data.title,
    data.is_active,
    data.start_date,
    data.end_date,
    id,
  ]);

  return result;

};

/*
|--------------------------------------------------------------------------
| Activate Scholarship Cycle
|--------------------------------------------------------------------------
*/

const activateScholarshipCycle = async (id) => {

  // Only one active cycle

  await db.query(`
    UPDATE scholarship_cycles
    SET is_active = 0
  `);

  const [result] = await db.query(
    `
    UPDATE scholarship_cycles
    SET is_active = 1
    WHERE id = ?
    `,
    [id]
  );

  return result;

};

/*
|--------------------------------------------------------------------------
| Delete Scholarship Cycle
|--------------------------------------------------------------------------
*/

const deleteScholarshipCycle = async (id) => {

  const sql = `
    DELETE FROM scholarship_cycles
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [id]);

  return result;

};

module.exports = {
  getScholarshipCycles,
  getScholarshipCycleById,
  createScholarshipCycle,
  updateScholarshipCycle,
  activateScholarshipCycle,
  deleteScholarshipCycle,
};