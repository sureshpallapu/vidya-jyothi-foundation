const db = require("../config/db");

const {
    normalizeEmail,
    normalizeMobile,
    normalizeAadhaar,

    createEmailHash,
    createMobileHash,
    createAadhaarHash,

    encryptSensitive,
    decryptSensitive,

    maskEmail,
    maskMobile,
    maskAadhaar
} = require("../utils/volunteerSecurity");


class VolunteerModel {

    /*
    |--------------------------------------------------------------------------
    | Generate Volunteer Code
    |--------------------------------------------------------------------------
    */

    generateVolunteerCode(id) {

        const year =
            new Date().getFullYear();

        const sequence =
            String(id).padStart(6, "0");

        return `VJF-VOL-${year}-${sequence}`;
    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Profile Completion
    |--------------------------------------------------------------------------
    */

    calculateProfileCompletion(data) {

        const fields = [

            "full_name",
            "email",
            "mobile",

            "date_of_birth",
            "gender",

            "city",
            "district",
            "state",
            "pincode",

            "address_line1",

            "highest_qualification",
            "profession",

            "primary_interest",

            "preferred_mode",

            "emergency_contact_name",
            "emergency_contact_mobile"

        ];

        let completed = 0;

        fields.forEach(field => {

            const value =
                data[field];

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {

                completed++;

            }

        });

        return Math.round(
            (completed / fields.length) * 100
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Email Hash
    |--------------------------------------------------------------------------
    */

    async findByEmailHash(emailHash) {

        if (!emailHash) {
            return null;
        }

        const [rows] =
            await db.execute(
                `
                SELECT
                    id,
                    volunteer_code,
                    full_name,
                    status,
                    application_source
                FROM volunteers
                WHERE email_hash = ?
                LIMIT 1
                `,
                [emailHash]
            );

        return rows[0] || null;
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Mobile Hash
    |--------------------------------------------------------------------------
    */

    async findByMobileHash(mobileHash) {

        if (!mobileHash) {
            return null;
        }

        const [rows] =
            await db.execute(
                `
                SELECT
                    id,
                    volunteer_code,
                    full_name,
                    status,
                    application_source
                FROM volunteers
                WHERE mobile_hash = ?
                LIMIT 1
                `,
                [mobileHash]
            );

        return rows[0] || null;
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Aadhaar Hash
    |--------------------------------------------------------------------------
    */

    async findByAadhaarHash(aadhaarHash) {

        if (!aadhaarHash) {
            return null;
        }

        const [rows] =
            await db.execute(
                `
                SELECT
                    id,
                    volunteer_code,
                    full_name,
                    status,
                    application_source
                FROM volunteers
                WHERE aadhaar_hash = ?
                LIMIT 1
                `,
                [aadhaarHash]
            );

        return rows[0] || null;
    }


    /*
    |--------------------------------------------------------------------------
    | Check All Duplicates
    |--------------------------------------------------------------------------
    |
    | Email   = Primary
    | Mobile  = Secondary
    | Aadhaar = Strong identity duplicate check
    |
    |--------------------------------------------------------------------------
    */

    async checkDuplicates({
        email,
        mobile,
        aadhaar
    }) {

        const emailNormalized =
            normalizeEmail(email);

        const mobileNormalized =
            normalizeMobile(mobile);

        const aadhaarNormalized =
            normalizeAadhaar(aadhaar);


        const emailHash =
            emailNormalized
                ? createEmailHash(emailNormalized)
                : null;


        const mobileHash =
            mobileNormalized
                ? createMobileHash(mobileNormalized)
                : null;


        const aadhaarHash =
            aadhaarNormalized
                ? createAadhaarHash(aadhaarNormalized)
                : null;


        const duplicates = [];


        /*
        |--------------------------------------------------------------------------
        | Email
        |--------------------------------------------------------------------------
        */

        if (emailHash) {

            const existing =
                await this.findByEmailHash(
                    emailHash
                );

            if (existing) {

                duplicates.push({

                    field: "email",

                    message:
                        "A volunteer with this email address already exists.",

                    volunteer_code:
                        existing.volunteer_code,

                    status:
                        existing.status

                });

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Mobile
        |--------------------------------------------------------------------------
        */

        if (mobileHash) {

            const existing =
                await this.findByMobileHash(
                    mobileHash
                );

            if (existing) {

                duplicates.push({

                    field: "mobile",

                    message:
                        "A volunteer with this mobile number already exists.",

                    volunteer_code:
                        existing.volunteer_code,

                    status:
                        existing.status

                });

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Aadhaar
        |--------------------------------------------------------------------------
        */

        if (aadhaarHash) {

            const existing =
                await this.findByAadhaarHash(
                    aadhaarHash
                );

            if (existing) {

                duplicates.push({

                    field: "aadhaar",

                    message:
                        "A volunteer with this Aadhaar number already exists.",

                    volunteer_code:
                        existing.volunteer_code,

                    status:
                        existing.status

                });

            }

        }


        return {

            isDuplicate:
                duplicates.length > 0,

            duplicates

        };
    }


    /*
    |--------------------------------------------------------------------------
    | Create Volunteer
    |--------------------------------------------------------------------------
    */

    async createVolunteer(data) {

        console.log(
            "STEP 1: createVolunteer started"
        );


        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const email =
            normalizeEmail(data.email);

        const mobile =
            normalizeMobile(data.mobile);

        const aadhaar =
            normalizeAadhaar(data.aadhaar);


        console.log(
            "STEP 2: normalization completed"
        );


        /*
        |--------------------------------------------------------------------------
        | Required Validation
        |--------------------------------------------------------------------------
        */

        if (!data.full_name) {

            throw new Error(
                "Volunteer name is required."
            );

        }

        if (!email) {

            throw new Error(
                "Email address is required."
            );

        }

        if (!mobile) {

            throw new Error(
                "Mobile number is required."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Hashes
        |--------------------------------------------------------------------------
        */

        const emailHash =
            createEmailHash(email);

        const mobileHash =
            createMobileHash(mobile);

        const aadhaarHash =
            aadhaar
                ? createAadhaarHash(aadhaar)
                : null;


        console.log(
            "STEP 3: hashes generated"
        );


        /*
        |--------------------------------------------------------------------------
        | Duplicate Check
        |--------------------------------------------------------------------------
        */

        console.log(
            "STEP 4: duplicate check started"
        );

        const duplicateResult =
            await this.checkDuplicates({

                email,
                mobile,
                aadhaar

            });


        console.log(
            "STEP 5: duplicate check completed"
        );


        if (
            duplicateResult.isDuplicate
        ) {

            const error =
                new Error(
                    duplicateResult
                        .duplicates[0]
                        .message
                );

            error.code =
                "VOLUNTEER_DUPLICATE";

            error.duplicates =
                duplicateResult.duplicates;

            throw error;

        }


        /*
        |--------------------------------------------------------------------------
        | Encryption
        |--------------------------------------------------------------------------
        */

        const emailEncrypted =
            encryptSensitive(email);

        const mobileEncrypted =
            encryptSensitive(mobile);

        const aadhaarEncrypted =
            aadhaar
                ? encryptSensitive(aadhaar)
                : null;


        console.log(
            "STEP 6: sensitive data encrypted"
        );


        /*
        |--------------------------------------------------------------------------
        | Profile Completion
        |--------------------------------------------------------------------------
        */

        const profileCompletion =
            this.calculateProfileCompletion({

                ...data,

                email,
                mobile

            });


        /*
        |--------------------------------------------------------------------------
        | DB Connection
        |--------------------------------------------------------------------------
        */

        const connection =
            await db.getConnection();


        try {

            await connection.beginTransaction();


            /*
            |--------------------------------------------------------------------------
            | Temporary Volunteer Code
            |--------------------------------------------------------------------------
            */

            const temporaryCode =
                `TMP-${Date.now()}-${Math.floor(
                    Math.random() * 1000
                )}`;


            /*
            |--------------------------------------------------------------------------
            | Insert
            |--------------------------------------------------------------------------
            */

            const [result] =
                await connection.execute(
                    `
                    INSERT INTO volunteers
                    (
                        volunteer_code,
                        full_name,

                        email_encrypted,
                        email_hash,

                        mobile_encrypted,
                        mobile_hash,

                        alternate_mobile,

                        city,
                        district,
                        state,
                        pincode,

                        area_of_interest,
                        message,

                        date_of_birth,
                        gender,

                        aadhaar_encrypted,
                        aadhaar_hash,
                        aadhaar_verified,

                        email_verified,
                        mobile_verified,

                        address_line1,
                        address_line2,

                        highest_qualification,
                        course,

                        profession,
                        organization,

                        years_of_experience,

                        primary_interest,
                        secondary_interest,

                        skills,
                        languages_known,

                        previous_volunteer_experience,

                        availability_weekdays,
                        availability_weekends,
                        availability_evenings,

                        preferred_mode,

                        emergency_contact_name,
                        emergency_contact_relationship,
                        emergency_contact_mobile,

                        profile_image,
                        short_bio,

                        profile_completion_percent,

                        volunteer_type,

                        coordinator_id,
                        internal_remarks,

                        status,

                        application_source,

                        created_by,
                        updated_by
                    )
                    VALUES
                    (
                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,

                        ?,
                        ?,
                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,

                        ?,
                        ?,

                        ?,
                        ?,

                        ?,

                        ?,
                        ?,
                        ?,

                        ?,

                        ?,
                        ?,
                        ?,

                        ?,
                        ?,

                        ?,

                        ?,

                        ?,
                        ?,

                        ?,

                        ?,

                        ?,
                        ?
                    )
                    `,
                    [

                        temporaryCode,
                        data.full_name.trim(),

                        emailEncrypted,
                        emailHash,

                        mobileEncrypted,
                        mobileHash,

                        data.alternate_mobile || null,

                        data.city || null,
                        data.district || null,
                        data.state || "Andhra Pradesh",
                        data.pincode || null,

                        data.area_of_interest || null,
                        data.message || null,

                        data.date_of_birth || null,
                        data.gender || null,

                        aadhaarEncrypted,
                        aadhaarHash,
                        data.aadhaar_verified ?? false,

                        data.email_verified ?? false,
                        data.mobile_verified ?? false,

                        data.address_line1 || null,
                        data.address_line2 || null,

                        data.highest_qualification || null,
                        data.course || null,

                        data.profession || null,
                        data.organization || null,

                        data.years_of_experience ?? null,

                        data.primary_interest || null,
                        data.secondary_interest || null,

                        data.skills || null,
                        data.languages_known || null,

                        data.previous_volunteer_experience || null,

                        data.availability_weekdays ?? false,
                        data.availability_weekends ?? false,
                        data.availability_evenings ?? false,

                        data.preferred_mode || null,

                        data.emergency_contact_name || null,
                        data.emergency_contact_relationship || null,
                        data.emergency_contact_mobile || null,

                        data.profile_image || null,
                        data.short_bio || null,

                        profileCompletion,

                        data.volunteer_type || "REGULAR",

                        data.coordinator_id || null,
                        data.internal_remarks || null,

                        data.status || "PENDING",

                        data.application_source || "PUBLIC",

                        data.created_by || null,
                        data.updated_by || null

                    ]
                );


            const volunteerId =
                result.insertId;


            /*
            |--------------------------------------------------------------------------
            | Permanent Volunteer Code
            |--------------------------------------------------------------------------
            */

            const volunteerCode =
                this.generateVolunteerCode(
                    volunteerId
                );


            await connection.execute(
                `
                UPDATE volunteers
                SET volunteer_code = ?
                WHERE id = ?
                `,
                [
                    volunteerCode,
                    volunteerId
                ]
            );


            await connection.commit();


            console.log(
                "✅ Volunteer created:",
                volunteerCode
            );


            /*
            |--------------------------------------------------------------------------
            | Safe Response
            |--------------------------------------------------------------------------
            */

            return {

                id:
                    volunteerId,

                volunteer_code:
                    volunteerCode,

                full_name:
                    data.full_name.trim(),

                email:
                    maskEmail(email),

                mobile:
                    maskMobile(mobile),

                status:
                    data.status || "PENDING",

                application_source:
                    data.application_source ||
                    "PUBLIC",

                profile_completion_percent:
                    profileCompletion

            };


        } catch (error) {

            await connection.rollback();


            console.error(
                "❌ Volunteer creation failed:",
                error
            );


            if (
                error.code === "ER_DUP_ENTRY"
            ) {

                const duplicateError =
                    new Error(
                        "A volunteer with the same email, mobile, Aadhaar, or volunteer code already exists."
                    );

                duplicateError.code =
                    "VOLUNTEER_DUPLICATE";

                throw duplicateError;

            }


            throw error;

        } finally {

            connection.release();

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Find Volunteer By ID
    |--------------------------------------------------------------------------
    */

    async findById(id) {

        if (!id) {
            return null;
        }

        const [rows] =
            await db.execute(
                `
                SELECT *
                FROM volunteers
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );

        return rows[0] || null;
    }


    /*
    |--------------------------------------------------------------------------
    | Find Volunteer By Code
    |--------------------------------------------------------------------------
    */

  async findByCode(volunteerCode) {

    if (!volunteerCode) {
        return null;
    }


    const [rows] =
        await db.execute(
            `
            SELECT *
            FROM volunteers
            WHERE volunteer_code = ?
            LIMIT 1
            `,
            [volunteerCode]
        );


    const row = rows[0];


    if (!row) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Decrypt Sensitive Fields
    |--------------------------------------------------------------------------
    |
    | These values are decrypted ONLY inside the backend.
    |
    | The controller will mask them before sending the
    | response to the frontend.
    |
    |--------------------------------------------------------------------------
    */

    let email = null;
    let mobile = null;
    let aadhaar = null;


    try {

        if (row.email_encrypted) {

            email =
                decryptSensitive(
                    row.email_encrypted
                );

        }


        if (row.mobile_encrypted) {

            mobile =
                decryptSensitive(
                    row.mobile_encrypted
                );

        }


        if (row.aadhaar_encrypted) {

            aadhaar =
                decryptSensitive(
                    row.aadhaar_encrypted
                );

        }

    } catch (error) {

        console.error(
            "❌ Volunteer sensitive data decryption failed:",
            error
        );

        throw new Error(
            "Unable to securely read volunteer information."
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Return Internal Volunteer Object
    |--------------------------------------------------------------------------
    */

    return {

        ...row,

        email,

        mobile,

        aadhaar

    };

}


    /*
    |--------------------------------------------------------------------------
    | Get Safe Volunteer Profile
    |--------------------------------------------------------------------------
    */

    async getSafeProfile(volunteerCode) {

        const volunteer =
            await this.findByCode(
                volunteerCode
            );

        if (!volunteer) {
            return null;
        }


        const email =
            volunteer.email_encrypted
                ? decryptSensitive(
                    volunteer.email_encrypted
                )
                : null;


        const mobile =
            volunteer.mobile_encrypted
                ? decryptSensitive(
                    volunteer.mobile_encrypted
                )
                : null;


        const aadhaar =
            volunteer.aadhaar_encrypted
                ? decryptSensitive(
                    volunteer.aadhaar_encrypted
                )
                : null;


        return {

            id:
                volunteer.id,

            volunteer_code:
                volunteer.volunteer_code,

            full_name:
                volunteer.full_name,

            email:
                maskEmail(email),

            mobile:
                maskMobile(mobile),

            aadhaar:
                maskAadhaar(aadhaar),

            aadhaar_verified:
                volunteer.aadhaar_verified,

            email_verified:
                volunteer.email_verified,

            mobile_verified:
                volunteer.mobile_verified,

            alternate_mobile:
                volunteer.alternate_mobile,

            city:
                volunteer.city,

            district:
                volunteer.district,

            state:
                volunteer.state,

            pincode:
                volunteer.pincode,

            area_of_interest:
                volunteer.area_of_interest,

            date_of_birth:
                volunteer.date_of_birth,

            gender:
                volunteer.gender,

            address_line1:
                volunteer.address_line1,

            address_line2:
                volunteer.address_line2,

            highest_qualification:
                volunteer.highest_qualification,

            course:
                volunteer.course,

            profession:
                volunteer.profession,

            organization:
                volunteer.organization,

            years_of_experience:
                volunteer.years_of_experience,

            primary_interest:
                volunteer.primary_interest,

            secondary_interest:
                volunteer.secondary_interest,

            skills:
                volunteer.skills,

            languages_known:
                volunteer.languages_known,

            availability_weekdays:
                volunteer.availability_weekdays,

            availability_weekends:
                volunteer.availability_weekends,

            availability_evenings:
                volunteer.availability_evenings,

            preferred_mode:
                volunteer.preferred_mode,

            emergency_contact_name:
                volunteer.emergency_contact_name,

            emergency_contact_relationship:
                volunteer.emergency_contact_relationship,

            emergency_contact_mobile:
                volunteer.emergency_contact_mobile,

            profile_image:
                volunteer.profile_image,

            short_bio:
                volunteer.short_bio,

            profile_completion_percent:
                volunteer.profile_completion_percent,

            volunteer_type:
                volunteer.volunteer_type,

            status:
                volunteer.status,

            application_source:
                volunteer.application_source,

            created_at:
                volunteer.created_at,

            updated_at:
                volunteer.updated_at

        };

    }


    /*
    |--------------------------------------------------------------------------
    | Get Admin Sensitive Profile
    |--------------------------------------------------------------------------
    */

    async getAdminSensitiveProfile(
        volunteerCode
    ) {

        const volunteer =
            await this.findByCode(
                volunteerCode
            );

        if (!volunteer) {
            return null;
        }


        const email =
            volunteer.email_encrypted
                ? decryptSensitive(
                    volunteer.email_encrypted
                )
                : null;


        const mobile =
            volunteer.mobile_encrypted
                ? decryptSensitive(
                    volunteer.mobile_encrypted
                )
                : null;


        const aadhaar =
            volunteer.aadhaar_encrypted
                ? decryptSensitive(
                    volunteer.aadhaar_encrypted
                )
                : null;


        return {

            ...volunteer,

            email,

            mobile,

            aadhaar

        };

    }


    /*
    |--------------------------------------------------------------------------
    | Update Volunteer Profile
    |--------------------------------------------------------------------------
    |
    | Used by ADMIN while completing the remaining volunteer information.
    |
    | Security:
    |
    | 1. Normalize email/mobile/Aadhaar
    | 2. Generate blind indexes
    | 3. Check duplicates
    | 4. Encrypt sensitive values
    | 5. Update profile
    | 6. Recalculate completion
    | 7. Transaction + rollback
    |
    |--------------------------------------------------------------------------
    */

    async updateVolunteerProfile(
        volunteerCode,
        data
    ) {

        const connection =
            await db.getConnection();


        try {

            console.log(
                "================================================"
            );

            console.log(
                "STEP 1: updateVolunteerProfile started"
            );

            console.log(
                "Volunteer Code:",
                volunteerCode
            );


            /*
            |--------------------------------------------------------------------------
            | Start Transaction
            |--------------------------------------------------------------------------
            */

            await connection.beginTransaction();


            /*
            |--------------------------------------------------------------------------
            | Get Existing Volunteer
            |--------------------------------------------------------------------------
            */

            const [existingRows] =
                await connection.execute(
                    `
                    SELECT
                        *
                    FROM volunteers
                    WHERE volunteer_code = ?
                    LIMIT 1
                    `,
                    [volunteerCode]
                );


            if (!existingRows.length) {

                throw new Error(
                    "Volunteer not found."
                );

            }


            const existing =
                existingRows[0];


            console.log(
                "STEP 2: existing volunteer found"
            );


            /*
            |--------------------------------------------------------------------------
            | Existing / New Sensitive Values
            |--------------------------------------------------------------------------
            */

            let email = null;
            let mobile = null;
            let aadhaar = null;


            /*
            |--------------------------------------------------------------------------
            | Email
            |--------------------------------------------------------------------------
            */

            if (
                data.email !== undefined &&
                data.email !== null &&
                String(data.email).trim() !== ""
            ) {

                email =
                    normalizeEmail(
                        data.email
                    );

            } else if (
                existing.email_encrypted
            ) {

                email =
                    decryptSensitive(
                        existing.email_encrypted
                    );

            }


            /*
            |--------------------------------------------------------------------------
            | Mobile
            |--------------------------------------------------------------------------
            */

            if (
                data.mobile !== undefined &&
                data.mobile !== null &&
                String(data.mobile).trim() !== ""
            ) {

                mobile =
                    normalizeMobile(
                        data.mobile
                    );

            } else if (
                existing.mobile_encrypted
            ) {

                mobile =
                    decryptSensitive(
                        existing.mobile_encrypted
                    );

            }


            /*
            |--------------------------------------------------------------------------
            | Aadhaar
            |--------------------------------------------------------------------------
            */

            if (
                data.aadhaar !== undefined &&
                data.aadhaar !== null &&
                String(data.aadhaar).trim() !== ""
            ) {

                aadhaar =
                    normalizeAadhaar(
                        data.aadhaar
                    );

            } else if (
                existing.aadhaar_encrypted
            ) {

                aadhaar =
                    decryptSensitive(
                        existing.aadhaar_encrypted
                    );

            }


            /*
            |--------------------------------------------------------------------------
            | Generate Hashes
            |--------------------------------------------------------------------------
            */

            const emailHash =
                email
                    ? createEmailHash(email)
                    : null;


            const mobileHash =
                mobile
                    ? createMobileHash(mobile)
                    : null;


            const aadhaarHash =
                aadhaar
                    ? createAadhaarHash(aadhaar)
                    : null;


            console.log(
                "STEP 3: sensitive values normalized and hashed"
            );


            /*
            |--------------------------------------------------------------------------
            | Duplicate Email
            |--------------------------------------------------------------------------
            |
            | IMPORTANT:
            | Exclude current volunteer.
            |--------------------------------------------------------------------------
            */

            if (emailHash) {

                const [rows] =
                    await connection.execute(
                        `
                        SELECT
                            volunteer_code,
                            status
                        FROM volunteers
                        WHERE email_hash = ?
                        AND id <> ?
                        LIMIT 1
                        `,
                        [
                            emailHash,
                            existing.id
                        ]
                    );


                if (rows.length) {

                    const error =
                        new Error(
                            "A volunteer with this email address already exists."
                        );

                    error.code =
                        "VOLUNTEER_DUPLICATE";

                    error.duplicates = [

                        {

                            field:
                                "email",

                            message:
                                "A volunteer with this email address already exists.",

                            volunteer_code:
                                rows[0].volunteer_code,

                            status:
                                rows[0].status

                        }

                    ];

                    throw error;

                }

            }


            /*
            |--------------------------------------------------------------------------
            | Duplicate Mobile
            |--------------------------------------------------------------------------
            */

            if (mobileHash) {

                const [rows] =
                    await connection.execute(
                        `
                        SELECT
                            volunteer_code,
                            status
                        FROM volunteers
                        WHERE mobile_hash = ?
                        AND id <> ?
                        LIMIT 1
                        `,
                        [
                            mobileHash,
                            existing.id
                        ]
                    );


                if (rows.length) {

                    const error =
                        new Error(
                            "A volunteer with this mobile number already exists."
                        );

                    error.code =
                        "VOLUNTEER_DUPLICATE";

                    error.duplicates = [

                        {

                            field:
                                "mobile",

                            message:
                                "A volunteer with this mobile number already exists.",

                            volunteer_code:
                                rows[0].volunteer_code,

                            status:
                                rows[0].status

                        }

                    ];

                    throw error;

                }

            }


            /*
            |--------------------------------------------------------------------------
            | Duplicate Aadhaar
            |--------------------------------------------------------------------------
            */

            if (aadhaarHash) {

                const [rows] =
                    await connection.execute(
                        `
                        SELECT
                            volunteer_code,
                            status
                        FROM volunteers
                        WHERE aadhaar_hash = ?
                        AND id <> ?
                        LIMIT 1
                        `,
                        [
                            aadhaarHash,
                            existing.id
                        ]
                    );


                if (rows.length) {

                    const error =
                        new Error(
                            "A volunteer with this Aadhaar number already exists."
                        );

                    error.code =
                        "VOLUNTEER_DUPLICATE";

                    error.duplicates = [

                        {

                            field:
                                "aadhaar",

                            message:
                                "A volunteer with this Aadhaar number already exists.",

                            volunteer_code:
                                rows[0].volunteer_code,

                            status:
                                rows[0].status

                        }

                    ];

                    throw error;

                }

            }


            console.log(
                "STEP 4: duplicate checks passed"
            );


            /*
            |--------------------------------------------------------------------------
            | Encrypt Sensitive Values
            |--------------------------------------------------------------------------
            */

            const emailEncrypted =
                email
                    ? encryptSensitive(email)
                    : null;


            const mobileEncrypted =
                mobile
                    ? encryptSensitive(mobile)
                    : null;


            const aadhaarEncrypted =
                aadhaar
                    ? encryptSensitive(aadhaar)
                    : null;


            /*
            |--------------------------------------------------------------------------
            | Build Profile Data
            |--------------------------------------------------------------------------
            |
            | Existing values are preserved when a field is not supplied.
            |--------------------------------------------------------------------------
            */

            const profileData = {

                full_name:
                    data.full_name !== undefined
                        ? data.full_name
                        : existing.full_name,

                email:
                    email,

                mobile:
                    mobile,

                date_of_birth:
                    data.date_of_birth !== undefined
                        ? data.date_of_birth
                        : existing.date_of_birth,

                gender:
                    data.gender !== undefined
                        ? data.gender
                        : existing.gender,

                city:
                    data.city !== undefined
                        ? data.city
                        : existing.city,

                district:
                    data.district !== undefined
                        ? data.district
                        : existing.district,

                state:
                    data.state !== undefined
                        ? data.state
                        : existing.state,

                pincode:
                    data.pincode !== undefined
                        ? data.pincode
                        : existing.pincode,

                address_line1:
                    data.address_line1 !== undefined
                        ? data.address_line1
                        : existing.address_line1,

                highest_qualification:
                    data.highest_qualification !== undefined
                        ? data.highest_qualification
                        : existing.highest_qualification,

                profession:
                    data.profession !== undefined
                        ? data.profession
                        : existing.profession,

                primary_interest:
                    data.primary_interest !== undefined
                        ? data.primary_interest
                        : existing.primary_interest,

                preferred_mode:
                    data.preferred_mode !== undefined
                        ? data.preferred_mode
                        : existing.preferred_mode,

                emergency_contact_name:
                    data.emergency_contact_name !== undefined
                        ? data.emergency_contact_name
                        : existing.emergency_contact_name,

                emergency_contact_mobile:
                    data.emergency_contact_mobile !== undefined
                        ? data.emergency_contact_mobile
                        : existing.emergency_contact_mobile

            };


            /*
            |--------------------------------------------------------------------------
            | Calculate Completion
            |--------------------------------------------------------------------------
            */

            const profileCompletion =
                this.calculateProfileCompletion(
                    profileData
                );


            console.log(
                "STEP 5: profile completion =",
                `${profileCompletion}%`
            );


            /*
            |--------------------------------------------------------------------------
            | Build Dynamic UPDATE
            |--------------------------------------------------------------------------
            */

            const updateData = {};


            /*
            |--------------------------------------------------------------------------
            | Normal Profile Fields
            |--------------------------------------------------------------------------
            */

            const allowedFields = [

                "full_name",
                "alternate_mobile",

                "city",
                "district",
                "state",
                "pincode",

                "area_of_interest",
                "message",

                "date_of_birth",
                "gender",

                "address_line1",
                "address_line2",

                "highest_qualification",
                "course",

                "profession",
                "organization",

                "years_of_experience",

                "primary_interest",
                "secondary_interest",

                "skills",
                "languages_known",

                "previous_volunteer_experience",

                "availability_weekdays",
                "availability_weekends",
                "availability_evenings",

                "preferred_mode",

                "emergency_contact_name",
                "emergency_contact_relationship",
                "emergency_contact_mobile",

                "profile_image",
                "short_bio",

                "volunteer_type",

                "coordinator_id",
                "internal_remarks"

            ];


            allowedFields.forEach(field => {

                if (
                    data[field] !== undefined
                ) {

                    updateData[field] =
                        data[field] === ""
                            ? null
                            : data[field];

                }

            });


            /*
            |--------------------------------------------------------------------------
            | Sensitive Email
            |--------------------------------------------------------------------------
            */

            if (
                data.email !== undefined
            ) {

                updateData.email_encrypted =
                    emailEncrypted;

                updateData.email_hash =
                    emailHash;

            }


            /*
            |--------------------------------------------------------------------------
            | Sensitive Mobile
            |--------------------------------------------------------------------------
            */

            if (
                data.mobile !== undefined
            ) {

                updateData.mobile_encrypted =
                    mobileEncrypted;

                updateData.mobile_hash =
                    mobileHash;

            }


            /*
            |--------------------------------------------------------------------------
            | Sensitive Aadhaar
            |--------------------------------------------------------------------------
            */

            if (
                data.aadhaar !== undefined
            ) {

                updateData.aadhaar_encrypted =
                    aadhaarEncrypted;

                updateData.aadhaar_hash =
                    aadhaarHash;

                /*
                |--------------------------------------------------------------------------
                | Important
                |--------------------------------------------------------------------------
                |
                | Entering Aadhaar does NOT mean Aadhaar is verified.
                |
                |--------------------------------------------------------------------------
                */

                updateData.aadhaar_verified =
                    0;

            }


            /*
            |--------------------------------------------------------------------------
            | Profile Completion
            |--------------------------------------------------------------------------
            */

            updateData.profile_completion_percent =
                profileCompletion;


            /*
            |--------------------------------------------------------------------------
            | Updated By
            |--------------------------------------------------------------------------
            */

            updateData.updated_by =
                data.updated_by || 1;


            /*
            |--------------------------------------------------------------------------
            | Nothing To Update
            |--------------------------------------------------------------------------
            */

            if (
                Object.keys(updateData).length === 0
            ) {

                throw new Error(
                    "No profile information was provided for update."
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Generate SET Clause
            |--------------------------------------------------------------------------
            */

            const columns =
                Object.keys(updateData);


            const values =
                Object.values(updateData);


            const setClause =
                columns
                    .map(
                        column =>
                            `\`${column}\` = ?`
                    )
                    .join(", ");


            /*
            |--------------------------------------------------------------------------
            | Execute UPDATE
            |--------------------------------------------------------------------------
            */

            const [result] =
                await connection.execute(
                    `
                    UPDATE volunteers
                    SET ${setClause}
                    WHERE id = ?
                    `,
                    [
                        ...values,
                        existing.id
                    ]
                );


            if (
                result.affectedRows === 0
            ) {

                throw new Error(
                    "Volunteer profile was not updated."
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Commit
            |--------------------------------------------------------------------------
            */

            await connection.commit();


            console.log(
                "STEP 6: volunteer profile updated successfully"
            );


            /*
            |--------------------------------------------------------------------------
            | Safe Return
            |--------------------------------------------------------------------------
            */

            return {

                id:
                    existing.id,

                volunteer_code:
                    volunteerCode,

                status:
                    existing.status,

                profile_completion_percent:
                    profileCompletion

            };


        } catch (error) {

            /*
            |--------------------------------------------------------------------------
            | Rollback
            |--------------------------------------------------------------------------
            */

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "❌ Rollback failed:",
                    rollbackError
                );

            }


            throw error;

        } finally {

            connection.release();

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Approve Volunteer
    |--------------------------------------------------------------------------
    */

    async approveVolunteer(
        volunteerCode,
        approvedBy
    ) {

        if (!approvedBy) {

            throw new Error(
                "Approving admin is required."
            );

        }


        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'APPROVED',
                    approved_by = ?,
                    approved_at = NOW(),

                    rejected_by = NULL,
                    rejected_at = NULL,
                    rejection_reason = NULL,

                    updated_by = ?

                WHERE volunteer_code = ?

                AND status = 'PENDING'
                `,
                [
                    approvedBy,
                    approvedBy,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }


    /*
    |--------------------------------------------------------------------------
    | Reject Volunteer
    |--------------------------------------------------------------------------
    */

    async rejectVolunteer(
        volunteerCode,
        rejectedBy,
        reason
    ) {

        if (!rejectedBy) {

            throw new Error(
                "Rejecting admin is required."
            );

        }


        if (!reason) {

            throw new Error(
                "Rejection reason is required."
            );

        }


        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'REJECTED',
                    rejected_by = ?,
                    rejected_at = NOW(),
                    rejection_reason = ?,
                    updated_by = ?

                WHERE volunteer_code = ?

                AND status IN (
                    'PENDING',
                    'APPROVED'
                )
                `,
                [
                    rejectedBy,
                    reason,
                    rejectedBy,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }


    /*
    |--------------------------------------------------------------------------
    | Activate Volunteer
    |--------------------------------------------------------------------------
    */

   async activateVolunteer(
    volunteerCode,
    activatedBy
) {

    if (!activatedBy) {
        throw new Error(
            "Activating admin is required."
        );
    }

    const [result] =
        await db.execute(
            `
            UPDATE volunteers

            SET
                status = 'ACTIVE',
                activated_by = ?,
                activated_at = NOW(),
                updated_by = ?

            WHERE volunteer_code = ?

            AND status IN (
                'APPROVED',
                'INACTIVE'
            )
            `,
            [
                activatedBy,
                activatedBy,
                volunteerCode
            ]
        );

    return result.affectedRows;
}


    /*
    |--------------------------------------------------------------------------
    | Deactivate Volunteer
    |--------------------------------------------------------------------------
    */

    async deactivateVolunteer(
        volunteerCode,
        updatedBy
    ) {

        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'INACTIVE',
                    updated_by = ?

                WHERE volunteer_code = ?

                AND status = 'ACTIVE'
                `,
                [
                    updatedBy || 1,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }


    /*
    |--------------------------------------------------------------------------
    | Suspend Volunteer
    |--------------------------------------------------------------------------
    */

    async suspendVolunteer(
        volunteerCode,
        updatedBy,
        reason
    ) {

        if (!reason) {

            throw new Error(
                "Suspension reason is required."
            );

        }


        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'SUSPENDED',
                    internal_remarks = ?,
                    updated_by = ?

                WHERE volunteer_code = ?

                AND status = 'ACTIVE'
                `,
                [
                    reason,
                    updatedBy || 1,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }


    /*
    |--------------------------------------------------------------------------
    | Archive Volunteer
    |--------------------------------------------------------------------------
    */

    async archiveVolunteer(
        volunteerCode,
        archivedBy
    ) {

        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'ARCHIVED',
                    archived_by = ?,
                    archived_at = NOW(),
                    updated_by = ?

                WHERE volunteer_code = ?

                AND status <> 'ARCHIVED'
                `,
                [
                    archivedBy || 1,
                    archivedBy || 1,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }


    /*
    |--------------------------------------------------------------------------
    | Restore Volunteer
    |--------------------------------------------------------------------------
    */

    async restoreVolunteer(
        volunteerCode,
        updatedBy
    ) {

        const [result] =
            await db.execute(
                `
                UPDATE volunteers

                SET
                    status = 'INACTIVE',
                    archived_by = NULL,
                    archived_at = NULL,
                    updated_by = ?

                WHERE volunteer_code = ?

                AND status = 'ARCHIVED'
                `,
                [
                    updatedBy || 1,
                    volunteerCode
                ]
            );


        return result.affectedRows;

    }

    /*
|--------------------------------------------------------------------------
| List Volunteers
|--------------------------------------------------------------------------
*/

async listVolunteers(filters = {}) {

    const {
        page = 1,
        limit = 20,
        search = "",
        status = "",
        application_source = "",
        city = "",
        district = "",
        volunteer_type = ""
    } = filters;


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const safePage =
        Math.max(
            Number(page) || 1,
            1
        );

    const safeLimit =
        Math.min(
            Math.max(
                Number(limit) || 20,
                1
            ),
            100
        );

    const offset =
        (safePage - 1) * safeLimit;


    /*
    |--------------------------------------------------------------------------
    | WHERE Conditions
    |--------------------------------------------------------------------------
    */

    const conditions = [];

    const params = [];


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if (status) {

        conditions.push(
            "v.status = ?"
        );

        params.push(status);

    }


    /*
    |--------------------------------------------------------------------------
    | Application Source
    |--------------------------------------------------------------------------
    */

    if (application_source) {

        conditions.push(
            "v.application_source = ?"
        );

        params.push(
            application_source
        );

    }


    /*
    |--------------------------------------------------------------------------
    | City
    |--------------------------------------------------------------------------
    */

    if (city) {

        conditions.push(
            "v.city = ?"
        );

        params.push(city);

    }


    /*
    |--------------------------------------------------------------------------
    | District
    |--------------------------------------------------------------------------
    */

    if (district) {

        conditions.push(
            "v.district = ?"
        );

        params.push(district);

    }


    /*
    |--------------------------------------------------------------------------
    | Volunteer Type
    |--------------------------------------------------------------------------
    */

    if (volunteer_type) {

        conditions.push(
            "v.volunteer_type = ?"
        );

        params.push(volunteer_type);

    }


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    |
    | We intentionally DO NOT search encrypted email/mobile directly.
    |
    | For now search:
    | - volunteer code
    | - name
    | - city
    | - district
    | - area of interest
    |
    |--------------------------------------------------------------------------
    */

    if (
        search &&
        search.trim()
    ) {

        const searchValue =
            `%${search.trim()}%`;

        conditions.push(`
            (
                v.volunteer_code LIKE ?
                OR v.full_name LIKE ?
                OR v.city LIKE ?
                OR v.district LIKE ?
                OR v.area_of_interest LIKE ?
            )
        `);

        params.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );

    }


    /*
    |--------------------------------------------------------------------------
    | WHERE Clause
    |--------------------------------------------------------------------------
    */

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */

    const countSql = `
        SELECT COUNT(*) AS total
        FROM volunteers v
        ${whereClause}
    `;

    const [countRows] =
        await db.query(
            countSql,
            params
        );

    const total =
        Number(
            countRows[0]?.total || 0
        );


    /*
    |--------------------------------------------------------------------------
    | Fetch Records
    |--------------------------------------------------------------------------
    */

    const dataSql = `
        SELECT
            v.id,
            v.volunteer_code,
            v.full_name,

            v.city,
            v.district,
            v.state,

            v.area_of_interest,

            v.profile_completion_percent,

            v.volunteer_type,
            v.status,

            v.aadhaar_verified,
            v.email_verified,
            v.mobile_verified,

            v.application_source,

            v.created_at,
            v.updated_at,

            v.approved_at,
            v.activated_at

        FROM volunteers v

        ${whereClause}

        ORDER BY
            CASE
                WHEN v.status = 'PENDING'
                THEN 0
                ELSE 1
            END,

            v.created_at DESC

        LIMIT ?
        OFFSET ?
    `;


    const dataParams = [
        ...params,
        safeLimit,
        offset
    ];


    const [rows] =
        await db.query(
            dataSql,
            dataParams
        );


    /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

    return {

        data: rows,

        pagination: {

            page: safePage,

            limit: safeLimit,

            total,

            totalPages:
                Math.ceil(
                    total / safeLimit
                )

        }

    };

}
async checkAadhaarDuplicate(aadhaarHash, volunteerCode = null) {
    if (!aadhaarHash) {
        return null;
    }

    let sql = `
        SELECT
            id,
            volunteer_code,
            status
        FROM volunteers
        WHERE aadhaar_hash = ?
    `;

    const params = [aadhaarHash];

    if (volunteerCode) {
        sql += `
            AND volunteer_code <> ?
        `;

        params.push(volunteerCode);
    }

    sql += `
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, params);

    return rows[0] || null;
}

async updateProfile(
    volunteerCode,
    data
) {

    if (
        !volunteerCode ||
        !data
    ) {
        return false;
    }


    const allowedFields = [
        "full_name",
        "date_of_birth",
        "gender",

        "address_line1",
        "address_line2",
        "city",
        "district",
        "state",
        "pincode",

        "highest_qualification",
        "course",
        "profession",
        "organization",
        "years_of_experience",

        "primary_interest",
        "secondary_interest",
        "skills",
        "languages_known",
        "previous_volunteer_experience",

        "availability_weekdays",
        "availability_weekends",
        "availability_evenings",

        "preferred_mode",

        "emergency_contact_name",
        "emergency_contact_relationship",
        "emergency_contact_mobile",

        "volunteer_type",
        "short_bio",

        "aadhaar_encrypted",
        "aadhaar_hash",
        "aadhaar_verified",

        "updated_by",
    ];


    const fields = [];
    const values = [];


    for (
        const field
        of allowedFields
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                data,
                field
            )
        ) {

            fields.push(
                `${field} = ?`
            );

            values.push(
                data[field]
            );

        }

    }


    if (fields.length === 0) {
        return false;
    }


    values.push(
        volunteerCode
    );


    const sql = `
        UPDATE volunteers
        SET
            ${fields.join(", ")}
        WHERE volunteer_code = ?
        LIMIT 1
    `;


    const [
        result
    ] = await db.execute(
        sql,
        values
    );


    return result.affectedRows > 0;

}
async updateCompletionPercent(
    volunteerCode,
    percentage
) {

    if (!volunteerCode) {
        return false;
    }

    const safePercentage =
        Math.min(
            Math.max(
                Number(percentage) || 0,
                0
            ),
            100
        );

    const [result] =
        await db.execute(
            `
            UPDATE volunteers
            SET profile_completion_percent = ?
            WHERE volunteer_code = ?
            LIMIT 1
            `,
            [
                safePercentage,
                volunteerCode
            ]
        );

    return result.affectedRows > 0;
}
}


/*
|--------------------------------------------------------------------------
| Export Singleton
|--------------------------------------------------------------------------
*/

module.exports =
    new VolunteerModel();