const express = require("express");

const router = express.Router();

const {
  updateWorkflow,
} = require("../controllers/applicationWorkflowController");

/*
|--------------------------------------------------------------------------
| Scholarship Workflow
|--------------------------------------------------------------------------
*/

router.put(
  "/applications/:id/workflow",
  updateWorkflow
);

module.exports = router;