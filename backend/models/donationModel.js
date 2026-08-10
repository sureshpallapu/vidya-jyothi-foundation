const db = require("../config/db");
const generateDonationCode = require("../utils/donationCodeGenerator");

class DonationModel {


    /*
|--------------------------------------------------------------------------
| Check Master Data
|--------------------------------------------------------------------------
*/

async checkMasterData({
    donorId,
    donationTypeId,
    paymentModeId
}) {

    const [donor] = await db.execute(
        `
        SELECT id
        FROM donors
        WHERE id = ?
        LIMIT 1
        `,
        [donorId]
    );

    if (donor.length === 0) {

        return {
            success: false,
            message: "Donor not found."
        };

    }

    const [type] = await db.execute(
        `
        SELECT id
        FROM donation_types
        WHERE id = ?
        LIMIT 1
        `,
        [donationTypeId]
    );

    if (type.length === 0) {

        return {

            success: false,

            message: "Donation Type not found."

        };

    }

    const [mode] = await db.execute(
        `
        SELECT id
        FROM payment_modes
        WHERE id = ?
        LIMIT 1
        `,
        [paymentModeId]
    );

    if (mode.length === 0) {

        return {

            success: false,

            message: "Payment Mode not found."

        };

    }

    return {

        success: true

    };

}

/*
|--------------------------------------------------------------------------
| Create Donation
|--------------------------------------------------------------------------
*/

async createDonation(donationData) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [result] = await connection.execute(
            `
            INSERT INTO donations
            (
                donor_id,
                donation_type_id,
                payment_mode_id,
                donation_date,
                amount,
                currency,
                financial_year,
                reference_number,
                cheque_number,
                cheque_date,
                bank_name,
                branch_name,
                transaction_id,
                upi_reference,
                remarks,
                is_anonymous,
                receipt_required,
                tax_exemption,
                status,
                is_archived,
                created_by,
                updated_by
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                donationData.donor_id,
                donationData.donation_type_id,
                donationData.payment_mode_id,
                donationData.donation_date,
                donationData.amount,
                donationData.currency || "INR",
                donationData.financial_year,
                donationData.reference_number || null,
                donationData.cheque_number || null,
                donationData.cheque_date || null,
                donationData.bank_name || null,
                donationData.branch_name || null,
                donationData.transaction_id || null,
                donationData.upi_reference || null,
                donationData.remarks || null,
                donationData.is_anonymous || false,
                donationData.receipt_required ?? true,
                donationData.tax_exemption ?? true,
                donationData.status || "RECEIVED",
                false,
                donationData.created_by || 1,
                donationData.updated_by || 1
            ]
        );

        const donationId = result.insertId;

        const donationCode = generateDonationCode(donationId);

        await connection.execute(
            `
            UPDATE donations
            SET donation_code = ?
            WHERE id = ?
            `,
            [
                donationCode,
                donationId
            ]
        );

        await connection.commit();

        return {

            id: donationId,

            donation_code: donationCode

        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}

/*
|--------------------------------------------------------------------------
| Find Donation By Code
|--------------------------------------------------------------------------
*/

async findByCode(donationCode) {

    const [rows] = await db.execute(
        `
        SELECT

            d.*,

            dn.donor_code,
            dn.full_name,

            dt.type_name AS donation_type,

            pm.mode_name AS payment_mode

        FROM donations d

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        INNER JOIN donation_types dt
            ON dt.id = d.donation_type_id

        INNER JOIN payment_modes pm
            ON pm.id = d.payment_mode_id

        WHERE d.donation_code = ?

        LIMIT 1
        `,
        [donationCode]
    );

    return rows[0] || null;

}

/*
|--------------------------------------------------------------------------
| Update Donation
|--------------------------------------------------------------------------
*/

async updateDonation(donationCode, donationData) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [result] = await connection.execute(
            `
            UPDATE donations
            SET

                donor_id=?,
                donation_type_id=?,
                payment_mode_id=?,
                donation_date=?,
                amount=?,
                currency=?,
                financial_year=?,
                reference_number=?,
                cheque_number=?,
                cheque_date=?,
                bank_name=?,
                branch_name=?,
                transaction_id=?,
                upi_reference=?,
                remarks=?,
                is_anonymous=?,
                receipt_required=?,
                tax_exemption=?,
                status=?,
                updated_by=?

            WHERE donation_code=?
            `,
            [

                /*
                | mysql2 throws "Bind parameters must not contain
                | undefined" if any optional field is missing from the
                | request body. Every nullable/optional field below is
                | defaulted the same way createDonation() does it.
                */

                donationData.donor_id,
                donationData.donation_type_id,
                donationData.payment_mode_id,
                donationData.donation_date,
                donationData.amount,
                donationData.currency ?? "INR",
                donationData.financial_year,
                donationData.reference_number ?? null,
                donationData.cheque_number ?? null,
                donationData.cheque_date ?? null,
                donationData.bank_name ?? null,
                donationData.branch_name ?? null,
                donationData.transaction_id ?? null,
                donationData.upi_reference ?? null,
                donationData.remarks ?? null,
                donationData.is_anonymous ?? false,
                donationData.receipt_required ?? true,
                donationData.tax_exemption ?? true,
                donationData.status ?? "RECEIVED",
                donationData.updated_by || 1,
                donationCode

            ]
        );

        await connection.commit();

        return result.affectedRows;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}

/*
|--------------------------------------------------------------------------
| List Donations
|--------------------------------------------------------------------------
*/

async listDonations({

    page = 1,
    limit = 10,

    search = "",

    status,

    donationTypeId,

    paymentModeId,

    financialYear,

    fromDate,

    toDate,

    includeArchived = false

}) {

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    | mysql2's execute() (prepared statements) unreliably handles LIMIT/OFFSET
    | placeholders and throws "ER_WRONG_ARGUMENTS" on some server/driver
    | combinations even when the values are valid integers. Since page/limit
    | are fully sanitized to integers here, it's safe to inline them directly
    | into the SQL string instead of binding them as `?`.
    */

    const safeLimit = Math.min(
        Math.max(parseInt(limit, 10) || 10, 1),
        200
    );

    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    const offset = (safePage - 1) * safeLimit;

    let where = " WHERE 1=1 ";

    const params = [];

    /*
    |--------------------------------------------------------------------------
    | Archived
    |--------------------------------------------------------------------------
    | By default, archived donations are excluded from the list. Pass
    | includeArchived=true (or "true") to include them.
    */

    if (!(includeArchived === true || includeArchived === "true")) {

        where += " AND d.is_archived = FALSE ";

    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {

        where += `
            AND (
                d.donation_code LIKE ?
                OR dn.full_name LIKE ?
                OR dn.mobile LIKE ?
            )
        `;

        const keyword = `%${search}%`;

        params.push(keyword, keyword, keyword);

    }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if (status) {

        where += " AND d.status = ? ";

        params.push(status);

    }

    /*
    |--------------------------------------------------------------------------
    | Donation Type
    |--------------------------------------------------------------------------
    */

    if (donationTypeId) {

        where += " AND d.donation_type_id = ? ";

        params.push(donationTypeId);

    }

    /*
    |--------------------------------------------------------------------------
    | Payment Mode
    |--------------------------------------------------------------------------
    */

    if (paymentModeId) {

        where += " AND d.payment_mode_id = ? ";

        params.push(paymentModeId);

    }

    /*
    |--------------------------------------------------------------------------
    | Financial Year
    |--------------------------------------------------------------------------
    */

    if (financialYear) {

        where += " AND d.financial_year = ? ";

        params.push(financialYear);

    }

    /*
    |--------------------------------------------------------------------------
    | Date Range
    |--------------------------------------------------------------------------
    */

    if (fromDate) {

        where += " AND d.donation_date >= ? ";

        params.push(fromDate);

    }

    if (toDate) {

        where += " AND d.donation_date <= ? ";

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

        FROM donations d

        INNER JOIN donors dn
            ON dn.id = d.donor_id

        ${where}
        `,
        params
    );

    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const [rows] = await db.execute(
        `
      SELECT

    d.id,

    d.donation_code,

    d.donation_date,

    d.amount,

    d.financial_year,

    d.status,

    d.is_archived,

    d.receipt_generated,

    r.receipt_code,

    /* ---------------- Certificate ---------------- */

    dc.id AS certificate_id,

    dc.certificate_code,

    CASE

        WHEN dc.id IS NULL

        THEN FALSE

        ELSE TRUE

    END AS certificate_generated,

    /* ---------------- Donor ---------------- */

    dn.donor_code,

    dn.full_name,

    dn.mobile,

    /* ---------------- Masters ---------------- */

    dt.type_name AS donation_type,

    pm.mode_name AS payment_mode


        FROM donations d

INNER JOIN donors dn
    ON dn.id = d.donor_id

INNER JOIN donation_types dt
    ON dt.id = d.donation_type_id

INNER JOIN payment_modes pm
    ON pm.id = d.payment_mode_id

LEFT JOIN receipts r
    ON r.id = d.receipt_id

LEFT JOIN donation_certificates dc
    ON dc.donation_id = d.id

${where}

        ORDER BY d.created_at DESC

        LIMIT ${safeLimit}

        OFFSET ${offset}
        `,
        params
    );

