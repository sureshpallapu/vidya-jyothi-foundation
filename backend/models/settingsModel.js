const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

const getSettings = async () => {

  const [rows] = await db.query(

    `
    SELECT *
    FROM settings
    LIMIT 1
    `
  );

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

const updateSettings = async (data) => {

  const {

    trust_name,

    trust_address,

    trust_email,

    trust_phone,

    trust_website,

    founder_name,

    founder_designation,

    founder_message,

    application_prefix,

    session_timeout,

  } = data;

  const [result] = await db.query(

    `
    UPDATE settings
    SET

      trust_name = ?,

      trust_address = ?,

      trust_email = ?,

      trust_phone = ?,

      trust_website = ?,

      founder_name = ?,

      founder_designation = ?,

      founder_message = ?,

      application_prefix = ?,

      session_timeout = ?

    WHERE id = 1
    `,

    [

      trust_name,

      trust_address,

      trust_email,

      trust_phone,

      trust_website,

      founder_name,

      founder_designation,

      founder_message,

      application_prefix,

      session_timeout,

    ]

  );

  return result;

};

module.exports = {

  getSettings,

  updateSettings,

};