const express = require("express");

const router = express.Router();

const {
    createDonationOrder,
    verifyDonationPayment,
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


module.exports = router;