const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| Volunteer Security Utility
|--------------------------------------------------------------------------
|
| Handles:
|
| 1. AES-256-GCM encryption
| 2. AES-256-GCM decryption
| 3. HMAC-SHA256 blind indexes
| 4. Email normalization
| 5. Mobile normalization
| 6. Aadhaar normalization
| 7. Sensitive-data masking
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Environment Keys
|--------------------------------------------------------------------------
*/

const ENCRYPTION_KEY = process.env.VOLUNTEER_ENCRYPTION_KEY;
const HASH_KEY = process.env.VOLUNTEER_HASH_KEY;


/*
|--------------------------------------------------------------------------
| Validate Security Configuration
|--------------------------------------------------------------------------
*/

function getEncryptionKey() {

    if (!ENCRYPTION_KEY) {

        throw new Error(
            "VOLUNTEER_ENCRYPTION_KEY is not configured."
        );

    }

    const key = Buffer.from(
        ENCRYPTION_KEY,
        "base64"
    );

    if (key.length !== 32) {

        throw new Error(
            "VOLUNTEER_ENCRYPTION_KEY must decode to exactly 32 bytes."
        );

    }

    return key;
}


function getHashKey() {

    if (!HASH_KEY) {

        throw new Error(
            "VOLUNTEER_HASH_KEY is not configured."
        );

    }

    const key = Buffer.from(
        HASH_KEY,
        "base64"
    );

    if (key.length !== 32) {

        throw new Error(
            "VOLUNTEER_HASH_KEY must decode to exactly 32 bytes."
        );

    }

    return key;
}


/*
|--------------------------------------------------------------------------
| Normalize Email
|--------------------------------------------------------------------------
*/

function normalizeEmail(email) {

    if (
        email === undefined ||
        email === null
    ) {

        return null;

    }

    const normalized = String(email)
        .trim()
        .toLowerCase();

    return normalized || null;
}


/*
|--------------------------------------------------------------------------
| Normalize Mobile
|--------------------------------------------------------------------------
|
| Current project is India-focused.
|
| Examples:
|
| +91 98765 43210
| +919876543210
| 98765-43210
|
| become:
|
| 9876543210
|
|--------------------------------------------------------------------------
*/

function normalizeMobile(mobile) {

    if (
        mobile === undefined ||
        mobile === null
    ) {

        return null;

    }

    let normalized = String(mobile)
        .trim()
        .replace(/\D/g, "");

    /*
    | Remove Indian country code
    */

    if (
        normalized.length === 12 &&
        normalized.startsWith("91")
    ) {

        normalized = normalized.substring(2);

    }

    return normalized || null;
}


/*
|--------------------------------------------------------------------------
| Normalize Aadhaar
|--------------------------------------------------------------------------
*/

function normalizeAadhaar(aadhaar) {

    if (
        aadhaar === undefined ||
        aadhaar === null
    ) {

        return null;

    }

    const normalized = String(aadhaar)
        .replace(/\D/g, "");

    if (!normalized) {

        return null;

    }

    return normalized;
}


/*
|--------------------------------------------------------------------------
| Validate Aadhaar
|--------------------------------------------------------------------------
*/

function validateAadhaar(aadhaar) {

    const normalized =
        normalizeAadhaar(aadhaar);

    if (!normalized) {

        return {
            valid: false,
            message: "Aadhaar number is required."
        };

    }

    if (!/^\d{12}$/.test(normalized)) {

        return {
            valid: false,
            message:
                "Aadhaar number must contain exactly 12 digits."
        };

    }

    return {
        valid: true,
        value: normalized
    };
}


/*
|--------------------------------------------------------------------------
| AES-256-GCM Encryption
|--------------------------------------------------------------------------
|
| Stored format:
|
| v1:IV:AUTH_TAG:CIPHERTEXT
|
|--------------------------------------------------------------------------
*/

function encryptSensitive(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return null;

    }

    const key = getEncryptionKey();

    /*
    | 12-byte IV is recommended for GCM.
    */

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        key,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(
            String(value),
            "utf8"
        ),
        cipher.final()
    ]);

    const authTag =
        cipher.getAuthTag();

    return [
        "v1",
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64")
    ].join(":");
}


/*
|--------------------------------------------------------------------------
| AES-256-GCM Decryption
|--------------------------------------------------------------------------
*/

