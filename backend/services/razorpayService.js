require("dotenv").config();

const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
|--------------------------------------------------------------------------
| Create Razorpay Order
|--------------------------------------------------------------------------
*/

async function createRazorpayOrder({
    amount,
    receipt,
    notes = {},
}) {

    const order = await razorpay.orders.create({

        amount: Math.round(Number(amount) * 100),

        currency: "INR",

        receipt,

        notes,

    });

    return order;
}

/*
|--------------------------------------------------------------------------
| Verify Razorpay Payment
|--------------------------------------------------------------------------
*/

function verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
}) {

    const generatedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${orderId}|${paymentId}`
            )
            .digest("hex");

    return generatedSignature === signature;
}

/*
|--------------------------------------------------------------------------
| Fetch Razorpay Payment
|--------------------------------------------------------------------------
*/

async function fetchRazorpayPayment(
    paymentId
) {

    const payment =
        await razorpay.payments.fetch(
            paymentId
        );

    return payment;
}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    razorpay,

    createRazorpayOrder,

    verifyRazorpaySignature,

    fetchRazorpayPayment,

};