    return {

        total: count[0].total,

        page: safePage,

        limit: safeLimit,

        totalPages: Math.ceil(count[0].total / safeLimit),

        donations: rows

    };

}

/*
|--------------------------------------------------------------------------
| Cancel Donation
|--------------------------------------------------------------------------
*/

async cancelDonation(donationCode, updatedBy = 1) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `
            SELECT
                id,
                status,
                receipt_generated
            FROM donations
            WHERE donation_code = ?
            LIMIT 1
            `,
            [donationCode]
        );

        if (!rows.length) {

            throw new Error("Donation not found.");

        }

        const donation = rows[0];

        if (donation.status === "CANCELLED") {

            throw new Error("Donation is already cancelled.");

        }

        if (donation.receipt_generated) {

            throw new Error(
                "Receipt already generated. Cancel the receipt before cancelling the donation."
            );

        }

        await connection.execute(
            `
            UPDATE donations
            SET
                status = 'CANCELLED',
                updated_by = ?
            WHERE donation_code = ?
            `,
            [
                updatedBy,
                donationCode
            ]
        );

        await connection.commit();

        return true;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}

/*
|--------------------------------------------------------------------------
| Archive Donation
|--------------------------------------------------------------------------
| Archiving is a soft-hide toggle (is_archived), independent of the
| donation's payment/refund status. It no longer overwrites status.
*/

