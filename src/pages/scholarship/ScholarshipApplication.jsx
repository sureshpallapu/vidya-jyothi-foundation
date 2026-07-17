import { useState } from "react";
import { useNavigate } from "react-router-dom";
import scholarshipInitialData from "../../data/scholarshipInitialData";
import scholarshipSteps from "../../data/scholarshipSteps";

import ProgressBar from "../../components/scholarship/ProgressBar";
import StepNavigation from "../../components/scholarship/StepNavigation";

import stepValidation from "../../utils/stepValidation";
import {
  submitApplication,
  uploadScholarshipDocuments,
} from "../../api/scholarshipApi";

import { Link } from "react-router-dom";



function ScholarshipApplication() {

  const navigate = useNavigate();

const [loading, setLoading] = useState(false);

// Aadhaar OCR processing state
const [aadhaarVerifying, setAadhaarVerifying] =
  useState(false);

// Current Active Step
const [currentStep, setCurrentStep] = useState(1);

  // Complete Scholarship Form
  const [formData, setFormData] = useState(
    scholarshipInitialData
  );

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Current Step Component
  const CurrentStepComponent =
    scholarshipSteps[currentStep - 1].component;

  // Next Step
  const handleNext = () => {
    const validator = stepValidation[currentStep];

    const validationErrors = validator
      ? validator(formData)
      : {};

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (currentStep < scholarshipSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Previous Step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
    }
  };


const handleFinalSubmit = async () => {

  try {

    setLoading(true);

    /*
    |--------------------------------------------------------------------------
    | Prepare Application Data
    |--------------------------------------------------------------------------
    */

    const applicationData = {
      ...formData,
    };

    delete applicationData.documents;
    delete applicationData.confirmAccountNumber;
    delete applicationData.declarationAccepted;
    delete applicationData.studentPlace;
    delete applicationData.studentDate;

    /*
    |--------------------------------------------------------------------------
    | Step 1
    | Create Application
    |--------------------------------------------------------------------------
    */

    const response =
      await submitApplication(applicationData);

    const {
      applicationId,
      id,
    } = response.data;

    /*
    |--------------------------------------------------------------------------
    | Step 2
    | Upload Documents
    |--------------------------------------------------------------------------
    */

    const uploadData =
      new FormData();

    Object.entries(
      formData.documents
    ).forEach(([key, file]) => {

      if (file) {

        uploadData.append(
          key,
          file
        );

      }

    });

    try {

      await uploadScholarshipDocuments(
        id,
        uploadData
      );

    }

    catch (uploadError) {

      console.error(uploadError);

      alert(

        "Application submitted successfully.\n\nSome documents could not be uploaded.\nPlease contact the administrator."

      );

    }

    /*
    |--------------------------------------------------------------------------
    | Success Page
    |--------------------------------------------------------------------------
    */

    navigate(
      "/application-success",
      {

        state: {

          applicationId,

        },

        replace: true,

      }
    );

  }

  catch (error) {

    console.error(error);

    alert(

      error.response?.data?.message ||

      "Application submission failed."

    );

  }

  finally {

    setLoading(false);

  }

};

  
  return (



    
    <div className="max-w-5xl mx-auto px-5 py-10">



{/* Page Header */}

<div className="mb-8 rounded-2xl bg-gradient-to-r from-yellow-700 to-yellow-900 text-white p-8 shadow-lg">

  <h1 className="text-4xl font-bold">
    Scholarship Application
  </h1>

  <p className="mt-3 text-blue-100 text-lg">
    Welcome to the Vidya Jyothi Foundation Scholarship Portal.
    Complete your application carefully and submit all required
    documents for verification.
  </p>

</div>

{/* About Scholarship */}

<div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow">

  <h2 className="text-2xl font-bold text-blue-800 mb-4">
    🎓 About this Scholarship
  </h2>

  <p className="text-gray-700 leading-8">

    Vidya Jyothi Foundation supports deserving students from
    economically weaker families by providing financial assistance
    for higher education. Applications are verified by our
    scholarship committee before approval.

  </p>

</div>

{/* Important Instructions */}

<div className="mb-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-6 shadow">

  <h2 className="text-2xl font-bold text-yellow-800 mb-5">
    📋 Important Instructions
  </h2>

  <ul className="space-y-3 text-gray-700">

    <li>✅ Only one application is allowed per scholarship cycle.</li>

    <li>✅ Aadhaar Number and Mobile Number must belong to the student.</li>

    <li>✅ Keep all required documents ready before starting the application.</li>

    <li>✅ Enter correct academic and bank details.</li>

    <li>✅ Save your Application Number after successful submission.</li>

    <li>✅ You can track your application anytime using the Check Status option.</li>

  </ul>

</div>

{/* Already Applied */}

<div className="mb-10 rounded-2xl border border-green-200 bg-green-50 p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-5">

  <div>

    <h2 className="text-2xl font-bold text-green-800">

      Already Applied?

    </h2>

    <p className="mt-2 text-gray-700">

      If you have already submitted your scholarship application
      for the current scholarship cycle, you can check its status
      using your Application Number and Aadhaar Number.

    </p>

  </div>

  <Link
    to="/check-status"
    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
  >
    Check Application Status
  </Link>

</div>

      <ProgressBar currentStep={currentStep} />

      <div className="mt-6 rounded-xl bg-white shadow-lg p-8">

        <CurrentStepComponent
  formData={formData}
  setFormData={setFormData}
  errors={errors}
  aadhaarVerifying={aadhaarVerifying}
  setAadhaarVerifying={setAadhaarVerifying}
/>

      </div>

     <StepNavigation
  currentStep={currentStep}
  handleNext={handleNext}
  handlePrevious={handlePrevious}
  handleFinalSubmit={handleFinalSubmit}
  loading={loading}
  aadhaarVerifying={aadhaarVerifying}
/>





    </div>
  );
}

export default ScholarshipApplication;