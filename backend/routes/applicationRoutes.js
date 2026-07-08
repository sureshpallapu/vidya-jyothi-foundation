
const express = require("express");

const router = express.Router();

const {
  dashboardStatistics,
  applicationsList,
} = require("../controllers/applicationController");
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  dashboardStatistics
);

router.get(
  "/applications",
  applicationsList
);

module.exports = router;