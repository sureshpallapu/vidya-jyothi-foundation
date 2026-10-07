require("dotenv").config();

const {
    encryptSensitive,
    decryptSensitive,
    createEmailHash,
    createMobileHash,
    createAadhaarHash,
    normalizeEmail,
    normalizeMobile,
    normalizeAadhaar,
    maskAadhaar,
    maskMobile,
    maskEmail
} = require("./utils/volunteerSecurity");

console.log("====================================");
console.log("VOLUNTEER SECURITY TEST");
console.log("====================================");

try {

    // EMAIL
    const email = "  Suresh@Gmail.COM  ";
    const normalizedEmail = normalizeEmail(email);

    console.log("\nEMAIL");
    console.log("Normalized:", normalizedEmail);
    console.log("Hash:", createEmailHash(email));
    console.log("Masked:", maskEmail(email));


    // MOBILE
    const mobile = "+91 98765 43210";
    const normalizedMobile = normalizeMobile(mobile);

    console.log("\nMOBILE");
    console.log("Normalized:", normalizedMobile);
    console.log("Hash:", createMobileHash(mobile));
    console.log("Masked:", maskMobile(mobile));


    // AADHAAR
    const aadhaar = "1234 5678 9012";
    const normalizedAadhaar = normalizeAadhaar(aadhaar);

    console.log("\nAADHAAR");
    console.log("Normalized:", normalizedAadhaar);
    console.log("Hash:", createAadhaarHash(aadhaar));
    console.log("Masked:", maskAadhaar(aadhaar));


    // ENCRYPTION
    console.log("\nENCRYPTION");

    const encrypted =
        encryptSensitive(normalizedAadhaar);

    console.log(
        "Encrypted:",
        encrypted
    );


    // DECRYPTION
    console.log("\nDECRYPTION");

    const decrypted =
        decryptSensitive(encrypted);

    console.log(
        "Decrypted:",
        decrypted
    );


    // CHECKS
    const emailPassed =
        normalizedEmail === "suresh@gmail.com";

    const mobilePassed =
        normalizedMobile === "9876543210";

    const aadhaarPassed =
        normalizedAadhaar === "123456789012";

    const encryptionPassed =
        decrypted === normalizedAadhaar;


    console.log("\n====================================");
    console.log("SECURITY TEST RESULTS");
    console.log("====================================");

    console.log(
        "Email normalization:",
        emailPassed ? "PASS" : "FAIL"
    );

    console.log(
        "Mobile normalization:",
        mobilePassed ? "PASS" : "FAIL"
    );

    console.log(
        "Aadhaar normalization:",
        aadhaarPassed ? "PASS" : "FAIL"
    );

    console.log(
        "Aadhaar encryption/decryption:",
        encryptionPassed ? "PASS" : "FAIL"
    );

    console.log("====================================");

    if (
        emailPassed &&
        mobilePassed &&
        aadhaarPassed &&
        encryptionPassed
    ) {

        console.log(
            "🎉 VOLUNTEER SECURITY TEST PASSED"
        );

    } else {

        console.log(
            "❌ VOLUNTEER SECURITY TEST FAILED"
        );

        process.exitCode = 1;
    }

    console.log("====================================");

} catch (error) {

    console.error("\n❌ SECURITY TEST ERROR");
    console.error(error.message);
    console.error(error.stack);

    process.exitCode = 1;
}