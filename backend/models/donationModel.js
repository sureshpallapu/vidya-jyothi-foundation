const db = require("../config/db");
const generateDonationCode = require("../utils/donationCodeGenerator");

class DonationModel {

    /*
    |--------------------------------------------------------------------------
    | Check Master Data
    |--------------------------------------------------------------------------
    */

    async checkMasterData({ donorId, donationTypeId, paymentModeId }) {

        const [donor] = await db.execute(
            `SELECT id FROM donors WHERE id = ? LIMIT 1`,
            [donorId]
        );

        if (donor.length === 0) {
            return { success: false, message: "Donor not found." };
        }

        const [type] = await db.execute(
            `SELECT id FROM donation_types WHERE id = ? LIMIT 1`,
            [donationTypeId]
        );

        if (type.length === 0) {
            return { success: false, message: "Donation Type not found." };
        }

        const [mode] = await db.execute(
            `SELECT id FROM payment_modes WHERE id = ? LIMIT 1`,
            [paymentModeId]
        );

        if (mode.length === 0) {
            return { success: false, message: "Payment Mode not found." };
        }

        return { success: true };
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
                `UPDATE donations SET donation_code = ? WHERE id = ?`,
                [donationCode, donationId]
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

            /*
            | mysql2 throws "Bind parameters must not contain undefined"
            | if any optional field is missing, so every optional field is
            | defaulted the same way createDonation() does it.
            */

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
    | page/limit are sanitized to integers and inlined into the SQL, because
    | mysql2's execute() can throw ER_WRONG_ARGUMENTS for LIMIT/OFFSET
    | placeholders on some server/driver combinations.
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

        const safeLimit = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            200
        );

        const safePage = Math.max(parseInt(page, 10) || 1, 1);

        const offset = (safePage - 1) * safeLimit;

        let where = " WHERE 1=1 ";

        const params = [];

        // Archived donations are excluded unless includeArchived=true
        if (!(includeArchived === true || includeArchived === "true")) {
            where += " AND d.is_archived = FALSE ";
        }

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

        if (status) {
            where += " AND d.status = ? ";
            params.push(status);
        }

        if (donationTypeId) {
            where += " AND d.donation_type_id = ? ";
            params.push(donationTypeId);
        }

        if (paymentModeId) {
            where += " AND d.payment_mode_id = ? ";
            params.push(paymentModeId);
        }

        if (financialYear) {
            where += " AND d.financial_year = ? ";
            params.push(financialYear);
        }

        if (fromDate) {
            where += " AND d.donation_date >= ? ";
            params.push(fromDate);
        }

        if (toDate) {
            where += " AND d.donation_date <= ? ";
            params.push(toDate);
        }

        // Total records
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

        // Data
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
                    WHEN dc.id IS NULL THEN FALSE
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
                [updatedBy, donationCode]
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
    | donation's payment/refund status. It does not overwrite status.
    |--------------------------------------------------------------------------
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
                [updatedBy, donationCode]
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
                [updatedBy, donationCode]
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
                IFNULL(SUM(amount), 0) AS totalAmount,
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

                SUM(CASE WHEN status = 'RECEIVED'  THEN 1 ELSE 0 END) AS receivedDonations,
                SUM(CASE WHEN status = 'CLEARED'   THEN 1 ELSE 0 END) AS clearedDonations,
                SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelledDonations,

                IFNULL(SUM(amount), 0) AS totalCollection,

