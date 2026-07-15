const express = require("express");

const router = express.Router();

const {
  applicationReport,
} = require("../controllers/reportController");

/*
|--------------------------------------------------------------------------
| Application Report
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",
  applicationReport
);

module.exports = router;