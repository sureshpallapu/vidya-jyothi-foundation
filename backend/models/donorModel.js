const db = require("../config/db");
const generateDonorCode = require("../utils/donorCodeGenerator");
class DonorModel {


    /*
|--------------------------------------------------------------------------
| Get Donor Types
|--------------------------------------------------------------------------
*/

async getDonorTypes() {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            type_name
        FROM donor_types
        WHERE status = 'ACTIVE'
        ORDER BY type_name ASC
        `
    );

    return rows;

}


    /*
    |--------------------------------------------------------------------------
    | Check Existing Donor
    |--------------------------------------------------------------------------
    */
async checkDuplicate({
    mobile,
    email,
    panNumber,
    excludeId = null
}) {

        const conditions = [];
        const values = [];

        if (mobile) {
            conditions.push("mobile = ?");
            values.push(mobile);
        }

        if (email) {
            conditions.push("email = ?");
            values.push(email);
        }

        if (panNumber) {
            conditions.push("pan_number = ?");
            values.push(panNumber);
        }

        if (conditions.length === 0) {
            return null;
        }

       let query = `
SELECT
    id,
    donor_code,
    full_name,
    mobile,
    email,
    pan_number,
    status
FROM donors
WHERE (${conditions.join(" OR ")})
`;

if (excludeId) {
    query += " AND id <> ?";
    values.push(excludeId);
}

query += " LIMIT 1";

        const [rows] = await db.execute(query, values);

        if (rows.length === 0) {
            return null;
        }

        const donor = rows[0];

        let matchedBy = null;

        if (mobile && donor.mobile === mobile) {
            matchedBy = "MOBILE";
        } else if (email && donor.email === email) {
            matchedBy = "EMAIL";
        } else if (panNumber && donor.pan_number === panNumber) {
            matchedBy = "PAN";
        }

        return {
            matchedBy,
            donor,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Find Donor By Code
    |--------------------------------------------------------------------------
    */

    async findByCode(donorCode) {

    const [rows] = await db.execute(
        `
        SELECT
            d.*,
            dt.type_name AS donor_type
        FROM donors d
        LEFT JOIN donor_types dt
            ON dt.id = d.donor_type_id
        WHERE d.donor_code = ?
        LIMIT 1
        `,
        [donorCode]
    );

    return rows[0] || null;

}

    /*
|--------------------------------------------------------------------------
| Create Donor
|--------------------------------------------------------------------------
*/

async createDonor(donorData) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [result] = await connection.execute(
            `
            INSERT INTO donors
            (
                donor_type_id,
                full_name,
                display_name,
                mobile,
                alternate_mobile,
                email,
                website,
                pan_number,
                aadhaar_number,
                gst_number,
                registration_number,
                address_line1,
                address_line2,
                city,
                district,
                state,
                country,
                pincode,
                preferred_communication,
                remarks,
                status,
                created_by,
                updated_by
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                donorData.donor_type_id,
                donorData.full_name,
                donorData.display_name || null,
                donorData.mobile,
                donorData.alternate_mobile || null,
                donorData.email || null,
                donorData.website || null,
                donorData.pan_number || null,
                donorData.aadhaar_number || null,
                donorData.gst_number || null,
                donorData.registration_number || null,
                donorData.address_line1 || null,
                donorData.address_line2 || null,
                donorData.city || null,
                donorData.district || null,
                donorData.state || null,
                donorData.country || null,
                donorData.pincode || null,
                donorData.preferred_communication || "PHONE",
                donorData.remarks || null,
                donorData.status || "ACTIVE",
                donorData.created_by || 1,
                donorData.updated_by || 1
            ]
        );

        const donorId = result.insertId;

        const donorCode = generateDonorCode(donorId);

        await connection.execute(
            `
            UPDATE donors
            SET donor_code = ?
            WHERE id = ?
            `,
            [donorCode, donorId]
        );

        await connection.commit();