function decryptSensitive(encryptedValue) {

    if (
        !encryptedValue
    ) {

        return null;

    }

    const parts =
        String(encryptedValue).split(":");

    if (parts.length !== 4) {

        throw new Error(
            "Invalid encrypted volunteer data format."
        );

    }

    const [
        version,
        ivBase64,
        authTagBase64,
        encryptedBase64
    ] = parts;

    if (version !== "v1") {

        throw new Error(
            "Unsupported volunteer encryption version."
        );

    }

    const key = getEncryptionKey();

    const iv =
        Buffer.from(ivBase64, "base64");

    const authTag =
        Buffer.from(authTagBase64, "base64");

    const encrypted =
        Buffer.from(
            encryptedBase64,
            "base64"
        );

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        iv
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}


/*
|--------------------------------------------------------------------------
| HMAC Blind Index
|--------------------------------------------------------------------------
|
| Used for duplicate detection.
|
| IMPORTANT:
|
| We do NOT use normal SHA-256 here.
|
| HMAC prevents someone who gets the database
| from easily generating matching values.
|
|--------------------------------------------------------------------------
*/

function createBlindIndex(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return null;

    }

    const key = getHashKey();

    return crypto
        .createHmac(
            "sha256",
            key
        )
        .update(
            String(value),
            "utf8"
        )
        .digest("hex");
}


/*
|--------------------------------------------------------------------------
| Email Blind Index
|--------------------------------------------------------------------------
*/

function createEmailHash(email) {

    const normalized =
        normalizeEmail(email);

    if (!normalized) {

        return null;

    }

    return createBlindIndex(
        normalized
    );
}


/*
|--------------------------------------------------------------------------
| Mobile Blind Index
|--------------------------------------------------------------------------
*/

function createMobileHash(mobile) {

    const normalized =
        normalizeMobile(mobile);

    if (!normalized) {

        return null;

    }

    return createBlindIndex(
        normalized
    );
}


/*
|--------------------------------------------------------------------------
| Aadhaar Blind Index
|--------------------------------------------------------------------------
*/

function createAadhaarHash(aadhaar) {

    const normalized =
        normalizeAadhaar(aadhaar);

    if (!normalized) {

        return null;

    }

    return createBlindIndex(
        normalized
    );
}


/*
|--------------------------------------------------------------------------
| Mask Aadhaar
|--------------------------------------------------------------------------
|
| 123456789012
|
| becomes:
|
| XXXX XXXX 9012
|
|--------------------------------------------------------------------------
*/

function maskAadhaar(aadhaar) {

    if (!aadhaar) {

        return null;

    }

    const normalized =
        normalizeAadhaar(aadhaar);

    if (
        normalized.length < 4
    ) {

        return "XXXX";

    }

    const lastFour =
        normalized.slice(-4);

    return `XXXX XXXX ${lastFour}`;
}


/*
|--------------------------------------------------------------------------
| Mask Mobile
|--------------------------------------------------------------------------
|
| 9876543210
|
| becomes:
|
| ******3210
|
|--------------------------------------------------------------------------
*/

function maskMobile(mobile) {

    if (!mobile) {

        return null;

    }

    const normalized =
        normalizeMobile(mobile);

    if (
        normalized.length < 4
    ) {

        return "****";

    }

    const lastFour =
        normalized.slice(-4);

    return `******${lastFour}`;
}


/*
|--------------------------------------------------------------------------
| Mask Email
|--------------------------------------------------------------------------
|
| suresh@gmail.com
|
| becomes:
|
| s****h@gmail.com
|
|--------------------------------------------------------------------------
*/

function maskEmail(email) {

    if (!email) {

        return null;

    }

    const normalized =
        normalizeEmail(email);

    const parts =
        normalized.split("@");

    if (parts.length !== 2) {

        return "****";

    }

    const username = parts[0];
    const domain = parts[1];

    if (username.length <= 2) {

        return `**@${domain}`;

    }

    return (
        `${username.charAt(0)}` +
        `${"*".repeat(
            Math.max(
                username.length - 2,
                1
            )
        )}` +
        `${username.charAt(
            username.length - 1
        )}` +
        `@${domain}`
    );
}


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    normalizeEmail,

    normalizeMobile,

    normalizeAadhaar,

    validateAadhaar,

    encryptSensitive,

    decryptSensitive,

    createBlindIndex,

    createEmailHash,

    createMobileHash,

    createAadhaarHash,

    maskAadhaar,

    maskMobile,

    maskEmail

};