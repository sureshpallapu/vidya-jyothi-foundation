const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Save OTP
|--------------------------------------------------------------------------
*/

const saveOtp = async (
  email,
  otp,
  expiresAt
) => {

  const query = `
    INSERT INTO email_verifications
    (
      email,
      otp,
      expires_at
    )
    VALUES (?, ?, ?)
  `;

  await db.execute(
    query,
    [
      email,
      otp,
      expiresAt,
    ]
  );

};

/*
|--------------------------------------------------------------------------
| Get Latest OTP
|--------------------------------------------------------------------------
*/

const getLatestOtp = async (
  email
) => {

  const query = `
    SELECT *
FROM email_verifications
WHERE email = ?
AND is_active = 1
ORDER BY id DESC
LIMIT 1
  `;

  const [rows] =
    await db.execute(
      query,
      [email]
    );

  return rows[0];

};

/*
|--------------------------------------------------------------------------
| Mark Verified
|--------------------------------------------------------------------------
*/

const markVerified =
  async (id) => {

    const query = `
      UPDATE email_verifications
SET
  verified = TRUE,
  verified_at = NOW(),
  is_active = 0
WHERE id = ?
    `;

    await db.execute(
      query,
      [id]
    );

};


/*
|--------------------------------------------------------------------------
| Increment Attempts
|--------------------------------------------------------------------------
*/

const incrementAttempts =
async (id) => {

  const query = `

    UPDATE email_verifications

    SET attempts = attempts + 1

    WHERE id = ?

  `;

  await db.execute(query, [id]);

};



/*
|--------------------------------------------------------------------------
| Deactivate Previous OTPs
|--------------------------------------------------------------------------
*/

const deactivateOldOtps = async (email) => {

  const query = `

    UPDATE email_verifications

    SET is_active = 0

    WHERE email = ?

  `;

  await db.execute(query, [email]);

};


module.exports = {

  saveOtp,

  getLatestOtp,

  markVerified,

  incrementAttempts,
  deactivateOldOtps,

};