        return {
            id: donorId,
            donor_code: donorCode
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
| Update Donor
|--------------------------------------------------------------------------
*/

async updateDonor(donorCode, donorData) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [result] = await connection.execute(
            `
            UPDATE donors
            SET
                donor_type_id = ?,
                full_name = ?,
                display_name = ?,
                mobile = ?,
                alternate_mobile = ?,
                email = ?,
                website = ?,
                pan_number = ?,
                aadhaar_number = ?,
                gst_number = ?,
                registration_number = ?,
                address_line1 = ?,
                address_line2 = ?,
                city = ?,
                district = ?,
                state = ?,
                country = ?,
                pincode = ?,
                preferred_communication = ?,
                remarks = ?,
                status = ?,
                updated_by = ?
            WHERE donor_code = ?
            `,
            [
                donorData.donor_type_id,
                donorData.full_name,
                donorData.display_name || null,
                donorData.mobile,
                donorData.alternate_mobile || null,
                donorData.email || null,
                donorData.website || null,
                donorData.pan_number || null,
                donorData.aadhaar_number || null,
                donorData.gst_number || null,
                donorData.registration_number || null,
                donorData.address_line1 || null,
                donorData.address_line2 || null,
                donorData.city || null,
                donorData.district || null,
                donorData.state || null,
                donorData.country || "India",
                donorData.pincode || null,
                donorData.preferred_communication || "PHONE",
                donorData.remarks || null,
                donorData.status || "ACTIVE",
                donorData.updated_by || 1,
                donorCode
            ]
        );

        await connection.commit();

        return {
            affectedRows: result.affectedRows
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
| List Donors
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| List Donors
|--------------------------------------------------------------------------
*/

async listDonors({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    donorType = ""
}) {

    // Pagination
    page = Number.parseInt(page, 10);
    limit = Number.parseInt(limit, 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(limit) || limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    // Dynamic WHERE
    let where = "WHERE 1=1";
    const params = [];

    if (search && search.trim() !== "") {

        const keyword = `%${search.trim()}%`;

        where += `
            AND (
                d.donor_code LIKE ?
                OR d.full_name LIKE ?
                OR d.mobile LIKE ?
                OR d.email LIKE ?
            )
        `;

        params.push(
            keyword,
            keyword,
            keyword,
            keyword
        );
    }

    if (status) {

        where += " AND d.status = ?";
        params.push(status);

    }

    if (donorType) {

        where += " AND d.donor_type_id = ?";
        params.push(donorType);

    }

    // Main Query
    const sql = `
        SELECT
            d.id,
            d.donor_code,
            d.donor_type_id,
            d.full_name,
            d.mobile,
            d.email,
            d.status,
            dt.type_name AS donor_type

        FROM donors d

        INNER JOIN donor_types dt
            ON dt.id = d.donor_type_id

        ${where}

        ORDER BY d.id DESC

        LIMIT ${limit}
        OFFSET ${offset}
    `;

    const [rows] = await db.execute(sql, params);

    // Count Query
    const countSql = `
        SELECT COUNT(*) AS total

        FROM donors d

        ${where}
    `;

    const [countRows] = await db.execute(countSql, params);

    const total = countRows[0].total;

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };

}

/*
|--------------------------------------------------------------------------
| Archive Donor
|--------------------------------------------------------------------------
*/

async archiveDonor(donorCode, updatedBy = 1) {

    const [result] = await db.execute(
        `
        UPDATE donors
        SET
            status='INACTIVE',
            updated_by=?
        WHERE donor_code=?
        `,
        [
            updatedBy,
            donorCode
        ]
    );

    return result.affectedRows;

}

/*
|--------------------------------------------------------------------------
| Restore Donor
|--------------------------------------------------------------------------
*/

async restoreDonor(donorCode, updatedBy = 1) {

    const [result] = await db.execute(
        `
        UPDATE donors
        SET
            status='ACTIVE',
            updated_by=?
        WHERE donor_code=?
        `,
        [
            updatedBy,
            donorCode
        ]
    );

    return result.affectedRows;

}

/*
|--------------------------------------------------------------------------
| Donor Statistics
|--------------------------------------------------------------------------
*/

async getStatistics() {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) totalDonors,

            SUM(
                CASE
                    WHEN status='ACTIVE'
                    THEN 1
                    ELSE 0
                END
            ) activeDonors,

            SUM(
                CASE
                    WHEN status='INACTIVE'
                    THEN 1
                    ELSE 0
                END
            ) inactiveDonors

        FROM donors
        `
    );

    return rows[0];

}
}

module.exports = new DonorModel();