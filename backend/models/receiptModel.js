    const db = require("../config/db");

class ReceiptModel {

    /*
    |--------------------------------------------------------------------------
    | Generate Receipt
    |--------------------------------------------------------------------------
    */

    static async generateReceipt(receiptData) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            /*
            |--------------------------------------------------------------------------
            | Get Donation Details
            |--------------------------------------------------------------------------
            */

            const [donations] = await connection.execute(
                `
                SELECT
                    id,
                    donation_code,
                    amount,
                    financial_year,
                    tax_exemption,
                    status,
                    is_archived,
                    receipt_generated
                FROM donations
                WHERE id = ?
                `,
                [receiptData.donation_id]
            );

            if (!donations.length) {

                throw new Error("Donation not found.");

            }

            const donation = donations[0];

            /*
            |--------------------------------------------------------------------------
            | Business Validations
            |--------------------------------------------------------------------------
            */

            if (donation.is_archived) {

                throw new Error("Cannot generate receipt for an archived donation.");

            }

            if (donation.status === "CANCELLED") {

                throw new Error("Cannot generate receipt for a cancelled donation.");

            }

            if (donation.status === "REFUNDED") {

                throw new Error("Cannot generate receipt for a refunded donation.");

            }

            if (donation.receipt_generated) {

                throw new Error("Receipt already generated for this donation.");

            }

            /*
            |--------------------------------------------------------------------------
            | Generate Receipt Number
            |--------------------------------------------------------------------------
            */

            const [[lastReceipt]] = await connection.execute(
                `
                SELECT MAX(id) AS lastId
                FROM receipts
                `
            );

            const nextId = (lastReceipt.lastId || 0) + 1;

            const year = new Date().getFullYear();

            const receiptCode =
                `RCT-${year}-${String(nextId).padStart(6, "0")}`;

            /*
            |--------------------------------------------------------------------------
            | Insert Receipt
            |--------------------------------------------------------------------------
            */

            const [receiptResult] = await connection.execute(
                `
                INSERT INTO receipts (

                    receipt_code,
                    donation_id,
                    receipt_date,
                    financial_year,
                    amount,
                    tax_exemption,
                    generated_by,
                    created_by,
                    updated_by

                )

                VALUES (?,?,?,?,?,?,?,?,?)
                `,
                [

                    receiptCode,

                    donation.id,

                    receiptData.receipt_date,

                    donation.financial_year,

                    donation.amount,

                    donation.tax_exemption,

                    receiptData.created_by,

                    receiptData.created_by,

                    receiptData.updated_by

                ]
            );

            /*
            |--------------------------------------------------------------------------
            | Update Donation
            |--------------------------------------------------------------------------
            */

            await connection.execute(
                `
                UPDATE donations

                SET

                    receipt_generated = TRUE,

                    receipt_generated_at = NOW(),

                    receipt_id = ?,

                    updated_by = ?

                WHERE id = ?
                `,
                [

                    receiptResult.insertId,

                    receiptData.updated_by,

                    donation.id

                ]
            );

            await connection.commit();

            /*
            |--------------------------------------------------------------------------
            | Return
            |--------------------------------------------------------------------------
            */

            return {

                receipt_id: receiptResult.insertId,

                receipt_code: receiptCode,

                donation_id: donation.id,

                donation_code: donation.donation_code,

                receipt_date: receiptData.receipt_date,

                amount: donation.amount,

                financial_year: donation.financial_year,

                tax_exemption: donation.tax_exemption

            };

        }

        catch (error) {

            await connection.rollback();

            throw error;

        }

        finally {

            connection.release();

        }

    }
    /*
|--------------------------------------------------------------------------
| Find Receipt By Code
|--------------------------------------------------------------------------
*/

