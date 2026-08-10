const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receiptController");

/*
|--------------------------------------------------------------------------
| Receipt Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Generate Receipt
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    receiptController.generateReceipt
);

/*
|--------------------------------------------------------------------------
| Receipt Statistics
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    receiptController.statistics
);

/*
|--------------------------------------------------------------------------
| Verify Receipt (Public QR Verification)
|--------------------------------------------------------------------------
*/

router.get(
    "/verify/:receiptCode",
    receiptController.verifyReceipt
);

/*
|--------------------------------------------------------------------------
| List Receipts
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    receiptController.listReceipts
);

/*
|--------------------------------------------------------------------------
| Get Receipt Details
|--------------------------------------------------------------------------
*/

router.get(
    "/:receiptCode",
    receiptController.getReceipt
);

/*
|--------------------------------------------------------------------------
| Cancel Receipt
|--------------------------------------------------------------------------
*/

router.patch(
    "/:receiptCode/cancel",
    receiptController.cancelReceipt
);

/*
|--------------------------------------------------------------------------
| Archive Receipt
|--------------------------------------------------------------------------
*/

router.patch(
    "/:receiptCode/archive",
    receiptController.archiveReceipt
);

/*
|--------------------------------------------------------------------------
| Restore Receipt
|--------------------------------------------------------------------------
*/

router.patch(
    "/:receiptCode/restore",
    receiptController.restoreReceipt
);

/*
|--------------------------------------------------------------------------
| Send Receipt Email
|--------------------------------------------------------------------------
*/

router.post(
    "/:receiptCode/email",
    receiptController.emailReceipt
);


module.exports = router;