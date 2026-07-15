const express = require("express");

const router = express.Router();

const {
  fetchSettings,
  saveSettings,
} = require("../controllers/settingsController");

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

// Get Settings

router.get(
  "/",
  fetchSettings
);

// Update Settings

router.put(
  "/",
  saveSettings
);

module.exports = router;