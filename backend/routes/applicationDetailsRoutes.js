const express = require("express");

const router = express.Router();

const {
  applicationDetails,
} = require("../controllers/applicationDetailsController");

/*
|--------------------------------------------------------------------------
| Application Details
|--------------------------------------------------------------------------
*/

router.get(
  "/applications/:id",
  applicationDetails
);

module.exports = router;