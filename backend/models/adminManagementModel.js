const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get All Administrators
|--------------------------------------------------------------------------
*/

const getAllAdmins = async () => {

  const [rows] = await db.query(
    `
    SELECT
      id,
      username,
      full_name,
      email,
      mobile,
      role,
      status,
      created_at
    FROM admins
    ORDER BY created_at DESC
    `
  );

  return rows;

};

/*
|--------------------------------------------------------------------------
| Get Administrator By ID
|--------------------------------------------------------------------------
*/

const getAdminById = async (id) => {

  const [rows] = await db.query(
    `
    SELECT
      id,
      username,
      full_name,
      email,
      mobile,
      role,
      status,
      password,
      created_at
    FROM admins
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Get Administrator By Username
|--------------------------------------------------------------------------
*/

const getAdminByUsername = async (username) => {

  const [rows] = await db.query(
    `
    SELECT
      id,
      username,
      password,
      role,
      status
    FROM admins
    WHERE username = ?
    LIMIT 1
    `,
    [username]
  );

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Create Administrator
|--------------------------------------------------------------------------
*/

const createAdmin = async (admin) => {

  const [result] = await db.query(
    `
    INSERT INTO admins
    (
      username,
      full_name,
      email,
      mobile,
      role,
      status,
      password
    )
    VALUES
    (
      ?, ?, ?, ?, ?, ?, ?
    )
    `,
    [
      admin.username,
      admin.full_name,
      admin.email,
      admin.mobile,
      admin.role,
      admin.status,
      admin.password,
    ]
  );

  return result;

};

/*
|--------------------------------------------------------------------------
| Update Administrator
|--------------------------------------------------------------------------
*/

const updateAdmin = async (id, admin) => {

  const [result] = await db.query(
    `
    UPDATE admins
    SET
      full_name = ?,
      email = ?,
      mobile = ?,
      role = ?,
      status = ?
    WHERE id = ?
    `,
    [
      admin.full_name,
      admin.email,
      admin.mobile,
      admin.role,
      admin.status,
      id,
    ]
  );

  return result;

};

/*
|--------------------------------------------------------------------------
| Update Administrator Status
|--------------------------------------------------------------------------
*/

const updateAdminStatus = async (id, status) => {

  const [result] = await db.query(
    `
    UPDATE admins
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      id,
    ]
  );

  return result;

};

/*
|--------------------------------------------------------------------------
| Reset Administrator Password
|--------------------------------------------------------------------------
*/

const resetAdminPassword = async (id, password) => {

  const [result] = await db.query(
    `
    UPDATE admins
    SET password = ?
    WHERE id = ?
    `,
    [
      password,
      id,
    ]
  );

  return result;

};

/*
|--------------------------------------------------------------------------
| Delete Administrator
|--------------------------------------------------------------------------
*/

const deleteAdmin = async (id) => {

  const [result] = await db.query(
    `
    DELETE FROM admins
    WHERE id = ?
    `,
    [id]
  );

  return result;

};

module.exports = {

  getAllAdmins,

  getAdminById,

  getAdminByUsername,

  createAdmin,

  updateAdmin,

  updateAdminStatus,

  resetAdminPassword,

  deleteAdmin,

};