const express = require("express");

const router = express.Router();

const {
    // =========================================================
    // PUBLIC
    // =========================================================
    createPublicVolunteer,
    getVolunteer,

    // =========================================================
    // ADMIN
    // =========================================================
    listVolunteers,
    createAdminVolunteer,
    getAdminVolunteer,

    checkAadhaarDuplicate,

    completeVolunteerProfile,

    revealVolunteerContact,

    approveVolunteer,
    rejectVolunteer,

    activateVolunteer,
    suspendVolunteer,
    deactivateVolunteer,

    archiveVolunteer,
    restoreVolunteer,

} = require("../controllers/volunteerController");


// ============================================================================
// PUBLIC VOLUNTEER APIs
// ============================================================================

/*
|--------------------------------------------------------------------------
| CREATE PUBLIC VOLUNTEER
|--------------------------------------------------------------------------
|
| POST
| /api/volunteers
|
| Public user submits initial volunteer information.
|
*/

router.post(
    "/",
    createPublicVolunteer
);


// ============================================================================
// ADMIN VOLUNTEER APIs
// ============================================================================

/*
|--------------------------------------------------------------------------
| LIST VOLUNTEERS
|--------------------------------------------------------------------------
|
| GET
| /api/volunteers/admin?page=1&limit=20
|
| IMPORTANT:
| This MUST come before /:volunteerCode
|
*/

router.get(
    "/admin",
    listVolunteers
);


/*
|--------------------------------------------------------------------------
| CREATE OFFLINE VOLUNTEER
|--------------------------------------------------------------------------
|
| POST
| /api/volunteers/admin
|
*/

router.post(
    "/admin",
    createAdminVolunteer
);


/*
|--------------------------------------------------------------------------
| CHECK AADHAAR DUPLICATE
|--------------------------------------------------------------------------
|
| POST
| /api/volunteers/admin/check-aadhaar
|
| Body:
|
| {
|     "aadhaar": "123456789012",
|     "volunteer_code": "VJF-VOL-2026-000003"
| }
|
*/

router.post(
    "/admin/check-aadhaar",
    checkAadhaarDuplicate
);


/*
|--------------------------------------------------------------------------
| GET ADMIN VOLUNTEER
|--------------------------------------------------------------------------
|
| GET
| /api/volunteers/admin/:volunteerCode
|
*/

router.get(
    "/admin/:volunteerCode",
    getAdminVolunteer
);


/*
|--------------------------------------------------------------------------
| REVEAL VOLUNTEER CONTACT
|--------------------------------------------------------------------------
|
| POST
| /api/volunteers/admin/:volunteerCode/reveal-contact
|
| Body:
|
| {
|     "field": "mobile"
| }
|
| OR
|
| {
|     "field": "email"
| }
|
*/

router.post(
    "/admin/:volunteerCode/reveal-contact",
    revealVolunteerContact
);


/*
|--------------------------------------------------------------------------
| COMPLETE / UPDATE VOLUNTEER PROFILE
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/profile
|
| Admin fills remaining information after contacting volunteer.
|
*/

router.put(
    "/admin/:volunteerCode/profile",
    completeVolunteerProfile
);


/*
|--------------------------------------------------------------------------
| APPROVE VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/approve
|
*/

router.put(
    "/admin/:volunteerCode/approve",
    approveVolunteer
);


/*
|--------------------------------------------------------------------------
| REJECT VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/reject
|
*/

router.put(
    "/admin/:volunteerCode/reject",
    rejectVolunteer
);


/*
|--------------------------------------------------------------------------
| ACTIVATE VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/activate
|
*/

router.put(
    "/admin/:volunteerCode/activate",
    activateVolunteer
);


/*
|--------------------------------------------------------------------------
| SUSPEND VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/suspend
|
*/

router.put(
    "/admin/:volunteerCode/suspend",
    suspendVolunteer
);


/*
|--------------------------------------------------------------------------
| DEACTIVATE VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/deactivate
|
*/

router.put(
    "/admin/:volunteerCode/deactivate",
    deactivateVolunteer
);


/*
|--------------------------------------------------------------------------
| ARCHIVE VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/archive
|
*/

router.put(
    "/admin/:volunteerCode/archive",
    archiveVolunteer
);


/*
|--------------------------------------------------------------------------
| RESTORE VOLUNTEER
|--------------------------------------------------------------------------
|
| PUT
| /api/volunteers/admin/:volunteerCode/restore
|
*/

router.put(
    "/admin/:volunteerCode/restore",
    restoreVolunteer
);


// ============================================================================
// PUBLIC — GET SINGLE VOLUNTEER
// ============================================================================

/*
|--------------------------------------------------------------------------
| GET PUBLIC VOLUNTEER
|--------------------------------------------------------------------------
|
| GET
| /api/volunteers/:volunteerCode
|
| IMPORTANT:
| Keep this route LAST.
|
| Otherwise:
|
| /admin
|
| could be interpreted as:
|
| volunteerCode = "admin"
|
*/

router.get(
    "/:volunteerCode",
    getVolunteer
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;