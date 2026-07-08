export const validatePersonalDetails = (formData) => {
  const errors = {};

  // Student Name
  if (!formData.studentName.trim()) {
    errors.studentName = "Student Name is required.";
  }

  // Mobile
  if (!formData.mobile.trim()) {
    errors.mobile = "Mobile Number is required.";
  } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  // Aadhaar
  if (!formData.aadhaar.trim()) {
    errors.aadhaar = "Aadhaar Number is required.";
  } else if (!/^\d{12}$/.test(formData.aadhaar)) {
    errors.aadhaar = "Aadhaar Number must be 12 digits.";
  }

  // Email (optional)
  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};


export const validateAddressDetails = (formData) => {
  const errors = {};

  if (!formData.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!formData.district.trim()) {
    errors.district = "District is required.";
  }

  if (!formData.state.trim()) {
    errors.state = "State is required.";
  }

  if (!formData.pincode.trim()) {
    errors.pincode = "PIN Code is required.";
  } else if (!/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = "PIN Code must be 6 digits.";
  }

  return errors;
};


export const validateEducationDetails = (formData) => {
  const errors = {};

  if (!formData.collegeName.trim()) {
    errors.collegeName = "College Name is required.";
  }

  if (!formData.course.trim()) {
    errors.course = "Course is required.";
  }

  if (!formData.studyYear.trim()) {
    errors.studyYear = "Study Year is required.";
  }

  if (!formData.previousQualification.trim()) {
    errors.previousQualification =
      "Previous Qualification is required.";
  }

  if (!formData.previousPercentage) {
    errors.previousPercentage =
      "Previous Percentage is required.";
  } else {
    const percentage = Number(formData.previousPercentage);

    if (percentage < 0 || percentage > 100) {
      errors.previousPercentage =
        "Percentage must be between 0 and 100.";
    }
  }

  return errors;
};



export const validateBankDetails = (formData) => {
  const errors = {};

  if (!formData.bankName.trim()) {
    errors.bankName = "Bank Name is required.";
  }

  if (!formData.accountNumber.trim()) {
    errors.accountNumber = "Account Number is required.";
  }

  if (!formData.confirmAccountNumber.trim()) {
    errors.confirmAccountNumber =
      "Please confirm the Account Number.";
  } else if (
    formData.accountNumber !==
    formData.confirmAccountNumber
  ) {
    errors.confirmAccountNumber =
      "Account Numbers do not match.";
  }

  if (!formData.ifscCode.trim()) {
    errors.ifscCode = "IFSC Code is required.";
  } else if (
    !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
      formData.ifscCode.toUpperCase()
    )
  ) {
    errors.ifscCode = "Enter a valid IFSC Code.";
  }

  return errors;
};


export const validateDocumentUpload = (
  formData
) => {

  const errors = {};

  if (!formData.documents.photo)
    errors.photo = "Student Photo is required.";

  if (!formData.documents.aadhaar)
    errors.aadhaar = "Aadhaar Card is required.";

  if (!formData.documents.marksMemo)
    errors.marksMemo = "Previous Marks Memo is required.";

  if (!formData.documents.passbook)
    errors.passbook = "Bank Passbook is required.";

  return errors;

};


export const validateDeclaration = (
  formData
) => {

  const errors = {};

  if (!formData.studentPlace.trim()) {

    errors.studentPlace =
      "Place is required.";

  }

  if (!formData.studentDate) {

    errors.studentDate =
      "Date is required.";

  }

  if (!formData.declarationAccepted) {

    errors.declarationAccepted =
      "Please accept the declaration.";

  }

  return errors;

};