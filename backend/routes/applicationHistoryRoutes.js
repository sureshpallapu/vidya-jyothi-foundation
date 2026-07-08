const express = require("express");

const router = express.Router();

const {
  applicationHistory,
} = require("../controllers/applicationHistoryController");

router.get(
  "/applications/:id/history",
  applicationHistory
);

module.exports = router;