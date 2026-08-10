const CertificateModel = require("../models/certificateModel");
const ApiResponse = require("../utils/ApiResponse");

// const {
//     sendCertificateEmail,
// } = require("../utils/emailService");


const {
    generateCertificatePDF,
} = require("../utils/certificatePdfGenerator");


const {
    sendCertificateEmail,
} = require("../utils/emailService");

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

async function generateCertificate(req, res) {

    try {

        const certificate =
            await CertificateModel.generateCertificate(
                req.body
            );

        return ApiResponse.created(
            res,
            "Certificate generated successfully.",
            certificate
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
| Get Certificate
|--------------------------------------------------------------------------
*/

async function getCertificate(req, res) {

    try {

        const certificate =
            await CertificateModel.findByCode(
                req.params.certificateCode
            );

        if (!certificate) {

            return ApiResponse.notFound(
                res,
                "Certificate not found."
            );

        }

        return ApiResponse.success(
            res,
            "Certificate fetched successfully.",
            certificate
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
| List Certificates
|--------------------------------------------------------------------------
*/

async function listCertificates(req, res) {

    try {

        const certificates =
            await CertificateModel.listCertificates();

        return ApiResponse.success(
            res,
            "Certificates fetched successfully.",
            certificates
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
| Archive Certificate
|--------------------------------------------------------------------------
*/

async function archiveCertificate(req, res) {

    try {

        const success =
            await CertificateModel.archiveCertificate(

                req.params.certificateCode,

                req.body.archived_by || 1

            );

        if (!success) {

            return ApiResponse.notFound(
                res,
                "Certificate not found."
            );

        }

        return ApiResponse.success(
            res,
            "Certificate archived successfully."
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
| Verify Certificate
|--------------------------------------------------------------------------
*/

async function verifyCertificate(req, res) {

    try {

        const certificate =
            await CertificateModel.verifyCertificate(
                req.params.certificateCode
            );

        if (!certificate) {

            return ApiResponse.notFound(
                res,
                "Certificate not found."
            );

        }

        return ApiResponse.success(
            res,
            "Certificate verified successfully.",
            certificate
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
| Email Certificate
|--------------------------------------------------------------------------
*/

async function emailCertificate(req, res) {

    try {

        const certificate =
            await CertificateModel.findByCode(
                req.params.certificateCode
            );

        if (!certificate) {

            return ApiResponse.notFound(
                res,
                "Certificate not found."
            );

        }

        if (!certificate.email) {

            return ApiResponse.validationError(
                res,
                [
                    "Donor email address not available.",
                ]
            );

        }

      const result =
    await sendCertificateEmail(
        certificate
    );

        if (!result.success) {

            return ApiResponse.error(
                res,
                result.error
            );

        }

        return ApiResponse.success(
            res,
            "Certificate emailed successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

  
async function downloadCertificate(req, res) {

    try {

        const certificate =
            await CertificateModel.findById(
                req.params.id
            );

        if (!certificate) {

            return ApiResponse.notFound(
                res,
                "Certificate not found."
            );

        }

        const pdf =
            await generateCertificatePDF(
                certificate
            );

        return res.download(

            pdf.filePath,

            pdf.fileName

        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}


module.exports = {

    generateCertificate,

    getCertificate,

    listCertificates,

    archiveCertificate,

    verifyCertificate,

    emailCertificate,
    
    downloadCertificate,

};