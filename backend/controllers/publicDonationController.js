const {
    createRazorpayOrder,
    verifyRazorpaySignature,
    fetchRazorpayPayment,
} = require("../services/razorpayService");




const {
    createPublicDonationOrderSchema,
} = require("../validators/publicDonationValidator");


const donorModel = require("../models/donorModel");
const DonationModel = require("../models/donationModel");
const ReceiptModel = require("../models/receiptModel");

const {
    sendReceiptEmail,
} = require("../utils/emailService");


/*
|--------------------------------------------------------------------------
| Create Public Donation Razorpay Order
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Create Public Donation Razorpay Order
|--------------------------------------------------------------------------
*/

async function createDonationOrder(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        const {
            error,
            value,
        } = createPublicDonationOrderSchema.validate(
            req.body
        );

        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    "Please correct the donation details.",

                errors:
                    error.details.map(
                        item => item.message
                    ),

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Create Razorpay Order
        |--------------------------------------------------------------------------
        */

        const order =
            await createRazorpayOrder({

                amount:
                    value.amount,

                receipt:
                    `VJF_${Date.now()}`,

                notes: {

                    source:
                        "PUBLIC_DONATION",

                    donor_email:
                        value.email,

                    donation_type_id:
                        String(
                            value.donation_type_id
                        ),

                },

            });


        /*
        |--------------------------------------------------------------------------
        | Find Existing Donor
        |--------------------------------------------------------------------------
        */

        let donor =
            await donorModel.findByEmail(
                value.email
            );


        /*
        |--------------------------------------------------------------------------
        | Create Donor If Not Found
        |--------------------------------------------------------------------------
        */

        if (!donor) {

            console.log(
                "👤 Creating donor before payment..."
            );

            donor =
                await donorModel.createDonor({

                    donor_type_id: 1,

                    full_name:
                        value.full_name.trim(),

                    display_name:
                        value.full_name.trim(),

                    mobile:
                        value.mobile.trim(),

                    email:
                        value.email.trim(),

                    pan_number:
                        value.pan_number ||
                        null,

                    address_line1:
                        value.address_line1 ||
                        null,

                    address_line2:
                        value.address_line2 ||
                        null,

                    city:
                        value.city ||
                        null,

                    district:
                        value.district ||
                        null,

                    state:
                        value.state ||
                        "Andhra Pradesh",

                    country:
                        "India",

                    pincode:
                        value.pincode ||
                        null,

                    preferred_communication:
                        "EMAIL",

                    status:
                        "ACTIVE",

                    created_by:
                        1,

                    updated_by:
                        1,

                });

            donor =
                await donorModel.findByEmail(
                    value.email
                );

        }


        /*
        |--------------------------------------------------------------------------
        | Safety Check
        |--------------------------------------------------------------------------
        */

        if (!donor || !donor.id) {

            throw new Error(
                "Unable to create or identify donor."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Calculate Financial Year
        |--------------------------------------------------------------------------
        */

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            today.getMonth() + 1;

        const financialYear =
            month >= 4
                ? `${year}-${String(
                    year + 1
                ).slice(-2)}`
                : `${year - 1}-${String(
                    year
                ).slice(-2)}`;


        /*
        |--------------------------------------------------------------------------
        | Create PENDING Donation
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | The donation is created BEFORE Razorpay payment.
        |
        | reference_number stores Razorpay Order ID.
        |
        | This allows the webhook to find the donation immediately.
        |--------------------------------------------------------------------------
        */

        const donation =
            await DonationModel.createDonation({

                donor_id:
                    donor.id,

                donation_type_id:
                    Number(
                        value.donation_type_id
                    ),

                /*
                |--------------------------------------------------------------------------
                | Payment Gateway
                |--------------------------------------------------------------------------
                |
                | Existing master data:
                |
                | 9 = Payment Gateway
                |--------------------------------------------------------------------------
                */

                payment_mode_id:
                    9,

                donation_date:
                    today.toISOString()
                        .split("T")[0],

                amount:
                    Number(
                        value.amount
                    ),

                currency:
                    "INR",

                financial_year:
                    financialYear,

                reference_number:
                    order.id,

                transaction_id:
                    null,

                remarks:
                    "Online donation initiated via Razorpay.",

                is_anonymous:
                    false,

                receipt_required:
                    true,

                tax_exemption:
                    true,

                status:
                    "PENDING",

                created_by:
                    1,

                updated_by:
                    1,

            });


        /*
        |--------------------------------------------------------------------------
        | Log
        |--------------------------------------------------------------------------
        */

        console.log(
            "✅ PENDING donation created:",
            donation.donation_code
        );

        console.log(
            "📌 Razorpay Order:",
            order.id
        );


        /*
        |--------------------------------------------------------------------------
        | Return Order + Donation
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Donation payment order created successfully.",

            data: {

                order_id:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency,

                key_id:
                    process.env.RAZORPAY_KEY_ID,

                donation: {

                    id:
                        donation.id,

                    donation_code:
                        donation.donation_code,

                    status:
                        "PENDING",

                },

                donor: {

                    id:
                        donor.id,

                    donor_code:
                        donor.donor_code,

                    full_name:
                        donor.full_name,

                    email:
                        donor.email,

                    mobile:
                        donor.mobile,

                },

            },

        });

    } catch (error) {

        console.error(
            "❌ Create Donation Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.error?.description ||
                error.message ||
                "Unable to create payment order.",

        });

    }

}
// async function createDonationOrder(req, res) {

//     try {

//         /*
//         |----------------------------------------------------------------------
//         | Validate Request
//         |----------------------------------------------------------------------
//         */

//         const {
//             error,
//             value,
//         } =
//             createPublicDonationOrderSchema.validate(
//                 req.body
//             );

//         if (error) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Please correct the donation details.",

//                 errors:
//                     error.details.map(
//                         item => item.message
//                     ),

//             });

//         }


//         /*
//         |----------------------------------------------------------------------
//         | Create Razorpay Order
//         |----------------------------------------------------------------------
//         */

//         const order =
//             await createRazorpayOrder({

//                 amount: value.amount,

//                 receipt:
//                     `VJF_${Date.now()}`,

//                 notes: {

//                     source:
//                         "PUBLIC_DONATION",

//                     donor_email:
//                         value.email,

//                     donation_type_id:
//                         String(
//                             value.donation_type_id
//                         ),

//                 },

//             });


//         /*
//         |----------------------------------------------------------------------
//         | Return Order
//         |----------------------------------------------------------------------
//         */

//         return res.status(201).json({

//             success: true,

//             message:
//                 "Donation payment order created successfully.",

//             data: {

//                 order_id:
//                     order.id,

//                 amount:
//                     order.amount,

//                 currency:
//                     order.currency,

//                 key_id:
//                     process.env.RAZORPAY_KEY_ID,

//                 donor: {

//                     full_name:
//                         value.full_name,

//                     email:
//                         value.email,

//                     mobile:
//                         value.mobile,

//                 },

//             },

//         });

//     } catch (error) {

//         console.error(
//             "Create Donation Order Error:",
//             error
//         );

//         return res.status(500).json({

//             success: false,

//             message:
//                 error.error?.description ||
//                 error.message ||
//                 "Unable to create payment order.",

//         });

//     }

// }
/*
|--------------------------------------------------------------------------
| Verify Public Donation Razorpay Payment
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Verify Public Donation Razorpay Payment
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Verify Public Donation Razorpay Payment
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This function NO LONGER creates a donation.
|
| The donation was already created as PENDING during create-order.
|
| This function only:
|
| 1. Verifies Razorpay checkout signature
| 2. Fetches payment from Razorpay
| 3. Finds existing PENDING donation
| 4. Validates order / amount / currency
| 5. Updates payment information
| 6. Returns success
|
| Receipt generation and email processing are handled separately by
| the Razorpay webhook.
|
|--------------------------------------------------------------------------
*/

async function verifyDonationPayment(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | 1. Read Request
        |--------------------------------------------------------------------------
        */

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        console.log("");
        console.log(
            "================================================"
        );

        console.log(
            "🔐 RAZORPAY PAYMENT VERIFICATION"
        );

        console.log(
            "================================================"
        );

        console.log(
            "Order ID:",
            razorpay_order_id
        );

        console.log(
            "Payment ID:",
            razorpay_payment_id
        );


        /*
        |--------------------------------------------------------------------------
        | 2. Validate Required Values
        |--------------------------------------------------------------------------
        */

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay payment verification information is incomplete.",

            });

        }


        /*
        |--------------------------------------------------------------------------
        | 3. Verify Razorpay Checkout Signature
        |--------------------------------------------------------------------------
        */

        const signatureValid =
            verifyRazorpaySignature({

                orderId:
                    razorpay_order_id,

                paymentId:
                    razorpay_payment_id,

                signature:
                    razorpay_signature,

            });


        if (!signatureValid) {

            console.error(
                "❌ Razorpay payment signature verification failed."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Invalid Razorpay payment signature.",

            });

        }


        console.log(
            "✅ Razorpay payment signature verified."
        );


        /*
        |--------------------------------------------------------------------------
        | 4. Fetch Payment Directly From Razorpay
        |--------------------------------------------------------------------------
        |
        | This gives us server-side payment information.
        |
        */

        const payment =
            await fetchRazorpayPayment(
                razorpay_payment_id
            );


        if (!payment) {

            console.error(
                "❌ Razorpay payment could not be fetched."
            );

            return res.status(400).json({

                success: false,

                message:
                    "Unable to retrieve Razorpay payment information.",

            });

        }


        /*
        |--------------------------------------------------------------------------
        | 5. Validate Order ID
        |--------------------------------------------------------------------------
        */

        if (
            payment.order_id !==
            razorpay_order_id
        ) {

            console.error(
                "❌ Razorpay Order ID mismatch."
            );

            console.error(
                "Expected:",
                razorpay_order_id
            );

            console.error(
                "Received:",
                payment.order_id
            );

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay order verification failed.",

            });

        }


        /*
        |--------------------------------------------------------------------------
        | 6. Validate Payment Status
        |--------------------------------------------------------------------------
        */

        if (
            payment.status !==
            "captured"
        ) {

            console.warn(
                "⚠️ Razorpay payment is not captured."
            );

            console.warn(
                "Payment Status:",
                payment.status
            );

            return res.status(400).json({

                success: false,

                message:
                    `Payment is not captured. Current status: ${payment.status}`,

            });

        }


        /*
        |--------------------------------------------------------------------------
        | 7. Find Existing Donation
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | The donation was created during /create-order.
        |
        | reference_number = Razorpay Order ID
        |
        */

        const donation =
            await DonationModel.findByRazorpayOrderId(
                razorpay_order_id
            );


        if (!donation) {

            console.error(
                "❌ Donation not found for Razorpay order."
            );

            console.error(
                "Order ID:",
                razorpay_order_id
            );

            /*
            |--------------------------------------------------------------------------
            | Do NOT create a donation here.
            |
            | The webhook may already be processing it.
            |--------------------------------------------------------------------------
            */

            return res.status(409).json({

                success: false,

                message:
                    "Donation record is not available yet. Please wait for payment confirmation.",

                data: {

                    order_id:
                        razorpay_order_id,

                    payment_id:
                        razorpay_payment_id,

                },

            });

        }


        console.log(
            "✅ Donation found:",
            donation.donation_code
        );


        /*
        |--------------------------------------------------------------------------
        | 8. Check If Already Processed
        |--------------------------------------------------------------------------
        */

       /*
|--------------------------------------------------------------------------
| Already RECEIVED
|--------------------------------------------------------------------------
|
| Payment is already verified.
| We still continue to receipt processing because the webhook
| may be the first/only component responsible for receipt delivery.
|--------------------------------------------------------------------------
*/

