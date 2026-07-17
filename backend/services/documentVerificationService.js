const { verifyAadhaar } = require("./ocr/aadhaarVerifier");

const verifyDocuments = async (files, student) => {
  const verificationResults = {};

  if (files.aadhaar) {
    verificationResults.aadhaar = await verifyAadhaar(
      files.aadhaar[0].path,
      {
        aadhaarNumber: student.aadhaar,
        fullName: student.student_name,
        dateOfBirth: student.dob,
        gender: student.gender,
      }
    );
  }

  return verificationResults;
};

module.exports = {
  verifyDocuments,
};