static async findByCode(receiptCode) {

    const [rows] = await db.execute(
        `
        SELECT

            -- Receipt Information
            r.id,
            r.receipt_code,
            r.receipt_date,
            r.receipt_type,
            r.financial_year,
            r.amount,
            r.tax_exemption,
            r.receipt_status,
            r.cancelled_reason,
            r.cancelled_at,
            r.archived_at,
            r.is_archived,
            r.created_at,
            r.updated_at,

            -- Donation Information
            d.donation_code,
            d.donation_date,
            d.reference_number,
            d.cheque_number,
            d.cheque_date,
            d.bank_name,
            d.branch_name,
            d.transaction_id,
            d.upi_reference,
            d.remarks,
            d.status AS donation_status,

            -- Donor Information
            dn.donor_code,
            dn.full_name AS donor_name,
            dn.display_name,
            dn.mobile AS mobile_number,
            dn.alternate_mobile,
            dn.email,
            dn.pan_number,
            dn.aadhaar_number,

            CONCAT(
                IFNULL(dn.address_line1, ''),
                ' ',
                IFNULL(dn.address_line2, ''),
                ' ',
                IFNULL(dn.city, ''),
                ' ',
                IFNULL(dn.district, ''),
                ' ',
                IFNULL(dn.state, ''),
                ' ',
                IFNULL(dn.country, ''),
                ' - ',
                IFNULL(dn.pincode, '')
            ) AS address,

            -- Donation Type
            dt.type_name AS donation_purpose,
            dt.type_name AS donor_type,

            -- Payment
            pm.mode_name AS payment_mode,

            -- Audit Information
            cb.full_name AS created_by_name,
            ub.full_name AS updated_by_name,
            gb.full_name AS generated_by_name,
            xb.full_name AS cancelled_by_name,
            ab.full_name AS archived_by_name

        FROM receipts r

        INNER JOIN donations d
            ON d.id = r.donation_id

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        INNER JOIN donation_types dt
            ON dt.id = d.donation_type_id

        INNER JOIN payment_modes pm
            ON pm.id = d.payment_mode_id

        LEFT JOIN admins cb
            ON cb.id = r.created_by

        LEFT JOIN admins ub
            ON ub.id = r.updated_by

        LEFT JOIN admins gb
            ON gb.id = r.generated_by

        LEFT JOIN admins xb
            ON xb.id = r.cancelled_by

        LEFT JOIN admins ab
            ON ab.id = r.archived_by

        WHERE r.receipt_code = ?

        LIMIT 1
        `,
        [receiptCode]
    );

    if (!rows.length) {
        return null;
    }

    return rows[0];
}

/*
|--------------------------------------------------------------------------
| List Receipts
|--------------------------------------------------------------------------
*/

