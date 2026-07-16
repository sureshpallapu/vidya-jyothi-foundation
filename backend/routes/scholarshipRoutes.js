
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

module.exports = router;