const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Admin By Username
|--------------------------------------------------------------------------
*/

const getAdminByUsername = async (username) => {

  const sql = `
    SELECT
      id,
      username,
      full_name,
      email,
      mobile,
      role,
      status,
      password
    FROM admins
    WHERE username = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [username]);

  return rows[0];
};

/*
|--------------------------------------------------------------------------
| Get Admin By ID
|--------------------------------------------------------------------------
*/

const getAdminById = async (id) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM admins
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

module.exports = {
  getAdminByUsername,
  getAdminById,
};