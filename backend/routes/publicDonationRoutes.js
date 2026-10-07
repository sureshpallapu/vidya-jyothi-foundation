const express = require("express");

const router = express.Router();

const {
    createDonationOrder,
    verifyDonationPayment,
    getPublicTopDonors,
} = require("../controllers/publicDonationController");

const {
    getPublicDonorLeaderboard,
} = require("../controllers/publicDonationController");


/*
|--------------------------------------------------------------------------
| Create Public Donation Payment Order
|--------------------------------------------------------------------------
*/

router.post(
    "/create-order",
    createDonationOrder
);


/*
|--------------------------------------------------------------------------
| Verify Public Donation Payment
|--------------------------------------------------------------------------
*/

router.post(
    "/verify-payment",
    verifyDonationPayment
);

router.get(
    "/leaderboard",
    getPublicDonorLeaderboard
);

router.get(
    "/top-donors",
    getPublicTopDonors
);
module.exports = router;