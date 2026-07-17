import { useState } from "react";

import FormSection from "../common/FormSection";
import FormFileInput from "../common/FormFileInput";

import scholarshipDocuments from "../../data/scholarshipDocuments";

function DocumentUpload({
  formData,
  setFormData,
  errors,
  aadhaarVerifying,
  setAadhaarVerifying,
}) {
  /*
  |--------------------------------------------------------------------------
  | Aadhaar OCR Verification State
  |--------------------------------------------------------------------------
  */



  const [aadhaarVerification, setAadhaarVerification] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Verify Aadhaar Document
  |--------------------------------------------------------------------------
  */

  const verifyAadhaarDocument = async (file) => {
    try {
      setAadhaarVerifying(true);

      setAadhaarVerification({
        status: "VERIFYING",
        message:
          "Scanning and verifying Aadhaar document. Please wait...",
      });

      /*
      |--------------------------------------------------------------------------
      | Prepare FormData
      |--------------------------------------------------------------------------
      */

      const data = new FormData();

      data.append("document", file);

      data.append(
        "aadhaar",
        formData.aadhaar || ""
      );

      data.append(
        "studentName",
        formData.studentName || ""
      );

      data.append(
        "dob",
        formData.dob || ""
      );

      data.append(
        "gender",
        formData.gender || ""
      );

      /*
      |--------------------------------------------------------------------------
      | Call Aadhaar Verification API
      |--------------------------------------------------------------------------
      |
      | Change this URL if your backend API URL is different.
      |
      |--------------------------------------------------------------------------
      */

      const response = await fetch(
        "http://localhost:5000/api/ocr/verify-aadhaar",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      /*
      |--------------------------------------------------------------------------
      | Handle HTTP Error
      |--------------------------------------------------------------------------
      */

      if (!response.ok) {
        setAadhaarVerification({
          status: "ERROR",
          message:
            result.message ||
            "Unable to verify Aadhaar document.",
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Store Verification Result
      |--------------------------------------------------------------------------
      */

      setAadhaarVerification({
        status: result.verificationStatus,
        verified: result.verified,
        message: result.message,
        extracted: result.extracted,
        verification: result.verification,
      });

      /*
      |--------------------------------------------------------------------------
      | Optional: Store Verification Inside Main Form Data
      |--------------------------------------------------------------------------
      |
      | This lets the parent form know whether Aadhaar verification succeeded.
      |
      |--------------------------------------------------------------------------
      */

      setFormData((prev) => ({
        ...prev,

        aadhaarVerification: {
          status: result.verificationStatus,
          verified: result.verified,
          extracted: result.extracted,
          verification: result.verification,
        },
      }));

    } catch (error) {
      console.error(
        "Aadhaar verification error:",
        error
      );

      setAadhaarVerification({
        status: "ERROR",
        message:
          "Unable to verify Aadhaar document. Please try again.",
      });

    } finally {
      setAadhaarVerifying(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Handle File Selection
  |--------------------------------------------------------------------------
  */

  const handleFileChange = async (e) => {
    const { name } = e.target;

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Save Selected File
    |--------------------------------------------------------------------------
    */

    setFormData((prev) => ({
      ...prev,

      documents: {
        ...prev.documents,

        [name]: file,
      },
    }));

    /*
    |--------------------------------------------------------------------------
    | Aadhaar Selected
    |--------------------------------------------------------------------------
    |
    | Run instant OCR verification only for Aadhaar.
    |
    |--------------------------------------------------------------------------
    */

    if (name === "aadhaar") {

      /*
      |----------------------------------------------------------------------
      | Make sure Aadhaar number is entered first
      |----------------------------------------------------------------------
      */

      const aadhaarNumber = (
        formData.aadhaar || ""
      ).replace(/\s/g, "");

      if (!/^\d{12}$/.test(aadhaarNumber)) {
        setAadhaarVerification({
          status: "ERROR",
          message:
            "Please enter a valid 12-digit Aadhaar number before uploading the Aadhaar document.",
        });

        return;
      }

      /*
      |----------------------------------------------------------------------
      | Start OCR Verification
      |----------------------------------------------------------------------
      */

      await verifyAadhaarDocument(file);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Verification Message UI
  |--------------------------------------------------------------------------
  */

  const renderAadhaarVerification = () => {
    if (!aadhaarVerification) {
      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Scanning
    |--------------------------------------------------------------------------
    */

    if (
      aadhaarVerification.status ===
      "VERIFYING"
    ) {
      return (
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">
            Scanning Aadhaar Document...
          </p>

          <p className="mt-1">
            {aadhaarVerification.message}
          </p>
        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Successfully Verified
    |--------------------------------------------------------------------------
    */

    if (
      aadhaarVerification.status ===
      "VERIFIED"
    ) {
      return (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">

          <p className="font-semibold">
            ✓ Aadhaar Document Verified
          </p>

          <p className="mt-1">
            {aadhaarVerification.message}
          </p>

        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Details Mismatch
    |--------------------------------------------------------------------------
    */

    if (
      aadhaarVerification.status ===
      "DETAILS_MISMATCH"
    ) {
      return (
        <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">

          <p className="font-semibold">
            ⚠ Aadhaar Details Mismatch
          </p>

          <p className="mt-1">
            {aadhaarVerification.message}
          </p>

        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Aadhaar Number Mismatch
    |--------------------------------------------------------------------------
    */

    if (
      aadhaarVerification.status ===
      "AADHAAR_MISMATCH"
    ) {
      return (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">

          <p className="font-semibold">
            ✕ Aadhaar Number Mismatch
          </p>

          <p className="mt-1">
            {aadhaarVerification.message}
          </p>

        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Invalid Document
    |--------------------------------------------------------------------------
    */

    if (
      aadhaarVerification.status ===
      "INVALID_DOCUMENT"
    ) {
      return (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">

          <p className="font-semibold">
            ✕ Invalid Aadhaar Document
          </p>

          <p className="mt-1">
            {aadhaarVerification.message}
          </p>

        </div>
      );
    }

    /*
    |--------------------------------------------------------------------------
    | General Error
    |--------------------------------------------------------------------------
    */

    return (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">

        <p className="font-semibold">
          Aadhaar Verification Failed
        </p>

        <p className="mt-1">
          {aadhaarVerification.message}
        </p>

      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <FormSection title="Upload Documents">

      <div className="grid gap-6">

        {scholarshipDocuments.map(
          (document) => (

            <div key={document.id}>

              <FormFileInput
                label={document.label}
                name={document.name}
                accept={document.accept}
                required={document.required}
                onChange={handleFileChange}
                error={errors[document.name]}
                disabled={
                  document.name === "aadhaar" &&
                  aadhaarVerifying
                }
              />

              {document.name === "aadhaar" &&
                renderAadhaarVerification()}

            </div>

          )
        )}

      </div>

    </FormSection>
  );
}

export default DocumentUpload;