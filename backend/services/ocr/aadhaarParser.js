/**
 * Clean OCR text
 */
const cleanText = (text) => {
  return text
    .replace(/\r/g, "")
    .replace(/[|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extract Aadhaar Number
 */
const extractAadhaarNumber = (text) => {
  const match = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  return match ? match[0].replace(/\s/g, "") : null;
};

/**
 * Extract DOB
 */
const extractDOB = (text) => {
  const match = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);

  return match ? match[0] : null;
};

/**
 * Extract Gender
 */
const extractGender = (text) => {
  const match = text.match(/\b(MALE|FEMALE|TRANSGENDER)\b/i);

  return match ? match[0].toUpperCase() : null;
};

/**
 * Extract Father's Name
 */
const extractFatherName = (text) => {
  const match = text.match(/(?:S\/O|D\/O|W\/O)\s+([A-Za-z.\s]+)/i);

  if (!match) return null;

  return match[1].trim();
};

/**
 * Extract PIN Code
 */
const extractPinCode = (text) => {
  const match = text.match(/\b\d{6}\b/);

  return match ? match[0] : null;
};

/**
 * Extract Name
 *
 * Aadhaar cards print the English name in Title Case (e.g. "Pallapu
 * Suresh"), while the surrounding OCR noise from the bilingual/Telugu
 * portion tends to come out as either all-lowercase fragments
 * ("dxostin", "seseis", "vk", "mat") or very short garbage ("Se").
 * Requiring a capital letter followed by at least 2 lowercase letters
 * filters that noise out, instead of accepting any alphabetic string.
 */
const extractName = (rawText) => {
  const lines = rawText
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  // Find the line containing DOB
  const dobIndex = lines.findIndex(line =>
    /DOB|\d{2}\/\d{2}\/\d{4}/i.test(line)
  );

  if (dobIndex === -1) return null;

  const NAME_WORD_PATTERN = /^[A-Z][a-z]{2,}$/;

  const EXCLUDED_WORDS = [
    "Government",
    "India",
    "Address",
    "Dob",
    "Male",
    "Female",
    "Aadhaar",
    "Authority",
    "Unique",
    "Identification",
    "Vid",
  ];

  // Look up to 3 lines above DOB
  for (let i = dobIndex - 1; i >= Math.max(0, dobIndex - 3); i--) {
    let line = lines[i];

    // Remove everything except letters and spaces
    line = line
      .replace(/[^A-Za-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Split into words
    const words = line.split(" ");

    // Keep only properly Title-Cased words (real printed names), which
    // excludes lowercase/short OCR noise from the Telugu-transliterated
    // portion of the card without needing to guess every garbage token.
    const validWords = words.filter(
      word =>
        NAME_WORD_PATTERN.test(word) &&
        !EXCLUDED_WORDS.includes(word)
    );

    if (validWords.length >= 2) {
      return validWords.join(" ");
    }
  }

  return null;
};

module.exports = {
  cleanText,
  extractAadhaarNumber,
  extractDOB,
  extractGender,
  extractFatherName,
  extractPinCode,
  extractName,
};