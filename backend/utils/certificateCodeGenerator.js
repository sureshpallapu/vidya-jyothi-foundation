const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Generate Certificate Code
|--------------------------------------------------------------------------
|
| Format:
|
| CERT-2026-000001
| CERT-2026-000002
|
| Automatically resets every year.
|--------------------------------------------------------------------------
*/

async function generateCertificateCode() {

    const year = new Date().getFullYear();

    const prefix = `CERT-${year}-`;

    const [rows] = await db.execute(

        `
        SELECT certificate_code
        FROM donation_certificates
        WHERE certificate_code LIKE ?
        ORDER BY id DESC
        LIMIT 1
        `,

        [`${prefix}%`]

    );

    let nextNumber = 1;

    if (rows.length > 0) {

        const lastCode = rows[0].certificate_code;

        const lastNumber = parseInt(
            lastCode.split("-")[2],
            10
        );

        nextNumber = lastNumber + 1;

    }

    return `${prefix}${String(nextNumber).padStart(6, "0")}`;

}

module.exports = generateCertificateCode;