async archiveDonation(donationCode, updatedBy = 1) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `
            SELECT
                id,
                is_archived
            FROM donations
            WHERE donation_code = ?
            LIMIT 1
            `,
            [donationCode]
        );

        if (!rows.length) {

            throw new Error("Donation not found.");

        }

        if (rows[0].is_archived) {

            throw new Error("Donation is already archived.");

        }

        const [result] = await connection.execute(
            `
            UPDATE donations
            SET
                is_archived = TRUE,
                updated_by = ?
            WHERE donation_code = ?
            `,
            [
                updatedBy,
                donationCode
            ]
        );

        await connection.commit();

        return result.affectedRows;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}
/*
|--------------------------------------------------------------------------
| Get Donation Types
|--------------------------------------------------------------------------
*/

async getDonationTypes() {

    const [rows] = await db.execute(`
        SELECT
            id,
            type_name
        FROM donation_types
        ORDER BY type_name ASC
    `);

    return rows;

}

/*
|--------------------------------------------------------------------------
| Get Payment Modes
|--------------------------------------------------------------------------
*/

async getPaymentModes() {

    const [rows] = await db.execute(`
        SELECT
            id,
            mode_name
        FROM payment_modes
        ORDER BY mode_name ASC
    `);

    return rows;

}
/*
|--------------------------------------------------------------------------
| Restore Donation
|--------------------------------------------------------------------------
*/

async restoreDonation(donationCode, updatedBy = 1) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `
            SELECT
                id,
                is_archived
            FROM donations
            WHERE donation_code = ?
            LIMIT 1
            `,
            [donationCode]
        );

        if (!rows.length) {

            throw new Error("Donation not found.");

        }

        if (!rows[0].is_archived) {

            throw new Error("Donation is not archived.");

        }

        const [result] = await connection.execute(
            `
            UPDATE donations
            SET
                is_archived = FALSE,
                updated_by = ?
            WHERE donation_code = ?
            `,
            [
                updatedBy,
                donationCode
            ]
        );

        await connection.commit();

        return result.affectedRows;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}

/*
|--------------------------------------------------------------------------
| Donor Donation History
|--------------------------------------------------------------------------
*/

async donorHistory(donorId) {

    const [rows] = await db.execute(
        `
        SELECT

            d.donation_code,

            d.donation_date,

            d.amount,

            d.financial_year,

            d.status,

            d.receipt_generated,

            dt.type_name AS donation_type,

            pm.mode_name AS payment_mode

        FROM donations d

        INNER JOIN donation_types dt
            ON dt.id = d.donation_type_id

        INNER JOIN payment_modes pm
            ON pm.id = d.payment_mode_id

        WHERE d.donor_id = ?
        AND d.is_archived = FALSE

        ORDER BY d.donation_date DESC,
                 d.created_at DESC
        `,
        [donorId]
    );

    return rows;

}
/*
|--------------------------------------------------------------------------
| Donation Summary
|--------------------------------------------------------------------------
*/

async donationSummary(donorId) {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) AS totalDonations,

            IFNULL(SUM(amount),0) AS totalAmount,

            MAX(donation_date) AS lastDonationDate,

            MIN(donation_date) AS firstDonationDate

        FROM donations

        WHERE donor_id = ?

        AND status <> 'CANCELLED'

        AND is_archived = FALSE
        `,
        [donorId]
    );

    return rows[0];

}

/*
|--------------------------------------------------------------------------
| Donation Statistics
|--------------------------------------------------------------------------
*/

async getStatistics() {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) AS totalDonations,

            SUM(
                CASE
                    WHEN status='RECEIVED'
                    THEN 1
                    ELSE 0
                END
            ) AS receivedDonations,

            SUM(
                CASE
                    WHEN status='CLEARED'
                    THEN 1
                    ELSE 0
                END
            ) AS clearedDonations,

            SUM(
                CASE
                    WHEN status='CANCELLED'
                    THEN 1
                    ELSE 0
                END
            ) AS cancelledDonations,

            IFNULL(SUM(amount),0) AS totalCollection,

            IFNULL(
                SUM(
                    CASE
                        WHEN status IN ('RECEIVED','CLEARED')
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS activeCollection

        FROM donations

        WHERE is_archived = FALSE
        `
    );

    return rows[0];

}


}

module.exports = new DonationModel();