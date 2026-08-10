const express = require("express");

const router = express.Router();

const certificateController = require(
    "../controllers/certificateController"
);

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    certificateController.generateCertificate
);

/*
|--------------------------------------------------------------------------
| List Certificates
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    certificateController.listCertificates
);

/*
|--------------------------------------------------------------------------
| Verify Certificate (Public)
|--------------------------------------------------------------------------
*/

router.get(
    "/verify/:certificateCode",
    certificateController.verifyCertificate
);

/*
|--------------------------------------------------------------------------
| Get Certificate
|--------------------------------------------------------------------------
*/

router.get(
    "/:certificateCode",
    certificateController.getCertificate
);

/*
|--------------------------------------------------------------------------
| Archive Certificate
|--------------------------------------------------------------------------
*/

router.patch(
    "/:certificateCode/archive",
    certificateController.archiveCertificate
);

/*
|--------------------------------------------------------------------------
| Email Certificate
|--------------------------------------------------------------------------
*/

router.post(
    "/:certificateCode/email",
    certificateController.emailCertificate
);


router.get(
    "/:id/download",
    certificateController.downloadCertificate
);

module.exports = router;