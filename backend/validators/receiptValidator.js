const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Generate Receipt
|--------------------------------------------------------------------------
*/

const createReceiptSchema = Joi.object({

    donation_id: Joi.number()
        .integer()
        .positive()
        .required(),

    receipt_date: Joi.date()
        .required(),

    created_by: Joi.number()
        .integer()
        .positive()
        .required(),

    updated_by: Joi.number()
        .integer()
        .positive()
        .required()

});

/*
|--------------------------------------------------------------------------
| Cancel Receipt
|--------------------------------------------------------------------------
*/

const cancelReceiptSchema = Joi.object({

    cancelled_reason: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required(),

    cancelled_by: Joi.number()
        .integer()
        .positive()
        .required(),

    updated_by: Joi.number()
        .integer()
        .positive()
        .required()

});

/*
|--------------------------------------------------------------------------
| Archive / Restore
|--------------------------------------------------------------------------
*/

const archiveReceiptSchema = Joi.object({

    updated_by: Joi.number()
        .integer()
        .positive()
        .required()

});

/*
|--------------------------------------------------------------------------
| List Receipts
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| List Receipts
|--------------------------------------------------------------------------
*/

const listReceiptSchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    search: Joi.string()
        .allow("")
        .optional(),

    receiptStatus: Joi.string()
        .valid("GENERATED", "CANCELLED")
        .allow("")
        .optional(),

    receiptType: Joi.string()
        .valid("ORIGINAL", "DUPLICATE", "REPRINT")
        .allow("")
        .optional(),

    financialYear: Joi.string()
        .allow("")
        .optional(),

    fromDate: Joi.date()
        .allow("")
        .optional(),

    toDate: Joi.date()
        .allow("")
        .optional(),

    includeArchived: Joi.boolean()
        .default(false)

}).unknown(true);

module.exports = {

    createReceiptSchema,

    cancelReceiptSchema,

    archiveReceiptSchema,

    listReceiptSchema

};