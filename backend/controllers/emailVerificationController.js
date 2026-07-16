const {
  saveOtp,
  getLatestOtp,
  markVerified,
  incrementAttempts,
  deactivateOldOtps,
} = require("../models/emailVerificationModel");
const {
  sendOtpEmail,
} = require("../utils/emailService");

/*
|--------------------------------------------------------------------------
| Send Email OTP
|--------------------------------------------------------------------------
*/

const sendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({

        success: false,

        message: "Email is required.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Generate OTP
    |--------------------------------------------------------------------------
    */

const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();
    /*
    |--------------------------------------------------------------------------
    | Expiry Time (10 Minutes)
    |--------------------------------------------------------------------------
    */

    const expiresAt = new Date(

      Date.now() + 10 * 60 * 1000

    );

    /*
    |--------------------------------------------------------------------------
    | Save OTP
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Deactivate Previous OTPs
|--------------------------------------------------------------------------
*/

await deactivateOldOtps(email);

/*
|--------------------------------------------------------------------------
| Save New OTP
|--------------------------------------------------------------------------
*/

await saveOtp(
  email,
  otp,
  expiresAt
);
    /*
    |--------------------------------------------------------------------------
    | Send Email
    |--------------------------------------------------------------------------
    */

    await sendOtpEmail(

      email,

      otp

    );

    return res.status(200).json({

      success: true,

      message: "OTP sent successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Failed to send OTP.",

    });

  }

};
/*
|--------------------------------------------------------------------------
| Verify Email OTP
|--------------------------------------------------------------------------
*/

const verifyOtp = async (req, res) => {

  try {

    const {

      email,

      otp,

    } = req.body;

    if (!email || !otp) {

      return res.status(400).json({

        success: false,

        message: "Email and OTP are required.",

      });

    }

    const record =
      await getLatestOtp(email);

    if (!record) {

      return res.status(404).json({

        success: false,

        message: "OTP not found.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Expiry Check
    |--------------------------------------------------------------------------
    */

    if (

      new Date() >

      new Date(record.expires_at)

    ) {

      return res.status(400).json({

        success: false,

        message: "OTP has expired.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | OTP Validation
    |--------------------------------------------------------------------------
    */

    const isValid =
  otp === record.otp;

  if (!isValid) {

  await incrementAttempts(record.id);

  if (record.attempts + 1 >= 5) {

  await deactivateOldOtps(email);

  return res.status(400).json({

    success:false,

    message:
      "Maximum OTP attempts exceeded. Please request a new OTP."

  });

}

  return res.status(400).json({

    success:false,

    message:`Invalid OTP. Remaining Attempts : ${5-(record.attempts+1)}`

  });

}

    /*
    |--------------------------------------------------------------------------
    | Mark Verified
    |--------------------------------------------------------------------------
    */

    await markVerified(record.id);

    return res.status(200).json({

      success: true,

      message: "Email verified successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Verification failed.",

    });

  }

};
module.exports = {

  sendOtp,
  verifyOtp

};