const express = require("express");

const router = express.Router();

const {
  cyclesList,
  cycleDetails,
  createCycle,
  updateCycle,
  activateCycle,
  deleteCycle,
} = require("../controllers/scholarshipCycleController");

/*
|--------------------------------------------------------------------------
| Scholarship Cycle Routes
|--------------------------------------------------------------------------
*/

// Get All Scholarship Cycles
router.get("/cycles", cyclesList);

// Get Single Scholarship Cycle
router.get("/cycles/:id", cycleDetails);

// Create Scholarship Cycle
router.post("/cycles", createCycle);

// Update Scholarship Cycle
router.put("/cycles/:id", updateCycle);

// Activate Scholarship Cycle
router.put("/cycles/:id/activate", activateCycle);

// Delete Scholarship Cycle
router.delete("/cycles/:id", deleteCycle);

module.exports = router;