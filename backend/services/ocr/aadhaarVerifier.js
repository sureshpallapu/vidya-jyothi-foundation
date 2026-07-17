const { extractText } = require("./ocrService");

const {
  cleanText,
  extractAadhaarNumber,
  extractDOB,
  extractGender,
  extractFatherName,
  extractPinCode,
  extractName,
} = require("./aadhaarParser");

/**
 * Normalize strings for comparison
 */
const normalize = (value) => {
  return value
    ? value
        .toString()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
    : "";
};

/**
 * Normalize Aadhaar Number
 */
const normalizeAadhaar = (value) => {
  return value
    ? value.toString().replace(/\D/g, "")
    : "";
};

/**
 * Normalize Date
 *
 * Converts different date formats into YYYY-MM-DD.
 *
 * Supports:
 * 14/12/2000
 * 2000-12-14
 * JavaScript Date objects
 */
const normalizeDate = (value) => {
  if (!value) {
    return "";
  }

  // Handle JavaScript Date object
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return "";
    }

    const year = value.getFullYear();
    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      value.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const dateString = value
    .toString()
    .trim();

  // OCR format: DD/MM/YYYY
  const ddmmyyyy =
    dateString.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

  if (ddmmyyyy) {
    const [, day, month, year] =
      ddmmyyyy;

    return `${year}-${month}-${day}`;
  }

  // Database/string format: YYYY-MM-DD
  const yyyymmdd =
    dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (yyyymmdd) {
    return dateString;
  }

  // Handle ISO date:
  // 2000-12-14T00:00:00.000Z
  const isoDate =
    dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})T/
    );

  if (isoDate) {
    return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  }

  return "";
};

/**
 * Verify Aadhaar Document
 */
const verifyAadhaar = async (
  filePath,
  studentData
) => {

  /*
  |--------------------------------------------------------------------------
  | Run OCR
  |--------------------------------------------------------------------------
  */

  const rawText =
    await extractText(filePath);

  const text =
    cleanText(rawText);

  /*
  |--------------------------------------------------------------------------
  | Extract Aadhaar Fields
  |--------------------------------------------------------------------------
  */

  const aadhaarNumber =
    extractAadhaarNumber(text);

  const dob =
    extractDOB(text);

  const gender =
    extractGender(text);

  const fatherName =
    extractFatherName(rawText);

  const pinCode =
    extractPinCode(rawText);

  const name =
    extractName(rawText);

  /*
  |--------------------------------------------------------------------------
  | Detect Aadhaar Document
  |--------------------------------------------------------------------------
  */

  const isAadhaar =
    /Government of India/i.test(text) ||
    /Unique Identification Authority/i.test(
      text
    ) ||
    /AADHAAR/i.test(text);

  /*
  |--------------------------------------------------------------------------
  | Compare Aadhaar Number
  |--------------------------------------------------------------------------
  */

  const aadhaarMatched =
    normalizeAadhaar(aadhaarNumber) !== "" &&
    normalizeAadhaar(aadhaarNumber) ===
      normalizeAadhaar(
        studentData.aadhaarNumber
      );

  /*
  |--------------------------------------------------------------------------
  | Compare Name
  |--------------------------------------------------------------------------
  */

  const nameMatched =
    normalize(name) !== "" &&
    normalize(name) ===
      normalize(studentData.fullName);

  /*
  |--------------------------------------------------------------------------
  | Compare DOB
  |--------------------------------------------------------------------------
  */

  const extractedDOB =
    normalizeDate(dob);

  const applicationDOB =
    normalizeDate(
      studentData.dateOfBirth
    );

  const dobMatched =
    extractedDOB !== "" &&
    extractedDOB === applicationDOB;

  /*
  |--------------------------------------------------------------------------
  | Compare Gender
  |--------------------------------------------------------------------------
  */

  const genderMatched =
    normalize(gender) !== "" &&
    normalize(gender) ===
      normalize(studentData.gender);

  /*
  |--------------------------------------------------------------------------
  | Overall Verification
  |--------------------------------------------------------------------------
  */

  const overallVerified =
    isAadhaar &&
    aadhaarMatched &&
    nameMatched &&
    dobMatched &&
    genderMatched;

  /*
  |--------------------------------------------------------------------------
  | Debug Logs
  |--------------------------------------------------------------------------
  */

  console.log(
    "===== AADHAAR VERIFICATION ====="
  );

  console.log(
    "Is Aadhaar:",
    isAadhaar
  );

  console.log(
    "Aadhaar:",
    aadhaarNumber,
    "vs",
    studentData.aadhaarNumber
  );

  console.log(
    "Name:",
    name,
    "vs",
    studentData.fullName
  );

  console.log(
    "DOB:",
    dob,
    "->",
    extractedDOB,
    "vs",
    studentData.dateOfBirth,
    "->",
    applicationDOB
  );

  console.log(
    "Gender:",
    gender,
    "vs",
    studentData.gender
  );

  console.log(
    "Overall Verified:",
    overallVerified
  );

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    success: true,

    isAadhaar,

    documentType:
      isAadhaar
        ? "AADHAAR"
        : "UNKNOWN",

    extracted: {
      aadhaarNumber,
      name,
      fatherName,
      dob,
      gender,
      pinCode,
    },

    verification: {
      aadhaarMatched,
      nameMatched,
      dobMatched,
      genderMatched,
    },

    overallVerified,

    rawText,
  };
};

module.exports = {
  verifyAadhaar,
};