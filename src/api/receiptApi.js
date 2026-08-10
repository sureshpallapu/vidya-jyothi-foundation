import api from "./axios";

const BASE_URL = "/fundraising/receipts";

/*
|--------------------------------------------------------------------------
| Verify Receipt
|--------------------------------------------------------------------------
*/

export const verifyReceipt = (receiptCode) =>
    api.get(`${BASE_URL}/verify/${receiptCode}`);

/*
|--------------------------------------------------------------------------
| Receipt Statistics
|--------------------------------------------------------------------------
*/

export const getReceiptStatistics = () =>
    api.get(`${BASE_URL}/statistics`);

/*
|--------------------------------------------------------------------------
| Receipt List
|--------------------------------------------------------------------------
*/

export const getReceipts = (params) =>
    api.get(BASE_URL, { params });

/*
|--------------------------------------------------------------------------
| View Receipt
|--------------------------------------------------------------------------
*/

export const getReceipt = (receiptCode) =>
    api.get(`${BASE_URL}/${receiptCode}`);

/*
|--------------------------------------------------------------------------
| Cancel Receipt
|--------------------------------------------------------------------------
*/

export const cancelReceipt = (receiptCode, data) =>
    api.patch(
        `${BASE_URL}/${receiptCode}/cancel`,
        data
    );

/*
|--------------------------------------------------------------------------
| Archive Receipt
|--------------------------------------------------------------------------
*/

export const archiveReceipt = (
    receiptCode,
    archived_by = 1
) =>
    api.patch(
        `${BASE_URL}/${receiptCode}/archive`,
        {
            archived_by,
        }
    );

/*
|--------------------------------------------------------------------------
| Restore Receipt
|--------------------------------------------------------------------------
*/

export const restoreReceipt = (
    receiptCode,
    updated_by = 1
) =>
    api.patch(
        `${BASE_URL}/${receiptCode}/restore`,
        {
            updated_by,
        }
    );

    /*
|--------------------------------------------------------------------------
| Email Receipt
|--------------------------------------------------------------------------
*/

export const emailReceipt = (receiptCode) =>
    api.post(
        `${BASE_URL}/${receiptCode}/email`
    );