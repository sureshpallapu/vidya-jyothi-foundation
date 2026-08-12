const Joi = require("joi");

const createPublicDonationOrderSchema = Joi.object({

    full_name: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required(),

    mobile: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Please enter a valid 10-digit Indian mobile number.",
        }),

    donation_type_id: Joi.number()
        .integer()
        .positive()
        .required(),

    amount: Joi.number()
        .positive()
        .precision(2)
        .min(1)
        .max(500000)
        .required(),

    pan_number: Joi.string()
        .trim()
        .max(20)
        .allow("", null),

    address_line1: Joi.string()
        .trim()
        .max(255)
        .allow("", null),

    address_line2: Joi.string()
        .trim()
        .max(255)
        .allow("", null),

    city: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    district: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    state: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    pincode: Joi.string()
        .trim()
        .pattern(/^\d{6}$/)
        .allow("", null)
        .messages({
            "string.pattern.base":
                "Please enter a valid 6-digit pincode.",
        }),

}).options({
    abortEarly: false,
    stripUnknown: true,
});

module.exports = {
    createPublicDonationOrderSchema,
};