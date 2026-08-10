const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

const generateCertificateSchema = Joi.object({

    donation_id: Joi.number()
        .integer()
        .required(),

    certificate_type: Joi.string()
        .valid(

            "APPRECIATION",

            "SPONSOR",

            "CSR"

        )
        .required(),

    remarks: Joi.string()
        .allow("")
        .max(500),

});

/*
|--------------------------------------------------------------------------
| Archive Certificate
|--------------------------------------------------------------------------
*/

const archiveCertificateSchema = Joi.object({

    archived_by: Joi.number()
        .integer()
        .required(),

});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {

    generateCertificateSchema,

    archiveCertificateSchema,

};