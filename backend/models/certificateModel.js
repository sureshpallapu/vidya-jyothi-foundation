const db = require("../config/db");

const generateCertificateCode = require(
    "../utils/certificateCodeGenerator"
);

/*
|--------------------------------------------------------------------------
| Certificate Model
|--------------------------------------------------------------------------
*/

class CertificateModel {

    /*
    |--------------------------------------------------------------------------
    | Generate Certificate
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

static async generateCertificate(data) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        /*
        |--------------------------------------------------------------------------
        | Check Donation
        |--------------------------------------------------------------------------
        */

        const [donationRows] = await connection.execute(

            `
           SELECT

    d.*,

    dm.full_name,

    dm.mobile,

    dm.email,

    CONCAT_WS(

        ', ',

        dm.address_line1,

        dm.address_line2,

        dm.city,

        dm.district,

        dm.state,

        dm.pincode

    ) AS address

FROM donations d

            INNER JOIN donors dm

                ON d.donor_id = dm.id

            WHERE d.id = ?

            `,

            [

                data.donation_id

            ]

        );

        if (!donationRows.length) {

            throw new Error(
                "Donation not found."
            );

        }

        const donation = donationRows[0];

        /*
        |--------------------------------------------------------------------------
        | Check Receipt
        |--------------------------------------------------------------------------
        */

        const [receiptRows] = await connection.execute(

            `
            SELECT *

            FROM receipts

            WHERE donation_id = ?

            LIMIT 1
            `,

            [

                donation.id

            ]

        );

        if (!receiptRows.length) {

            throw new Error(

                "Please generate the donation receipt before generating the certificate."

            );

        }

        const receipt = receiptRows[0];




        
        /*
        |--------------------------------------------------------------------------
        | Check Existing Certificate
        |--------------------------------------------------------------------------
        */

        const existing = await this.findByDonationId(

            donation.id

        );

        if (existing) {

            await connection.rollback();

            return await this.findByCode(

                existing.certificate_code

            );

        }

        /*
        |--------------------------------------------------------------------------
        | Generate Certificate Code
        |--------------------------------------------------------------------------
        */

        const certificateCode =

            await generateCertificateCode();

        /*
        |--------------------------------------------------------------------------
        | Financial Year
        |--------------------------------------------------------------------------
        */

        const issueDate = new Date();

        const year = issueDate.getFullYear();

        const financialYear =

            `${year}-${String(year + 1).slice(-2)}`;

        /*
        |--------------------------------------------------------------------------
        | Insert Certificate
        |--------------------------------------------------------------------------
        */

        await connection.execute(

            `
            INSERT INTO donation_certificates (

                certificate_code,

                donation_id,

                donor_id,

                receipt_id,

                certificate_type,

                certificate_title,

                issue_date,

                financial_year,

                remarks,

                generated_by

            )

            VALUES (

                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?

            )
            `,

            [

                certificateCode,

                donation.id,

                donation.donor_id,

                receipt.id,

                data.certificate_type,

                getCertificateTitle(

                    data.certificate_type

                ),

                issueDate,

                financialYear,

                data.remarks || null,

                1,

            ]

        );

        await connection.commit();

        return await this.findByCode(

            certificateCode

        );

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

}




static async findById(id) {

    const [rows] = await db.execute(
        `
        SELECT
            dc.*,
            d.amount,
            dt.type_name AS donation_type,
            pm.mode_name AS payment_mode,
            dm.full_name,
            dm.mobile,
            dm.email,
            CONCAT_WS(
                ', ',
                dm.address_line1,
                dm.address_line2,
                dm.city,
                dm.district,
                dm.state,
                dm.pincode
            ) AS address,
            r.receipt_code
        FROM donation_certificates dc
        INNER JOIN donations d
            ON dc.donation_id = d.id
        INNER JOIN donors dm
            ON dc.donor_id = dm.id
        LEFT JOIN donation_types dt
            ON d.donation_type_id = dt.id
        LEFT JOIN payment_modes pm
            ON d.payment_mode_id = pm.id
        LEFT JOIN receipts r
            ON dc.receipt_id = r.id
        WHERE dc.id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows.length ? rows[0] : null;
}


/*
|--------------------------------------------------------------------------
| Find Certificate By Donation ID
|--------------------------------------------------------------------------
*/

static async findByDonationId(donationId) {

    const [rows] = await db.execute(

        `
        SELECT
            *
        FROM donation_certificates
        WHERE donation_id = ?
        LIMIT 1
        `,

        [donationId]

    );

    return rows.length ? rows[0] : null;

}

/*
|--------------------------------------------------------------------------
| Find Certificate By Code
|--------------------------------------------------------------------------
*/

static async findByCode(certificateCode) {

    const [rows] = await db.execute(

        `
        SELECT

            dc.*,

            d.amount,

            dt.type_name AS donation_type,

            pm.mode_name AS payment_mode,

            dm.full_name,

            dm.mobile,

            dm.email,

            CONCAT_WS(

                ', ',

                dm.address_line1,

                dm.address_line2,

                dm.city,

                dm.district,

                dm.state,

                dm.pincode

            ) AS address,

            r.receipt_code

        FROM donation_certificates dc

        INNER JOIN donations d
            ON dc.donation_id = d.id

        INNER JOIN donors dm
            ON dc.donor_id = dm.id

        LEFT JOIN donation_types dt
            ON d.donation_type_id = dt.id

        LEFT JOIN payment_modes pm
            ON d.payment_mode_id = pm.id

        LEFT JOIN receipts r
            ON dc.receipt_id = r.id

        WHERE dc.certificate_code = ?

        LIMIT 1
        `,

        [certificateCode]

    );

    return rows.length ? rows[0] : null;

}

    /*
    |--------------------------------------------------------------------------
    | List Certificates
    |--------------------------------------------------------------------------
    */

    static async listCertificates() {

        const [

            rows

        ] = await db.execute(

            `
            SELECT

                dc.certificate_code,

                dc.certificate_type,

                dc.certificate_title,

                dc.issue_date,

                dc.status,

                dm.full_name,

                d.amount

            FROM donation_certificates dc

            INNER JOIN donors dm

                ON dc.donor_id = dm.id

            INNER JOIN donations d

                ON dc.donation_id = d.id

            ORDER BY dc.id DESC
            `

        );

        return rows;

    }

    /*
    |--------------------------------------------------------------------------
    | Archive Certificate
    |--------------------------------------------------------------------------
    */

    static async archiveCertificate(

        certificateCode,

        archivedBy

    ) {

        const [

            result

        ] = await db.execute(

            `
            UPDATE donation_certificates

            SET

                status='ARCHIVED',

                archived_by=?

            WHERE

                certificate_code=?
            `,

            [

                archivedBy,

                certificateCode

            ]

        );

        return result.affectedRows > 0;

    }

    /*
    |--------------------------------------------------------------------------
    | Verify Certificate
    |--------------------------------------------------------------------------
    */

    static async verifyCertificate(

        certificateCode

    ) {

        return await this.findByCode(

            certificateCode

        );

    }

}

/*
|--------------------------------------------------------------------------
| Certificate Title
|--------------------------------------------------------------------------
*/

function getCertificateTitle(type) {

    switch (type) {

        case "SPONSOR":

            return "Sponsor Certificate";

        case "CSR":

            return "Corporate Social Responsibility Certificate";

        default:

            return "Certificate of Appreciation";

    }

}

module.exports = CertificateModel;