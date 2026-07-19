const express = require("express");

const {
  addTrustee,
  listTrustees,
  getTrustee,
  editTrustee,
  changeTrusteeStatus,
  publicTrustees,
} = require("../controllers/trusteeController");

const trusteeUpload = require("../middleware/trusteeUpload");

const router = express.Router();

// Public
router.get("/public", publicTrustees);

// Admin
router.post(
  "/",
  trusteeUpload.single("profile_image"),
  addTrustee
);

router.get("/", listTrustees);

router.get("/:id", getTrustee);

router.put(
  "/:id",
  trusteeUpload.single("profile_image"),
  editTrustee
);

router.patch(
  "/:id/status",
  changeTrusteeStatus
);

module.exports = router;