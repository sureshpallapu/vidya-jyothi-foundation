const crypto = require("crypto");

const DonationModel =
    require("../models/donationModel");

const ReceiptModel =
    require("../models/receiptModel");

const {
    sendReceiptEmail,
} = require("../utils/emailService");
/*
|--------------------------------------------------------------------------
| Razorpay Webhook Signature Verification
|--------------------------------------------------------------------------
*/

function verifyWebhookSignature(rawBody, signature) {
    try {
        if (!rawBody || !signature) {
            return false;
        }

        const secret =
            process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error(
                "❌ RAZORPAY_WEBHOOK_SECRET is not configured."
            );

            return false;
        }

        const generatedSignature =
            crypto
                .createHmac("sha256", secret)
                .update(rawBody)
                .digest("hex");

        /*
        |----------------------------------------------------------------------
        | Timing-safe comparison
        |----------------------------------------------------------------------
        */

        const expectedBuffer =
            Buffer.from(generatedSignature, "utf8");

        const receivedBuffer =
            Buffer.from(signature, "utf8");

        if (
            expectedBuffer.length !==
            receivedBuffer.length
        ) {
            return false;
        }

        return crypto.timingSafeEqual(
            expectedBuffer,
            receivedBuffer
        );

    } catch (error) {

        console.error(
            "❌ Webhook signature verification error:",
            error
        );

        return false;
    }
}


/*
|--------------------------------------------------------------------------
| Small Retry Helper
|--------------------------------------------------------------------------
|
| Handles the situation where Razorpay webhook arrives a little earlier
| than our frontend payment verification creates the donation.
|
*/

function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


/*
|--------------------------------------------------------------------------
| Find Donation With Short Retry
|--------------------------------------------------------------------------
*/

async function findDonationWithRetry(orderId) {

    const maxAttempts = 5;

    const delayMilliseconds = 500;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        const donation =
            await DonationModel.findByRazorpayOrderId(
                orderId
            );

        if (donation) {

            return donation;

        }

        if (attempt < maxAttempts) {

            console.log(
                `⏳ Donation not found yet. ` +
                `Retry ${attempt}/${maxAttempts - 1}...`
            );

            await wait(
                delayMilliseconds
            );
        }
    }

    return null;
}


/*
|--------------------------------------------------------------------------
| Razorpay Webhook
|--------------------------------------------------------------------------
*/