                IFNULL(
                    SUM(
                        CASE
                            WHEN status IN ('RECEIVED', 'CLEARED')
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

    /*
    |--------------------------------------------------------------------------
    | Find Donation By ID
    |--------------------------------------------------------------------------
    */

    async findById(donationId) {

        if (!donationId) {
            return null;
        }

        const [rows] = await db.execute(
            `
            SELECT
                d.*,

                dn.donor_code,
                dn.full_name,
                dn.email,
                dn.mobile,

                dt.type_name AS donation_type,
                pm.mode_name AS payment_mode

            FROM donations d

            INNER JOIN donors dn
                ON dn.id = d.donor_id

            INNER JOIN donation_types dt
                ON dt.id = d.donation_type_id

            INNER JOIN payment_modes pm
                ON pm.id = d.payment_mode_id

            WHERE d.id = ?

            LIMIT 1
            `,
            [donationId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | Find Donation By Razorpay Payment ID
    |--------------------------------------------------------------------------
    | Used for duplicate protection.
    | transaction_id stores the Razorpay payment ID.
    |--------------------------------------------------------------------------
    */

    async findByRazorpayPaymentId(paymentId) {

        if (!paymentId) {
            return null;
        }

        const [rows] = await db.execute(
            `
            SELECT
                id,
                donation_code,
                donor_id,
                amount,
                currency,
                status,
                reference_number,
                transaction_id,
                receipt_generated,
                receipt_id
            FROM donations
            WHERE transaction_id = ?
            LIMIT 1
            `,
            [paymentId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Razorpay Payment ID
    |--------------------------------------------------------------------------
    | Used by webhook reconciliation after payment.captured.
    | Only fills transaction_id when it is still empty.
    |--------------------------------------------------------------------------
    */

    async updateRazorpayPaymentId(donationId, paymentId) {

        if (!donationId || !paymentId) {
            throw new Error(
                "Donation ID and Razorpay payment ID are required."
            );
        }

        const [result] = await db.execute(
            `
            UPDATE donations
            SET
                transaction_id = ?,
                updated_by = 1
            WHERE id = ?
              AND (
                  transaction_id IS NULL
                  OR transaction_id = ''
              )
            `,
            [paymentId, donationId]
        );

        return result.affectedRows;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Donation After Razorpay Payment
    |--------------------------------------------------------------------------
    | Used when Razorpay webhook confirms payment.captured.
    |--------------------------------------------------------------------------
    */

    async updateRazorpayPaymentSuccess(
        donationId,
        paymentId,
        status = "RECEIVED"
    ) {

        if (!donationId || !paymentId) {
            throw new Error(
                "Donation ID and Razorpay payment ID are required."
            );
        }

        const [result] = await db.execute(
            `
            UPDATE donations
            SET
                transaction_id = ?,
                status = ?,
                updated_by = 1
            WHERE id = ?
            `,
            [paymentId, status, donationId]
        );

        return result.affectedRows;
    }

    /*
    |--------------------------------------------------------------------------
    | Find Donation By Razorpay Order ID
    |--------------------------------------------------------------------------
    | Used by Razorpay webhook reconciliation.
    | reference_number stores the Razorpay order ID for online donations.
    |--------------------------------------------------------------------------
    */

    async findByRazorpayOrderId(orderId) {

        if (!orderId) {
            return null;
        }

        const [rows] = await db.execute(
            `
            SELECT
                d.*,
                dn.donor_code,
                dn.full_name,
                dn.email,
                dn.mobile,
                dt.type_name AS donation_type,
                pm.mode_name AS payment_mode

            FROM donations d

            INNER JOIN donors dn
                ON dn.id = d.donor_id

            INNER JOIN donation_types dt
                ON dt.id = d.donation_type_id

            INNER JOIN payment_modes pm
                ON pm.id = d.payment_mode_id

            WHERE d.reference_number = ?

            LIMIT 1
            `,
            [orderId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | Find Donation By Transaction ID
    |--------------------------------------------------------------------------
    */

    async findByTransactionId(transactionId) {

        if (!transactionId) {
            return null;
        }

        const [rows] = await db.execute(
            `
            SELECT
                id,
                donation_code,
                donor_id,
                amount,
                currency,
                status,
                transaction_id
            FROM donations
            WHERE transaction_id = ?
            LIMIT 1
            `,
            [transactionId]
        );

        return rows[0] || null;
    }

    /*
    |--------------------------------------------------------------------------
    | Public Donor Leaderboard
    |--------------------------------------------------------------------------
    | Read-only statistics for the public Donors page.
    |
    | Rules:
    | - Only RECEIVED / CLEARED donations count.
    | - Archived donations are excluded.
    | - Top donor is based on TOTAL contribution in that year.
    | - Anonymous donors are displayed as "Anonymous Donor".
    | - No private donor information is exposed.
    | - If two donors tie for the top spot in a year, only one is returned
    |   (the lowest donor_id), so each year appears exactly once.
    |--------------------------------------------------------------------------
    */

    async getPublicDonorLeaderboard() {

        const [rows] = await db.execute(`
            SELECT
                yearly.year,
                yearly.totalDonors,
                yearly.totalAmount,
                top_donor.topDonorName,
                top_donor.topDonorAmount

            FROM
            (
                SELECT
                    YEAR(d.donation_date) AS year,
                    COUNT(DISTINCT d.donor_id) AS totalDonors,
                    IFNULL(SUM(d.amount), 0) AS totalAmount

                FROM donations d

                WHERE d.status IN ('RECEIVED', 'CLEARED')
                  AND d.is_archived = FALSE

                GROUP BY YEAR(d.donation_date)

            ) AS yearly

            LEFT JOIN
            (
                SELECT
                    donor_year.year,

                    CASE
                        WHEN donor_year.is_anonymous = TRUE
                        THEN 'Anonymous Donor'
                        ELSE COALESCE(
                            donor_year.display_name,
                            donor_year.full_name
                        )
                    END AS topDonorName,

                    donor_year.totalAmount AS topDonorAmount,

                    donor_year.donor_id

                FROM
                (
                    SELECT
                        YEAR(d.donation_date) AS year,
                        d.donor_id,
                        MAX(d.is_anonymous) AS is_anonymous,
                        dn.display_name,
                        dn.full_name,
                        SUM(d.amount) AS totalAmount

                    FROM donations d

                    INNER JOIN donors dn
                        ON dn.id = d.donor_id

                    WHERE d.status IN ('RECEIVED', 'CLEARED')
                      AND d.is_archived = FALSE

                    GROUP BY
                        YEAR(d.donation_date),
                        d.donor_id,
                        dn.display_name,
                        dn.full_name

                ) AS donor_year

                WHERE donor_year.totalAmount = (
                    SELECT
                        MAX(inner_totals.totalAmount)

                    FROM
                    (
                        SELECT
                            YEAR(d2.donation_date) AS year,
                            d2.donor_id,
                            SUM(d2.amount) AS totalAmount

                        FROM donations d2

                        WHERE d2.status IN ('RECEIVED', 'CLEARED')
                          AND d2.is_archived = FALSE

                        GROUP BY
                            YEAR(d2.donation_date),
                            d2.donor_id

                    ) AS inner_totals

                    WHERE inner_totals.year = donor_year.year
                )

            ) AS top_donor

                ON top_donor.year = yearly.year

            ORDER BY yearly.year DESC,
                     top_donor.donor_id ASC
        `);

        // Keep a single row per year (handles ties for top donor)
        const seenYears = new Set();

        return rows
            .filter((row) => {
                if (seenYears.has(row.year)) {
                    return false;
                }
                seenYears.add(row.year);
                return true;
            })
            .map(({ donor_id, ...rest }) => rest);
    }

    /*
    |--------------------------------------------------------------------------
    | Public Top Donors
    |--------------------------------------------------------------------------
    | Returns Top 5 donors for every year based on total annual contribution.
    |
    | Rules:
    | - Only RECEIVED / CLEARED donations count.
    | - Archived donations are excluded.
    | - Ranking is based on total contribution for that donor in that year.
    | - Anonymous donors are displayed as "Anonymous Donor".
    | - No private donor information is exposed.
    |
    | Note: uses ROW_NUMBER() window function, which requires MySQL 8.0+.
    |--------------------------------------------------------------------------
    */

    async getPublicDonorList() {

        const [rows] = await db.execute(`
            SELECT
                ranked.year,
                ranked.name,
                ranked.amount,
                ranked.donationCount,
                ranked.latestDonationDate

            FROM
            (
                SELECT
                    YEAR(d.donation_date) AS year,

                    CASE
                        WHEN MAX(d.is_anonymous) = TRUE
                        THEN 'Anonymous Donor'
                        ELSE COALESCE(
                            MAX(NULLIF(dn.display_name, '')),
                            MAX(dn.full_name)
                        )
                    END AS name,

                    SUM(d.amount) AS amount,

                    COUNT(d.id) AS donationCount,

                    MAX(d.donation_date) AS latestDonationDate,

                    ROW_NUMBER() OVER (
                        PARTITION BY YEAR(d.donation_date)
                        ORDER BY
                            SUM(d.amount) DESC,
                            MAX(d.donation_date) DESC,
                            d.donor_id ASC
                    ) AS donorRank

                FROM donations d

                INNER JOIN donors dn
                    ON dn.id = d.donor_id

                WHERE d.status IN ('RECEIVED', 'CLEARED')
                  AND d.is_archived = FALSE

                GROUP BY
                    YEAR(d.donation_date),
                    d.donor_id

            ) AS ranked

            WHERE ranked.donorRank <= 5

            ORDER BY
                ranked.year DESC,
                ranked.donorRank ASC
        `);

        const groupedByYear = {};

        rows.forEach((row) => {

            const year = Number(row.year);

            if (!groupedByYear[year]) {
                groupedByYear[year] = {
                    year,
                    donors: []
                };
            }

            groupedByYear[year].donors.push({
                rank: groupedByYear[year].donors.length + 1,
                name: row.name,
                amount: row.amount,
                donationCount: Number(row.donationCount),
                date: row.latestDonationDate
            });

        });

        // Newest year first
        return Object.values(groupedByYear).sort((a, b) => b.year - a.year);
    }
}

module.exports = new DonationModel();