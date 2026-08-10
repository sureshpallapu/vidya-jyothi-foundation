const ReceiptModel = require("../models/receiptModel");
const ApiResponse = require("../utils/ApiResponse");

const {
    sendReceiptEmail,
} = require("../utils/emailService");

const {
    createReceiptSchema,
    cancelReceiptSchema,
    archiveReceiptSchema,
    listReceiptSchema
} = require("../validators/receiptValidator");

/*
|--------------------------------------------------------------------------
| Generate Receipt
|--------------------------------------------------------------------------
*/

async function generateReceipt(req, res) {

    try {

        const { error, value } = createReceiptSchema.validate(req.body);

        if (error) {

            return ApiResponse.validationError(
                res,
                error.details.map(item => item.message)
            );

        }

        const receipt = await ReceiptModel.generateReceipt(value);

        return ApiResponse.created(
            res,
            "Receipt generated successfully.",
            receipt
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Get Receipt
|--------------------------------------------------------------------------
*/

async function getReceipt(req, res) {

    try {

        const receipt = await ReceiptModel.findByCode(
            req.params.receiptCode
        );

        if (!receipt) {

            return ApiResponse.notFound(
                res,
                "Receipt not found."
            );

        }

        return ApiResponse.success(
            res,
            "Receipt fetched successfully.",
            receipt
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| List Receipts
|--------------------------------------------------------------------------
*/

async function listReceipts(req, res) {

    try {

        const { error, value } = listReceiptSchema.validate(req.query);

        if (error) {

            return ApiResponse.validationError(
                res,
                error.details.map(item => item.message)
            );

        }

        const receipts = await ReceiptModel.listReceipts(value);

        return ApiResponse.success(
            res,
            "Receipts fetched successfully.",
            receipts
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Cancel Receipt
|--------------------------------------------------------------------------
*/

async function cancelReceipt(req, res) {

    try {

        const { error, value } = cancelReceiptSchema.validate(req.body);

        if (error) {

            return ApiResponse.validationError(
                res,
                error.details.map(item => item.message)
            );

        }

        const receipt = await ReceiptModel.cancelReceipt(
            req.params.receiptCode,
            value
        );

        return ApiResponse.success(
            res,
            "Receipt cancelled successfully.",
            receipt
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Archive Receipt
|--------------------------------------------------------------------------
*/

async function archiveReceipt(req, res) {

    try {

        const archivedBy = req.body.archived_by || 1;

        const success = await ReceiptModel.archiveReceipt(
            req.params.receiptCode,
            archivedBy
        );

        if (!success) {

            return ApiResponse.notFound(
                res,
                "Receipt not found."
            );

        }

        return ApiResponse.success(
            res,
            "Receipt archived successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Restore Receipt
|--------------------------------------------------------------------------
*/

async function restoreReceipt(req, res) {

    try {

        const updatedBy = req.body.updated_by || 1;

        const success = await ReceiptModel.restoreReceipt(
            req.params.receiptCode,
            updatedBy
        );

        if (!success) {

            return ApiResponse.notFound(
                res,
                "Receipt not found."
            );

        }

        return ApiResponse.success(
            res,
            "Receipt restored successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Receipt Statistics
|--------------------------------------------------------------------------
*/

async function statistics(req, res) {

    try {

        const stats = await ReceiptModel.statistics();

        return ApiResponse.success(
            res,
            "Receipt statistics fetched successfully.",
            stats
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Verify Receipt
|--------------------------------------------------------------------------
*/

async function verifyReceipt(req, res) {

    try {

        const receipt = await ReceiptModel.verifyReceipt(
            req.params.receiptCode
        );

        if (!receipt) {

            return ApiResponse.notFound(
                res,
                "Receipt not found."
            );

        }

        return ApiResponse.success(
            res,
            "Receipt verified successfully.",
            receipt
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| Send Receipt Email
|--------------------------------------------------------------------------
*/

const emailReceipt = async (req, res) => {

    try {

        const { receiptCode } = req.params;

        const receipt = await ReceiptModel.getReceiptForEmail(
            receiptCode
        );

        if (!receipt) {

            return ApiResponse.notFound(
                res,
                "Receipt not found."
            );

        }

        if (!receipt.email) {

            return ApiResponse.validationError(
                res,
                [
                    "Donor email address is not available."
                ]
            );

        }

        const result = await sendReceiptEmail(
            receipt
        );

        if (!result.success) {

            return ApiResponse.error(
                res,
                result.error ||
                "Unable to send receipt email."
            );

        }

        return ApiResponse.success(
            res,
            "Receipt email sent successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

};


module.exports = {

    generateReceipt,

    getReceipt,

    listReceipts,

    cancelReceipt,

    archiveReceipt,

    restoreReceipt,

    statistics,

    verifyReceipt,
    emailReceipt


};