async function handleRazorpayWebhook(req, res) {

    try {

        console.log("");
        console.log(
            "================================================"
        );
        console.log(
            "🔔 RAZORPAY WEBHOOK RECEIVED"
        );
        console.log(
            "================================================"
        );


        /*
        |--------------------------------------------------------------------------
        | 1. Get Raw Body
        |--------------------------------------------------------------------------
        */

        const rawBody = req.body;


        if (!Buffer.isBuffer(rawBody)) {

            console.error(
                "❌ Razorpay webhook body is not a Buffer."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Invalid webhook body.",

            });
        }


        console.log(
            "✅ Raw webhook body received"
        );


        /*
        |--------------------------------------------------------------------------
        | 2. Get Razorpay Signature
        |--------------------------------------------------------------------------
        */

        const signature =
            req.headers[
                "x-razorpay-signature"
            ];


        if (!signature) {

            console.error(
                "❌ Razorpay webhook signature missing."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Webhook signature missing.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 3. Verify Signature
        |--------------------------------------------------------------------------
        */

        const signatureValid =
            verifyWebhookSignature(
                rawBody,
                signature
            );


        if (!signatureValid) {

            console.error(
                "❌ Razorpay webhook signature verification failed."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Invalid webhook signature.",

            });
        }


        console.log(
            "✅ Razorpay webhook signature verified."
        );


        /*
        |--------------------------------------------------------------------------
        | 4. Parse Webhook JSON
        |--------------------------------------------------------------------------
        */

        let payload;

        try {

            payload =
                JSON.parse(
                    rawBody.toString("utf8")
                );

        } catch (parseError) {

            console.error(
                "❌ Unable to parse Razorpay webhook JSON:",
                parseError
            );

            return res.status(400).json({

                success: false,

                message:
                    "Invalid webhook JSON.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 5. Get Event
        |--------------------------------------------------------------------------
        */

        const event =
            payload?.event;


        console.log(
            "📌 Razorpay Event:",
            event
        );


        /*
        |--------------------------------------------------------------------------
        | 6. Ignore Events We Don't Handle
        |--------------------------------------------------------------------------
        */

        if (
            event !==
                "payment.captured" &&
            event !==
                "payment.failed"
        ) {

            console.log(
                "ℹ️ Webhook event ignored:",
                event
            );

            return res.status(200).json({

                success: true,

                message:
                    "Webhook event received and ignored.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 7. Extract Payment Entity
        |--------------------------------------------------------------------------
        */

        const payment =
            payload?.payload?.payment?.entity;


        if (!payment) {

            console.error(
                "❌ Payment entity missing."
            );

            /*
            |------------------------------------------------------------------
            | Return 200 because the webhook itself is valid,
            | but there is no payment entity to process.
            |------------------------------------------------------------------
            */

            return res.status(200).json({

                success: true,

                message:
                    "Webhook received but payment information was missing.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 8. Extract Payment Information
        |--------------------------------------------------------------------------
        */

        const paymentId =
            payment.id;

        const orderId =
            payment.order_id;

        const amount =
            Number(payment.amount);

        const currency =
            payment.currency;

        const status =
            payment.status;

        const method =
            payment.method;


        console.log(
            "💰 Payment Information:"
        );

        console.log(
            "Payment ID:",
            paymentId
        );

        console.log(
            "Order ID:",
            orderId
        );

        console.log(
            "Amount:",
            amount
        );

        console.log(
            "Currency:",
            currency
        );

        console.log(
            "Status:",
            status
        );

        console.log(
            "Method:",
            method
        );


        /*
        |--------------------------------------------------------------------------
        | 9. Payment Failed
        |--------------------------------------------------------------------------
        */

        if (
            event ===
            "payment.failed"
        ) {

            console.log(
                "⚠️ Razorpay payment failed."
            );

            console.log(
                "Payment ID:",
                paymentId
            );

            return res.status(200).json({

                success: true,

                message:
                    "Payment failure webhook received.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 10. Only Process Captured Payments
        |--------------------------------------------------------------------------
        */

        if (
            event ===
                "payment.captured" &&
            status !==
                "captured"
        ) {

            console.log(
                "⚠️ Payment event received but status is not captured:",
                status
            );

            return res.status(200).json({

                success: true,

                message:
                    "Payment event received.",

            });
        }


        console.log(
            "💰 payment.captured received."
        );


        /*
        |--------------------------------------------------------------------------
        | 11. Validate Required Payment Information
        |--------------------------------------------------------------------------
        */

        if (
            !paymentId ||
            !orderId ||
            !amount ||
            !currency
        ) {

            console.error(
                "❌ Required Razorpay payment information missing."
            );

            return res.status(200).json({

                success: true,

                message:
                    "Payment information incomplete.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 12. Check Duplicate By Payment ID
        |--------------------------------------------------------------------------
        */

       

             



        /*
        |--------------------------------------------------------------------------
        | 13. Find Donation By Razorpay Order ID
        |--------------------------------------------------------------------------
        |
        | This is where the previous race condition happened.
        |
        */

        const donation =
            await findDonationWithRetry(
                orderId
            );


        if (!donation) {

            console.warn(
                "⚠️ Donation still not found after webhook retries."
            );

            console.warn(
                "Razorpay Order ID:",
                orderId
            );

            /*
            |------------------------------------------------------------------
            | IMPORTANT
            |
            | Do NOT create a new donation here.
            |
            | The frontend payment verification flow is responsible for
            | creating the donation in the current architecture.
            |
            | Returning 200 prevents unnecessary webhook retry storms.
            |------------------------------------------------------------------
            */

            return res.status(200).json({

                success: true,

                message:
                    "Payment received. Donation will be reconciled when available.",

                data: {

                    payment_id:
                        paymentId,

                    order_id:
                        orderId,

                },

            });
        }


        console.log(
            "✅ Donation found:",
            donation.donation_code
        );


        /*
        |--------------------------------------------------------------------------
        | 14. Verify Currency
        |--------------------------------------------------------------------------
        */

        if (
            String(donation.currency || "INR")
                .toUpperCase() !==
            String(currency)
                .toUpperCase()
        ) {

            console.error(
                "❌ Currency mismatch."
            );

            console.error(
                "Donation Currency:",
                donation.currency
            );

            console.error(
                "Razorpay Currency:",
                currency
            );

            return res.status(200).json({

                success: true,

                message:
                    "Payment received but currency verification failed.",

            });
        }


        /*
        |--------------------------------------------------------------------------
        | 15. Verify Amount
        |--------------------------------------------------------------------------
        |
        | Database amount:
        | ₹12.00
        |
        | Razorpay amount:
        | 1200 paise
        |
        */

        const donationAmountPaise =
            Math.round(
                Number(donation.amount) * 100
            );


        if (
            donationAmountPaise !==
            amount
        ) {

            console.error(
                "❌ Payment amount mismatch."
            );

            console.error(
                "Donation Amount:",
                donation.amount
            );

            console.error(
                "Expected Paise:",
                donationAmountPaise
            );

            console.error(
                "Razorpay Paise:",
                amount
            );

            return res.status(200).json({

                success: true,

                message:
                    "Payment received but amount verification failed.",

            });
        }


        console.log(
            "✅ Payment amount verified."
        );


        /*
|--------------------------------------------------------------------------
| Update Donation Payment
|--------------------------------------------------------------------------
*/

const updatedRows =
    await DonationModel.updateRazorpayPaymentSuccess(
        donation.id,
        paymentId,
        "RECEIVED"
    );

if (!updatedRows) {

    console.error(
        "❌ Unable to update donation payment."
    );

    return res.status(500).json({

        success: false,

        message:
            "Unable to update donation payment.",

    });

}

console.log(
    "✅ Donation payment updated successfully."
);

console.log(
    "Donation:",
    donation.donation_code
);

console.log(
    "Payment:",
    paymentId
);

console.log(
    "Status: RECEIVED"
);


/*
|--------------------------------------------------------------------------
| Re-fetch Donation
|--------------------------------------------------------------------------
*/

const updatedDonation =
    await DonationModel.findById(
        donation.id
    );


if (!updatedDonation) {

    console.error(
        "❌ Donation disappeared after update."
    );

    return res.status(500).json({

        success: false,

        message:
            "Unable to retrieve updated donation.",

    });

}


/*
|--------------------------------------------------------------------------
| Receipt Generation
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Receipt is generated ONLY when:
|
| receipt_generated = 0
|
| This prevents duplicate receipts.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Receipt Generation
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Reload Latest Donation
|--------------------------------------------------------------------------
*/

const latestDonation =
    await DonationModel.findById(
        donation.id
    );

if (!latestDonation) {

    throw new Error(
        "Unable to retrieve donation after payment processing."
    );

}


/*
|--------------------------------------------------------------------------
| Receipt Processing
|--------------------------------------------------------------------------
*/

if (
    Number(latestDonation.receipt_required) === 1 &&
    Number(latestDonation.receipt_generated) === 0
) {

    console.log(
        "🧾 Generating receipt for donation:",
        latestDonation.donation_code
    );

    try {

        /*
        |--------------------------------------------------------------------------
        | Generate Receipt
        |--------------------------------------------------------------------------
        */

        const receipt =
            await ReceiptModel.generateReceipt({

                donation_id:
                    latestDonation.id,

                receipt_date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                created_by:
                    1,

                updated_by:
                    1,

            });


        console.log(
            "✅ Receipt generated:",
            receipt.receipt_code
        );


        /*
        |--------------------------------------------------------------------------
        | Fetch Complete Receipt
        |--------------------------------------------------------------------------
        */

        const receiptDetails =
            await ReceiptModel.getReceiptForEmail(
                receipt.receipt_code
            );


        if (!receiptDetails) {

            throw new Error(
                "Receipt generated but receipt details could not be loaded."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Send Receipt Email
        |--------------------------------------------------------------------------
        */

        if (receiptDetails.email) {

            console.log(
                "📧 Sending receipt email to:",
                receiptDetails.email
            );


            const emailResult =
                await sendReceiptEmail(
                    receiptDetails
                );


            if (emailResult?.success) {

                console.log(
                    "✅ Receipt email sent successfully."
                );

            } else {

                console.error(
                    "❌ Receipt email failed:",
                    emailResult?.error
                );

            }

        } else {

            console.warn(
                "⚠️ No donor email available."
            );

        }

    } catch (receiptError) {

        console.error(
            "❌ Receipt processing failed:",
            receiptError
        );

    }

} else {

    console.log(
        "ℹ️ Receipt already generated. Skipping duplicate receipt/email."
    );

}

        /*
        |--------------------------------------------------------------------------
        | 18. Webhook Successfully Reconciled
        |--------------------------------------------------------------------------
        */

        console.log(
            "================================================"
        );

        console.log(
            "✅ RAZORPAY WEBHOOK RECONCILED SUCCESSFULLY"
        );

        console.log(
            "Donation:",
            donation.donation_code
        );

        console.log(
            "Payment:",
            paymentId
        );

        console.log(
            "Order:",
            orderId
        );

        console.log(
            "================================================"
        );


        /*
        |--------------------------------------------------------------------------
        | 19. Return Success
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message:
                "Razorpay payment webhook processed successfully.",

            data: {

                donation_code:
                    donation.donation_code,

                payment_id:
                    paymentId,

                order_id:
                    orderId,

                amount:
                    Number(donation.amount),

                currency:
                    currency,

                status:
                    status,

            },

        });

    } catch (error) {

        console.error(
            "❌ Razorpay Webhook Error:",
            error
        );


        /*
        |--------------------------------------------------------------------------
        | Important:
        |
        | For unexpected server errors we return 500 so Razorpay can retry.
        |--------------------------------------------------------------------------
        */

        return res.status(500).json({

            success: false,

            message:
                "Webhook processing failed.",

        });
    }
}


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    handleRazorpayWebhook,

};