const express = require("express");

const router = express.Router();

const {
    handleRazorpayWebhook,
} = require("../controllers/razorpayWebhookController");


// ============================================================================
// RAZORPAY WEBHOOK
// ============================================================================

router.post(
    "/",
    handleRazorpayWebhook
);


module.exports = router;