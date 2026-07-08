const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Admin By Username
|--------------------------------------------------------------------------
*/

const getAdminByUsername = (username) => {
  return new Promise((resolve, reject) => {

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

    db.query(sql, [username], (err, result) => {

      if (err) return reject(err);

      resolve(result[0]);

    });

  });
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