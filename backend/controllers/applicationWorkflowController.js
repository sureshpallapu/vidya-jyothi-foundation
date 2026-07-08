const {
  getApplicationById,
  updateApplicationStatus,
  saveStatusHistory,
} = require("../models/applicationWorkflowModel");

const {
  getAdminById,
} = require("../models/adminModel");

/*
|--------------------------------------------------------------------------
| Valid Workflow Transitions
|--------------------------------------------------------------------------
*/

const WORKFLOW = {
  Submitted: [
    "Documents Verified",
    "Rejected",
  ],

  "Documents Verified": [
    "Under Review",
    "Rejected",
  ],

  "Under Review": [
    "Approved",
    "Rejected",
  ],

  Approved: [
    "Scholarship Released",
  ],

  Rejected: [],

  "Scholarship Released": [],
};

/*
|--------------------------------------------------------------------------
| Role Permissions
|--------------------------------------------------------------------------
|
| Current Status
|        ↓
| Next Status
|        ↓
| Allowed Roles
|
*/

const ROLE_PERMISSIONS = {

  Submitted: {

    "Documents Verified": [
      "VERIFICATION_OFFICER",
      "SUPER_ADMIN",
    ],

    Rejected: [
      "VERIFICATION_OFFICER",
      "SUPER_ADMIN",
    ],

  },

  "Documents Verified": {

    "Under Review": [
      "REVIEW_OFFICER",
      "SUPER_ADMIN",
    ],

    Rejected: [
      "REVIEW_OFFICER",
      "SUPER_ADMIN",
    ],

  },

  "Under Review": {

    Approved: [
      "FOUNDER",
      "SUPER_ADMIN",
    ],

    Rejected: [
      "FOUNDER",
      "SUPER_ADMIN",
    ],

  },

  Approved: {

    "Scholarship Released": [
      "ACCOUNTS",
      "SUPER_ADMIN",
    ],

  },

  Rejected: {},

  "Scholarship Released": {},

};

/*
|--------------------------------------------------------------------------
| Update Application Workflow
|--------------------------------------------------------------------------
*/

const updateWorkflow = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      status,
      remarks,
      sanctionedAmount,
      adminId,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Get Application
    |--------------------------------------------------------------------------
    */

    const application =
      await getApplicationById(id);

    if (!application) {

      return res.status(404).json({

        success: false,

        message: "Application not found.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Get Admin
    |--------------------------------------------------------------------------
    */

    const admin =
      await getAdminById(adminId);

    if (!admin) {

      return res.status(404).json({

        success: false,

        message: "Admin not found.",

      });

    }

    if (admin.status !== "ACTIVE") {

      return res.status(403).json({

        success: false,

        message: "Admin account is inactive.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Current Status
    |--------------------------------------------------------------------------
    */

    const currentStatus =
      application.status;

    /*
    |--------------------------------------------------------------------------
    | Validate Workflow Transition
    |--------------------------------------------------------------------------
    */

    const validTransitions =
      WORKFLOW[currentStatus] || [];

    if (!validTransitions.includes(status)) {

      return res.status(400).json({

        success: false,

        message:
          `Cannot change status from "${currentStatus}" to "${status}".`,

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Role Permission
    |--------------------------------------------------------------------------
    */

    const allowedRoles =
      ROLE_PERMISSIONS[currentStatus]?.[status] || [];

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(admin.role)
    ) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to perform this workflow action.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Approval Requires Sanction Amount
    |--------------------------------------------------------------------------
    */

    if (
      status === "Approved" &&
      (!sanctionedAmount ||
        Number(sanctionedAmount) <= 0)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Sanctioned Amount is required before approval.",

      });

    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Update Fields
    |--------------------------------------------------------------------------
    */

    const fields = {

      status,

      remarks,

      sanctionedAmount:
        sanctionedAmount || null,

      verifiedBy:
        application.verified_by,

      verifiedAt:
        application.verified_at,

      approvedBy:
        application.approved_by,

      approvedAt:
        application.approved_at,

    };

    /*
    |--------------------------------------------------------------------------
    | Documents Verified
    |--------------------------------------------------------------------------
    */

    if (status === "Documents Verified") {

      fields.verifiedBy =
        admin.id;

      fields.verifiedAt =
        new Date();

    }

    /*
    |--------------------------------------------------------------------------
    | Approved
    |--------------------------------------------------------------------------
    */

    if (status === "Approved") {

      fields.approvedBy =
        admin.id;

      fields.approvedAt =
        new Date();

    }

    /*
    |--------------------------------------------------------------------------
    | Update Scholarship Application
    |--------------------------------------------------------------------------
    */

    await updateApplicationStatus(
      id,
      fields
    );

    /*
    |--------------------------------------------------------------------------
    | Save Workflow History
    |--------------------------------------------------------------------------
    */

    await saveStatusHistory({

      applicationId: id,

      previousStatus:
        currentStatus,

      currentStatus:
        status,

      remarks,

      sanctionedAmount:
        sanctionedAmount || null,

      changedBy:
        admin.id,

    });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      message:
        "Application workflow updated successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to update application workflow.",

    });

  }

};

module.exports = {
  updateWorkflow,
};