if (donation.status === "RECEIVED") {

    console.log(
        "ℹ️ Donation is already marked RECEIVED."
    );

    /*
    |--------------------------------------------------------------------------
    | Continue to receipt processing
    |--------------------------------------------------------------------------
    */

}


        /*
        |--------------------------------------------------------------------------
        | 9. Validate Currency
        |--------------------------------------------------------------------------
        */

        const donationCurrency =
            String(
                donation.currency ||
                "INR"
            ).toUpperCase();

        const paymentCurrency =
            String(
                payment.currency ||
                "INR"
            ).toUpperCase();


        if (
            donationCurrency !==
            paymentCurrency
        ) {

            console.error(
                "❌ Currency mismatch."
            );

            console.error(
                "Donation Currency:",
                donationCurrency
            );

            console.error(
                "Razorpay Currency:",
                paymentCurrency
            );

            return res.status(400).json({

                success: false,

                message:
                    "Payment currency verification failed.",

            });

        }


        /*
        |--------------------------------------------------------------------------
        | 10. Validate Amount
        |--------------------------------------------------------------------------
        |
        | Database:
        |
        | ₹100
        |
        | Razorpay:
        |
        | 10000 paise
        |
        |--------------------------------------------------------------------------
        */

        const expectedAmountPaise =
            Math.round(
                Number(
                    donation.amount
                ) * 100
            );

        const receivedAmountPaise =
            Number(
                payment.amount
            );


        if (
            expectedAmountPaise !==
            receivedAmountPaise
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
                expectedAmountPaise
            );

            console.error(
                "Razorpay Paise:",
                receivedAmountPaise
            );

            return res.status(400).json({

                success: false,

                message:
                    "Payment amount verification failed.",

            });

        }


        console.log(
            "✅ Payment amount verified."
        );


        /*
        |--------------------------------------------------------------------------
        | 11. Update Donation
        |--------------------------------------------------------------------------
        |
        | We DO NOT create a new donation.
        |
        | We update the PENDING donation created in Step 2.
        |--------------------------------------------------------------------------
        */

        const updatedRows =
            await DonationModel.updateRazorpayPaymentSuccess(

                donation.id,

                razorpay_payment_id,

                "RECEIVED"

            );


        if (
            !updatedRows
        ) {

            console.error(
                "❌ Donation payment update failed."
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update donation payment status.",

            });

        }


        console.log(
            "✅ Donation updated successfully."
        );

        console.log(
            "Donation:",
            donation.donation_code
        );

        console.log(
            "Payment:",
            razorpay_payment_id
        );

        console.log(
            "Status: RECEIVED"
        );


        /*
        |--------------------------------------------------------------------------
        | 12. IMPORTANT
        |--------------------------------------------------------------------------
        |
        | DO NOT generate receipt here.
        |
        | DO NOT send email here.
        |
        | The Razorpay webhook handles receipt/email processing.
        |--------------------------------------------------------------------------
        */


        console.log(
            "ℹ️ Receipt/email processing will be handled by Razorpay webhook."
        );


        /*
        |--------------------------------------------------------------------------
        | 13. Final Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message:
                "Donation payment verified successfully.",

            data: {

                donation_id:
                    donation.id,

                donation_code:
                    donation.donation_code,

                order_id:
                    razorpay_order_id,

                payment_id:
                    razorpay_payment_id,

                amount:
                    Number(
                        donation.amount
                    ),

                currency:
                    donation.currency,

                status:
                    "RECEIVED",

            },

        });

    } catch (error) {

        console.error(
            "❌ Verify Donation Payment Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.error?.description ||
                error.message ||
                "Unable to verify donation payment.",

        });

    }

}


/*
|--------------------------------------------------------------------------
| Public Donor Leaderboard
|--------------------------------------------------------------------------
|
| Returns yearly public donor statistics.
|
| IMPORTANT:
| - Only RECEIVED / CLEARED donations are included.
| - Archived donations are excluded.
| - Highest donor is based on TOTAL contribution for that year.
| - Anonymous donors are displayed as "Anonymous Donor".
| - No private donor information is exposed.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Public Donor Leaderboard
|--------------------------------------------------------------------------
*/


