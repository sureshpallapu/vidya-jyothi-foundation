const generateApplicationId = require("../utils/generateApplicationId");

const {
  createApplication,
  checkDuplicateApplication,
  getApplicationStatus,
} = require("../models/scholarshipModel");

// Convert empty string to NULL
const emptyToNull = (value) => {
  return value === "" || value === undefined ? null : value;
};

// Convert empty string to Number or NULL
const numberOrNull = (value) => {
  return value === "" || value === undefined
    ? null
    : Number(value);
};

const createScholarshipApplication = async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      motherName,
      dob,
      gender,
      mobile,
      email,
      aadhaar,
      photoUrl,

      address,
      district,
      state,
      pincode,

      collegeName,
      course,
      studyYear,
      previousQualification,
      previousPercentage,

      annualFamilyIncome,
      sanctionedAmount,
      scholarshipPurpose,

      bankName,
      accountNumber,
      ifscCode,

      applicationSource = "ONLINE",
    } = req.body;

    // Required Validation
    if (!studentName || !mobile || !aadhaar) {
      return res.status(400).json({
        success: false,
        message:
          "Student Name, Mobile and Aadhaar are required.",
      });
    }

    // Generate Application Number
    const application = await generateApplicationId();

    // Check Duplicate Application
    const duplicate = await checkDuplicateApplication(
      aadhaar,
      mobile,
      application.cycleId
    );

    if (duplicate.length > 0) {
      if (duplicate[0].aadhaar === aadhaar) {
        return res.status(409).json({
          success: false,
          message:
            "An application with this Aadhaar already exists for the current scholarship cycle.",
        });
      }

      if (duplicate[0].mobile === mobile) {
        return res.status(409).json({
          success: false,
          message:
            "An application with this Mobile Number already exists for the current scholarship cycle.",
        });
      }
    }

    // Prepare Clean Data
    const applicationData = {
      applicationId: application.applicationId,
      applicationSequence: application.applicationSequence,
      cycleId: application.cycleId,

      applicationSource,

      studentName,
      fatherName: emptyToNull(fatherName),
      motherName: emptyToNull(motherName),

      dob: emptyToNull(dob),
      gender: emptyToNull(gender),

      mobile,
      email: emptyToNull(email),
      aadhaar,

      photoUrl: emptyToNull(photoUrl),

      address: emptyToNull(address),
      district: emptyToNull(district),
      state: emptyToNull(state),
      pincode: emptyToNull(pincode),

      collegeName: emptyToNull(collegeName),
      course: emptyToNull(course),
      studyYear: emptyToNull(studyYear),

      previousQualification: emptyToNull(
        previousQualification
      ),

      previousPercentage: numberOrNull(
        previousPercentage
      ),

      annualFamilyIncome: numberOrNull(
        annualFamilyIncome
      ),

      sanctionedAmount: numberOrNull(
        sanctionedAmount
      ),

      scholarshipPurpose: emptyToNull(
        scholarshipPurpose
      ),

      bankName: emptyToNull(bankName),
      accountNumber: emptyToNull(accountNumber),
      ifscCode: emptyToNull(ifscCode),
    };

    const result = await createApplication(
      applicationData
    );

    res.status(201).json({
      success: true,
      message:
        "Scholarship Application Submitted Successfully",
      applicationId: application.applicationId,
      id: result.insertId,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Check Scholarship Application Status
 */
const checkApplicationStatus = async (req, res) => {
  try {

    const {
      applicationId,
      aadhaar,
    } = req.body;

    // Validation
    if (!applicationId || !aadhaar) {
      return res.status(400).json({
        success: false,
        message: "Application Number and Aadhaar are required.",
      });
    }

    const result = await getApplicationStatus(
      applicationId,
      aadhaar
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: result[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createScholarshipApplication,
  checkApplicationStatus,
};