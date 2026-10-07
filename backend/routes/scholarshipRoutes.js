
const {
  getScholarshipCycles,
} = require("../models/scholarshipCycleModel");

const {
  uploadDocuments,
  downloadDocument,
} = require("../controllers/documentController");
const upload = require("../middleware/fileUpload");
const express = require("express");

const router = express.Router();

const {
  createScholarshipApplication,
  checkApplicationStatus,
  checkAadhaarDuplicate,
} = require("../controllers/scholarshipController");


router.post(
  "/apply",
  createScholarshipApplication
);

router.post(
  "/status",
  checkApplicationStatus
);

router.post(
  "/:id/documents",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "aadhaar",
      maxCount: 1,
    },
    {
      name: "marksMemo",
      maxCount: 1,
    },
    {
      name: "passbook",
      maxCount: 1,
    },
  ]),
  uploadDocuments
);

/*
|--------------------------------------------------------------------------
| Check Aadhaar Duplicate
|--------------------------------------------------------------------------
*/

router.get(
  "/check-aadhaar/:aadhaar",
  checkAadhaarDuplicate
);


router.get(
  "/documents/download/:applicationId/:fileName",
  downloadDocument
);


/*
|--------------------------------------------------------------------------
| Public Scholarship Cycle Information
|--------------------------------------------------------------------------
| Used by the public scholarship application page to determine:
| - whether an active cycle exists
| - which cycle is coming next
|--------------------------------------------------------------------------
*/

router.get("/cycles", async (req, res) => {
  try {
    const cycles = await getScholarshipCycles();

    res.status(200).json({
      success: true,
      data: cycles,
    });
  } catch (error) {
    console.error("Error fetching scholarship cycles:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarship cycle information.",
    });
  }
});


module.exports = router;