async function getPublicDonorLeaderboard(req, res) {

    try {

        const leaderboard =
            await DonationModel.getPublicDonorLeaderboard();

        return res.status(200).json({
            success: true,
            message:
                "Public donor leaderboard fetched successfully.",
            data: leaderboard,
        });

    } catch (error) {

        console.error(
            "❌ Public Donor Leaderboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch public donor leaderboard.",
        });
    }

    
}

/*
|--------------------------------------------------------------------------
| Public Top 5 Donors
|--------------------------------------------------------------------------
|
| Returns the Top 5 donors for every donation year.
|
| Rules:
| - Only RECEIVED / CLEARED donations
| - Archived donations excluded
| - Donor contributions are aggregated by year
| - Maximum 5 donors per year
| - Anonymous donors are protected
| - No private donor information is exposed
|
|--------------------------------------------------------------------------
*/

async function getPublicTopDonors(req, res) {

    try {

        const topDonors =
            await DonationModel.getPublicDonorList();

        return res.status(200).json({
            success: true,
            message:
                "Public top donors fetched successfully.",
            data: topDonors,
        });

    } catch (error) {

        console.error(
            "❌ Public Top Donors Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch public top donors.",
        });
    }
}
/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    createDonationOrder,

    verifyDonationPayment,

    getPublicDonorLeaderboard,

    getPublicTopDonors

};


