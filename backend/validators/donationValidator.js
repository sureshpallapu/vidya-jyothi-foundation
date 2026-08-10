const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Create Donation Validation
|--------------------------------------------------------------------------
*/

const createDonationSchema = Joi.object({

    donor_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Donor is required."
        }),

    donation_type_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Donation type is required."
        }),

    payment_mode_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Payment mode is required."
        }),

    donation_date: Joi.date()
        .required(),

    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.positive": "Donation amount must be greater than zero."
        }),

    currency: Joi.string()
        .default("INR"),

    financial_year: Joi.string()
        .max(20)
        .required(),

   reference_number: Joi.string()
    .allow("", null),

cheque_number: Joi.string()
    .allow("", null),

cheque_date: Joi.date()
    .allow("", null, ""),

bank_name: Joi.string()
    .allow("", null),

branch_name: Joi.string()
    .allow("", null),

transaction_id: Joi.string()
    .allow("", null),

upi_reference: Joi.string()
    .allow("", null),

remarks: Joi.string()
    .allow("", null),

    is_anonymous: Joi.boolean()
        .default(false),

    receipt_required: Joi.boolean()
        .default(true),

    tax_exemption: Joi.boolean()
        .default(true),

    status: Joi.string()
        .valid(
            "PENDING",
            "RECEIVED",
            "CLEARED",
            "CANCELLED",
            "REFUNDED"
        )
        .default("RECEIVED"),

    created_by: Joi.number()
        .integer()
        .default(1),

    updated_by: Joi.number()
        .integer()
        .default(1)

});

/*
|--------------------------------------------------------------------------
| Update Donation Validation
|--------------------------------------------------------------------------
*/

const updateDonationSchema = createDonationSchema.fork(
    [
        "donor_id",
        "donation_type_id",
        "payment_mode_id",
        "donation_date",
        "amount",
        "financial_year"
    ],
    field => field.optional()
);

module.exports = {
    createDonationSchema,
    updateDonationSchema,
};