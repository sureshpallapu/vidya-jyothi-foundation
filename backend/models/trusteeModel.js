const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Create Trustee
|--------------------------------------------------------------------------
*/

const createTrustee = async (data) => {
  const sql = `
    INSERT INTO trustees (
      full_name,
      father_or_spouse_name,
      date_of_birth,
      gender,
      mobile_number,
      alternate_mobile_number,
      email,
      aadhaar_number,
      pan_number,
      address_line1,
      address_line2,
      city,
      district,
      state,
      pincode,
      designation,
      joined_date,
      tenure_start_date,
      tenure_end_date,
      profession,
      qualification,
      profile_image,
      short_bio,
      display_order,
      show_on_website,
      is_active
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `;

  const values = [
    data.full_name,
    data.father_or_spouse_name || null,
    data.date_of_birth || null,
    data.gender || null,

    data.mobile_number,
    data.alternate_mobile_number || null,
    data.email || null,

    data.aadhaar_number || null,
    data.pan_number || null,

    data.address_line1 || null,
    data.address_line2 || null,
    data.city || null,
    data.district || null,
    data.state || null,
    data.pincode || null,

    data.designation,
    data.joined_date || null,
    data.tenure_start_date || null,
    data.tenure_end_date || null,

    data.profession || null,
    data.qualification || null,

    data.profile_image || null,
    data.short_bio || null,

    data.display_order || 0,

    data.show_on_website ?? 1,
    data.is_active ?? 1,
  ];

  const [result] = await db.query(sql, values);

  console.log("INSERT RESULT:", result);
  console.log("INSERT ID:", result.insertId);

  /*
  |--------------------------------------------------------------------------
  | Generate Trustee Code
  |--------------------------------------------------------------------------
  |
  | ID 1   -> VJF0001
  | ID 2   -> VJF0002
  | ID 25  -> VJF0025
  | ID 999 -> VJF0999
  |
  */

  const trusteeId = result.insertId;

  const trusteeCode = `VJF${String(trusteeId).padStart(4, "0")}`;

  console.log("Generated Code:", trusteeCode);

  /*
  |--------------------------------------------------------------------------
  | Save Generated Trustee Code
  |--------------------------------------------------------------------------
  */

  await db.query(
    `
    UPDATE trustees
    SET trustee_code = ?
    WHERE id = ?
    `,
    [trusteeCode, trusteeId]
  );

  return trusteeId;
};

/*
|--------------------------------------------------------------------------
| Get All Trustees
|--------------------------------------------------------------------------
*/
const getAllTrustees = async () => {
  const sql = `
    SELECT *
    FROM trustees
    ORDER BY display_order ASC, id DESC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

/*
|--------------------------------------------------------------------------
| Get Single Trustee
|--------------------------------------------------------------------------
*/
const getTrusteeById = async (id) => {
  const sql = `
    SELECT *
    FROM trustees
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [id]);

  return rows[0] || null;
};

/*
|--------------------------------------------------------------------------
| Get Trustee By Code
|--------------------------------------------------------------------------
*/
const getTrusteeByCode = async (trusteeCode) => {
  const sql = `
    SELECT id
    FROM trustees
    WHERE trustee_code = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [trusteeCode]);

  return rows[0] || null;
};

/*
|--------------------------------------------------------------------------
| Update Trustee
|--------------------------------------------------------------------------
*/
const updateTrustee = async (id, data) => {
  const {
    full_name,
    father_or_spouse_name,
    date_of_birth,
    gender,
    mobile_number,
    alternate_mobile_number,
    email,
    aadhaar_number,
    pan_number,
    address_line1,
    address_line2,
    city,
    district,
    state,
    pincode,
    designation,
    joined_date,
    tenure_start_date,
    tenure_end_date,
    profession,
    qualification,
    profile_image,
    short_bio,
    display_order,
    show_on_website,
    is_active,
  } = data;

  const sql = `
    UPDATE trustees
    SET
      full_name = ?,
      father_or_spouse_name = ?,
      date_of_birth = ?,
      gender = ?,
      mobile_number = ?,
      alternate_mobile_number = ?,
      email = ?,
      aadhaar_number = ?,
      pan_number = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      district = ?,
      state = ?,
      pincode = ?,
      designation = ?,
      joined_date = ?,
      tenure_start_date = ?,
      tenure_end_date = ?,
      profession = ?,
      qualification = ?,
      profile_image = ?,
      short_bio = ?,
      display_order = ?,
      show_on_website = ?,
      is_active = ?
    WHERE id = ?
  `;

  const values = [
    full_name,
    father_or_spouse_name || null,
    date_of_birth || null,
    gender || null,
    mobile_number,
    alternate_mobile_number || null,
    email || null,
    aadhaar_number || null,
    pan_number || null,
    address_line1 || null,
    address_line2 || null,
    city || null,
    district || null,
    state || null,
    pincode || null,
    designation,
    joined_date || null,
    tenure_start_date || null,
    tenure_end_date || null,
    profession || null,
    qualification || null,
    profile_image || null,
    short_bio || null,
    display_order ?? 0,
    show_on_website ?? 1,
    is_active ?? 1,
    id,
  ];

  const [result] = await db.query(sql, values);

  return result.affectedRows;
};

/*
|--------------------------------------------------------------------------
| Update Trustee Status
|--------------------------------------------------------------------------
*/
const updateTrusteeStatus = async (id, isActive) => {
  const sql = `
    UPDATE trustees
    SET is_active = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [isActive, id]);

  return result.affectedRows;
};

/*
|--------------------------------------------------------------------------
| Get Public Trustees
|--------------------------------------------------------------------------
*/
const getPublicTrustees = async () => {
  // Important: only select fields that are safe for the public website.
  const sql = `
    SELECT
      id,
      trustee_code,
      full_name,
      designation,
      profession,
      qualification,
      profile_image,
      short_bio,
      display_order
    FROM trustees
    WHERE is_active = 1
      AND show_on_website = 1
    ORDER BY display_order ASC, id ASC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

module.exports = {
  createTrustee,
  getAllTrustees,
  getTrusteeById,
  getTrusteeByCode,
  updateTrustee,
  updateTrusteeStatus,
  getPublicTrustees,
};