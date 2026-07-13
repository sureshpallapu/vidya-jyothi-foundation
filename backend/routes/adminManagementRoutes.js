const express = require("express");

const router = express.Router();

const {

  getAdmins,
  getAdmin,
  createAdministrator,
  updateAdministrator,
  changeAdministratorStatus,
  resetAdministratorPassword,
  deleteAdministrator,

} = require("../controllers/adminManagementController");

/*
|--------------------------------------------------------------------------
| Administrator Management Routes
|--------------------------------------------------------------------------
*/

// Get All Administrators
router.get("/admins", getAdmins);

// Get Administrator By ID
router.get("/admins/:id", getAdmin);

// Create Administrator
router.post("/admins", createAdministrator);

// Update Administrator
router.put("/admins/:id", updateAdministrator);

// Activate / Deactivate Administrator
router.put(
  "/admins/:id/status",
  changeAdministratorStatus
);

// Reset Administrator Password
router.put(
  "/admins/:id/password",
  resetAdministratorPassword
);

// Delete Administrator
router.delete(
  "/admins/:id",
  deleteAdministrator
);

module.exports = router;