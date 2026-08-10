const express = require("express");
const router = express.Router();

const DonationController = require("../controllers/donationController");

/*
|--------------------------------------------------------------------------
| Donation Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    DonationController.statistics
);

/*
|--------------------------------------------------------------------------
| Donation Summary (By Donor)
|--------------------------------------------------------------------------
*/

router.get(
    "/donor/:donorId/summary",
    DonationController.donationSummary
);

/*
|--------------------------------------------------------------------------
| Donor Donation History
|--------------------------------------------------------------------------
*/

router.get(
    "/donor/:donorId/history",
    DonationController.donorHistory
);

/*
|--------------------------------------------------------------------------
| List Donations
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    DonationController.listDonations
);

/*
|--------------------------------------------------------------------------
| Get Donation By Code
|--------------------------------------------------------------------------
*/

router.get(
    "/:donationCode",
    DonationController.getDonation
);

/*
|--------------------------------------------------------------------------
| Create Donation
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    DonationController.createDonation
);

/*
|--------------------------------------------------------------------------
| Update Donation
|--------------------------------------------------------------------------
*/

router.put(
    "/:donationCode",
    DonationController.updateDonation
);

/*
|--------------------------------------------------------------------------
| Cancel Donation
|--------------------------------------------------------------------------
*/

router.patch(
    "/:donationCode/cancel",
    DonationController.cancelDonation
);

/*
|--------------------------------------------------------------------------
| Archive Donation
|--------------------------------------------------------------------------
*/

router.patch(
    "/:donationCode/archive",
    DonationController.archiveDonation
);

/*
|--------------------------------------------------------------------------
| Restore Donation
|--------------------------------------------------------------------------
*/

router.patch(
    "/:donationCode/restore",
    DonationController.restoreDonation
);

/*
|--------------------------------------------------------------------------
| Donation Types
|--------------------------------------------------------------------------
*/

router.get(
    "/master/donation-types",
    DonationController.getDonationTypes
);

/*
|--------------------------------------------------------------------------
| Payment Modes
|--------------------------------------------------------------------------
*/

router.get(
    "/master/payment-modes",
    DonationController.getPaymentModes
);

module.exports = router;