static async listReceipts({

    page = 1,
    limit = 10,

    search = "",

    receiptStatus,

    receiptType,

    financialYear,

    fromDate,

    toDate,

    includeArchived = false

}) {

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const safeLimit = Math.min(
        Math.max(parseInt(limit, 10) || 10, 1),
        200
    );

    const safePage = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const offset = (safePage - 1) * safeLimit;

    /*
    |--------------------------------------------------------------------------
    | Dynamic WHERE
    |--------------------------------------------------------------------------
    */

    let where = " WHERE 1=1 ";

    const params = [];

    /*
    |--------------------------------------------------------------------------
    | Archived
    |--------------------------------------------------------------------------
    */

    if (!(includeArchived === true || includeArchived === "true")) {

        where += " AND r.is_archived = FALSE ";

    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

        where += `
            AND (

                r.receipt_code LIKE ?

                OR d.donation_code LIKE ?

                OR dn.full_name LIKE ?

                OR dn.mobile LIKE ?

            )
        `;

        const keyword = `%${search}%`;

        params.push(

            keyword,

            keyword,

            keyword,

            keyword

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Receipt Status
    |--------------------------------------------------------------------------
    */

    if (receiptStatus) {

        where += " AND r.receipt_status = ? ";

        params.push(receiptStatus);

    }

    /*
    |--------------------------------------------------------------------------
    | Receipt Type
    |--------------------------------------------------------------------------
    */

    if (receiptType) {

        where += " AND r.receipt_type = ? ";

        params.push(receiptType);

    }

    /*
    |--------------------------------------------------------------------------
    | Financial Year
    |--------------------------------------------------------------------------
    */

    if (financialYear) {

        where += " AND r.financial_year = ? ";

        params.push(financialYear);

    }

    /*
    |--------------------------------------------------------------------------
    | Date Range
    |--------------------------------------------------------------------------
    */

    if (fromDate) {

        where += " AND r.receipt_date >= ? ";

        params.push(fromDate);

    }

    if (toDate) {

        where += " AND r.receipt_date <= ? ";

        params.push(toDate);

    }

    /*
    |--------------------------------------------------------------------------
    | Total Records
    |--------------------------------------------------------------------------
    */

    const [count] = await db.execute(
        `
        SELECT COUNT(*) AS total

        FROM receipts r

        INNER JOIN donations d
            ON d.id = r.donation_id

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        ${where}
        `,
        params
    );

    /*
    |--------------------------------------------------------------------------
    | Receipt List
    |--------------------------------------------------------------------------
    */

    const [rows] = await db.execute(
        `
        SELECT

            r.id,

            r.receipt_code,

            r.receipt_date,

            r.receipt_type,

            r.amount,

            r.receipt_status,

            r.is_archived,

            d.donation_code,

            dn.donor_code,

            dn.full_name,

            dn.mobile

        FROM receipts r

        INNER JOIN donations d
            ON d.id = r.donation_id

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        ${where}

        ORDER BY r.created_at DESC

        LIMIT ${safeLimit}

        OFFSET ${offset}
        `,
        params
    );

    return {

        total: count[0].total,

        page: safePage,

        limit: safeLimit,

        totalPages: Math.ceil(
            count[0].total / safeLimit
        ),

        receipts: rows

    };

}


/*
|--------------------------------------------------------------------------
| Cancel Receipt
|--------------------------------------------------------------------------
*/

static async cancelReceipt(receiptCode, receiptData) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        /*
        |--------------------------------------------------------------------------
        | Check Receipt
        |--------------------------------------------------------------------------
        */

        const [rows] = await connection.execute(
            `
            SELECT

                id,
                donation_id,
                receipt_status,
                is_archived

            FROM receipts

            WHERE receipt_code = ?

            LIMIT 1
            `,
            [receiptCode]
        );

        if (!rows.length) {

            throw new Error("Receipt not found.");

        }

        const receipt = rows[0];

        /*
        |--------------------------------------------------------------------------
        | Business Validation
        |--------------------------------------------------------------------------
        */

        if (receipt.is_archived) {

            throw new Error("Archived receipt cannot be cancelled.");

        }

        if (receipt.receipt_status === "CANCELLED") {

            throw new Error("Receipt is already cancelled.");

        }

        /*
        |--------------------------------------------------------------------------
        | Cancel Receipt
        |--------------------------------------------------------------------------
        */

        await connection.execute(
            `
            UPDATE receipts

            SET

                receipt_status = 'CANCELLED',

                cancelled_reason = ?,

                cancelled_at = NOW(),

                cancelled_by = ?,

                updated_by = ?

            WHERE id = ?
            `,
            [

                receiptData.cancelled_reason,

                receiptData.cancelled_by,

                receiptData.updated_by,

                receipt.id

            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Update Donation
        |--------------------------------------------------------------------------
        */

        await connection.execute(
            `
            UPDATE donations

            SET

                receipt_generated = FALSE,

                receipt_generated_at = NULL,

                receipt_id = NULL,

                updated_by = ?

            WHERE id = ?
            `,
            [

                receiptData.updated_by,

                receipt.donation_id

            ]
        );

        await connection.commit();

        return {

            receipt_code: receiptCode,

            status: "CANCELLED"

        };

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

}

/*
|--------------------------------------------------------------------------
| Archive Receipt
|--------------------------------------------------------------------------
*/

static async archiveReceipt(receiptCode, archivedBy) {

    const [result] = await db.execute(
        `
        UPDATE receipts
        SET
            is_archived = 1,
            archived_by = ?,
            archived_at = NOW(),
            updated_by = ?,
            updated_at = NOW()
        WHERE receipt_code = ?
        `,
        [archivedBy, archivedBy, receiptCode]
    );

    return result.affectedRows > 0;
}


/*
|--------------------------------------------------------------------------
| Verify Receipt
|--------------------------------------------------------------------------
*/

static async verifyReceipt(receiptCode) {

    const [rows] = await db.execute(
        `
        SELECT

            r.receipt_code,
            r.receipt_date,
            r.receipt_type,
            r.receipt_status,

            d.donation_code,
            d.amount,
            d.transaction_id,
            d.reference_number,
            d.tax_exemption,

            dn.full_name,
            dn.mobile,
            dn.email,

            CONCAT_WS(', ',
                dn.address_line1,
                dn.address_line2,
                dn.city,
                dn.district,
                dn.state,
                dn.pincode
            ) AS address,

            dt.type_name AS donation_type,

            pm.mode_name AS payment_mode

        FROM receipts r

        INNER JOIN donations d
            ON d.id = r.donation_id

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        INNER JOIN donation_types dt
            ON dt.id = d.donation_type_id

        INNER JOIN payment_modes pm
            ON pm.id = d.payment_mode_id

        WHERE r.receipt_code = ?
          AND r.receipt_status <> 'CANCELLED'

        LIMIT 1
        `,
        [receiptCode]
    );

    return rows.length ? rows[0] : null;

}
/*
|--------------------------------------------------------------------------
| Restore Receipt
|--------------------------------------------------------------------------
*/

static async restoreReceipt(receiptCode, updatedBy) {

    const [result] = await db.execute(
        `
        UPDATE receipts
        SET
            is_archived = 0,
            archived_by = NULL,
            archived_at = NULL,
            updated_by = ?,
            updated_at = NOW()
        WHERE receipt_code = ?
        `,
        [updatedBy, receiptCode]
    );

    return result.affectedRows > 0;
}

/*
|--------------------------------------------------------------------------
| Receipt Statistics
|--------------------------------------------------------------------------
*/

static async statistics() {

    const [[stats]] = await db.execute(
        `
        SELECT

            COUNT(*) AS total_receipts,

            SUM(
                CASE
                    WHEN receipt_status = 'GENERATED'
                    THEN 1
                    ELSE 0
                END
            ) AS generated_receipts,

            SUM(
                CASE
                    WHEN receipt_status = 'CANCELLED'
                    THEN 1
                    ELSE 0
                END
            ) AS cancelled_receipts,

            SUM(
                CASE
                    WHEN is_archived = TRUE
                    THEN 1
                    ELSE 0
                END
            ) AS archived_receipts,

            SUM(
                CASE
                    WHEN receipt_date = CURDATE()
                    THEN 1
                    ELSE 0
                END
            ) AS today_receipts,

            SUM(
                CASE
                    WHEN YEAR(receipt_date) = YEAR(CURDATE())
                     AND MONTH(receipt_date) = MONTH(CURDATE())
                    THEN 1
                    ELSE 0
                END
            ) AS current_month_receipts,

            IFNULL(
                SUM(
                    CASE
                        WHEN receipt_status = 'GENERATED'
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS total_receipt_amount

        FROM receipts
        `
    );

    return {

        totalReceipts: Number(stats.total_receipts),

        generatedReceipts: Number(stats.generated_receipts),

        cancelledReceipts: Number(stats.cancelled_receipts),

        archivedReceipts: Number(stats.archived_receipts),

        todayReceipts: Number(stats.today_receipts),

        currentMonthReceipts: Number(stats.current_month_receipts),

        totalReceiptAmount: Number(stats.total_receipt_amount)

    };

}




/*
|--------------------------------------------------------------------------
| Get Receipt Details For Email
|--------------------------------------------------------------------------
*/

static async getReceiptForEmail(receiptCode) {

    const [rows] = await db.execute(
        `
        SELECT

            r.receipt_code,
            r.receipt_date,
            r.receipt_type,
            r.receipt_status,

            d.donation_code,
            d.amount,
            d.reference_number,
            d.transaction_id,

            dt.type_name AS donation_type,

            pm.mode_name AS payment_mode,

            dn.full_name AS donor_name,
            dn.email,
            dn.mobile,

            CONCAT_WS(
                ', ',
                dn.address_line1,
                dn.address_line2,
                dn.city,
                dn.district,
                dn.state,
                dn.pincode
            ) AS address

        FROM receipts r

        INNER JOIN donations d
            ON d.id = r.donation_id

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        LEFT JOIN donation_types dt
            ON dt.id = d.donation_type_id

        LEFT JOIN payment_modes pm
            ON pm.id = d.payment_mode_id

        WHERE r.receipt_code = ?

        LIMIT 1
        `,
        [receiptCode]
    );

    return rows.length ? rows[0] : null;

}


}




module.exports = ReceiptModel;
