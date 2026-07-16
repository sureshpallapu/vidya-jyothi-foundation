const express = require("express");

const {
  sendOtp,
  verifyOtp,
} = require("../controllers/emailVerificationController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Email Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/send-otp",
  sendOtp
);

router.post(
  "/verify-otp",
  verifyOtp
);

module.exports = router;