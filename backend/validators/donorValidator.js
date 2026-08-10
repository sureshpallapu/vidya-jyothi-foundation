const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Create Donor Validation
|--------------------------------------------------------------------------
*/

const createDonorSchema = Joi.object({

    donor_type_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Donor type is required.",
            "number.base": "Invalid donor type."
        }),

    full_name: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            "any.required": "Full name is required."
        }),

    display_name: Joi.string()
        .trim()
        .allow("", null),

    mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid mobile number.",
            "any.required": "Mobile number is required."
        }),

    alternate_mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .allow("", null)
        .messages({
            "string.pattern.base": "Invalid alternate mobile number."
        }),

    email: Joi.string()
        .email()
        .allow("", null),

    website: Joi.string()
        .uri()
        .allow("", null),

    pan_number: Joi.string()
        .uppercase()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .allow("", null)
        .messages({
            "string.pattern.base": "Invalid PAN Number."
        }),

    aadhaar_number: Joi.string()
        .pattern(/^\d{12}$/)
        .allow("", null)
        .messages({
            "string.pattern.base": "Invalid Aadhaar Number."
        }),

    gst_number: Joi.string()
        .allow("", null),

    registration_number: Joi.string()
        .allow("", null),

    address_line1: Joi.string()
        .allow("", null),

    address_line2: Joi.string()
        .allow("", null),

    city: Joi.string()
        .allow("", null),

    district: Joi.string()
        .allow("", null),

    state: Joi.string()
        .allow("", null),

    country: Joi.string()
        .allow("", null),

    pincode: Joi.string()
        .pattern(/^\d{6}$/)
        .allow("", null)
        .messages({
            "string.pattern.base": "Invalid pincode."
        }),

    preferred_communication: Joi.string()
        .valid(
            "EMAIL",
            "SMS",
            "WHATSAPP",
            "PHONE"
        )
        .default("PHONE"),

    remarks: Joi.string()
        .allow("", null),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .default("ACTIVE")

});

/*
|--------------------------------------------------------------------------
| Update Donor Validation
|--------------------------------------------------------------------------
*/

const updateDonorSchema = createDonorSchema.fork(
    ["donor_type_id", "full_name", "mobile"],
    (field) => field.optional()
);

module.exports = {
    createDonorSchema,
    updateDonorSchema,
};