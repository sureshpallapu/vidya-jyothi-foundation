const ReceiptModel = require("../models/receiptModel");

const {
    generateReceiptPDF,
} = require("../utils/receiptPdfGenerator");

const {
    sendReceiptEmail,
} = require("../utils/emailService");


/*
|--------------------------------------------------------------------------
| Finalize Donation
|--------------------------------------------------------------------------
| Called only after Razorpay payment has been successfully verified.
|--------------------------------------------------------------------------
*/

async function finalizeDonation({
    donationId,
    createdBy = 1,
}) {

    /*
    |--------------------------------------------------------------------------
    | STEP 1 — Generate Receipt
    |--------------------------------------------------------------------------
    */

    const receipt = await ReceiptModel.generateReceipt({

        donation_id: donationId,

        receipt_date:
            new Date().toISOString().slice(0, 10),

        created_by: createdBy,

        updated_by: createdBy,

    });


    /*
    |--------------------------------------------------------------------------
    | STEP 2 — Get Complete Receipt Data
    |--------------------------------------------------------------------------
    */

    const receiptData =
        await ReceiptModel.getReceiptForEmail(
            receipt.receipt_code
        );


    if (!receiptData) {

        throw new Error(
            "Receipt was generated but receipt details could not be loaded."
        );

    }


    /*
    |--------------------------------------------------------------------------
    | STEP 3 — Generate Existing Receipt PDF
    |--------------------------------------------------------------------------
    */

    const pdf =
        await generateReceiptPDF(
            receiptData
        );


    /*
    |--------------------------------------------------------------------------
    | STEP 4 — Send Existing Receipt Email
    |--------------------------------------------------------------------------
    */

    const emailResult =
        await sendReceiptEmail({

            ...receiptData,

            pdfPath: pdf.filePath,

            pdfFileName: pdf.fileName,

        });


    if (!emailResult.success) {

        throw new Error(
            emailResult.error ||
            "Receipt generated but email could not be sent."
        );

    }


    /*
    |--------------------------------------------------------------------------
    | STEP 5 — Return Final Result
    |--------------------------------------------------------------------------
    */

    return {

        receipt_id:
            receipt.receipt_id,

        receipt_code:
            receipt.receipt_code,

        receipt_date:
            receipt.receipt_date,

        amount:
            receipt.amount,

        donation_code:
            receipt.donation_code,

        email:
            receiptData.email,

        email_sent:
            true,

        pdf_file_name:
            pdf.fileName,

    };

}


module.exports = {

    finalizeDonation,

};