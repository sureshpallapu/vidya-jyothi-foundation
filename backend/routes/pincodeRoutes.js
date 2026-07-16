const express = require("express");

const {
  getLocationByPincode,
} = require("../controllers/pincodeController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PIN Code Lookup
|--------------------------------------------------------------------------
*/

router.get(
  "/:pincode",
  getLocationByPincode
);

module.exports = router;