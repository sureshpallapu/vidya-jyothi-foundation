import {
  validatePersonalDetails,
  validateAddressDetails,
  validateEducationDetails,
  validateBankDetails,
  validateDocumentUpload,
  validateDeclaration
} from "./validation";

const stepValidation = {
  1: validatePersonalDetails,
  2: validateAddressDetails,
  3: validateEducationDetails,
  4: validateBankDetails,
  5: validateDocumentUpload,
  6: validateDeclaration,
  7: () => ({}) // No validation needed for preview step
};

export default stepValidation;