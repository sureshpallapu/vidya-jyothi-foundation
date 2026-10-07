import { useEffect, useState } from "react";import { useNavigate } from "react-router-dom";
import scholarshipInitialData from "../../data/scholarshipInitialData";
import scholarshipSteps from "../../data/scholarshipSteps";

import ProgressBar from "../../components/scholarship/ProgressBar";
import StepNavigation from "../../components/scholarship/StepNavigation";

import stepValidation from "../../utils/stepValidation";
import {
  submitApplication,
  uploadScholarshipDocuments,
  getScholarshipCycles,
} from "../../api/scholarshipApi";

import { Link } from "react-router-dom";



function ScholarshipApplication() {

  const navigate = useNavigate();

const [loading, setLoading] = useState(false);
// Scholarship cycle state
const [cycleLoading, setCycleLoading] = useState(true);
const [cycles, setCycles] = useState([]);
const [cycleError, setCycleError] = useState("");


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

  // Load scholarship cycles
useEffect(() => {
  const loadScholarshipCycles = async () => {
    try {
      setCycleLoading(true);
      setCycleError("");

      const response = await getScholarshipCycles();

      setCycles(response.data?.data || []);
    } catch (error) {
      console.error(
        "Failed to load scholarship cycles:",
        error
      );

      setCycleError(
        "Unable to load scholarship information. Please try again later."
      );
    } finally {
      setCycleLoading(false);
    }
  };

  loadScholarshipCycles();
}, []);


// Currently active scholarship cycle
const activeCycle = cycles.find(
  (cycle) => Number(cycle.is_active) === 1
);

// Get today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

// Find the nearest upcoming inactive cycle
const upcomingCycles = cycles
  .filter((cycle) => {
    if (Number(cycle.is_active) === 1) {
      return false;
    }

    if (!cycle.start_date) {
      return false;
    }

    const startDate = new Date(cycle.start_date);
    startDate.setHours(0, 0, 0, 0);

    return startDate >= today;
  })
  .sort(
    (a, b) =>
      new Date(a.start_date) -
      new Date(b.start_date)
  );

const nextCycle = upcomingCycles[0];
const formatCycleDate = (date) => {
  if (!date) {
    return "Not announced";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

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

      
{/* Scholarship Application Area */}

{cycleLoading ? (

  <div className="mt-8 rounded-2xl bg-white shadow-lg p-10">

    <div className="flex flex-col items-center justify-center text-center">

      <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-700"></div>

      <h3 className="mt-5 text-xl font-semibold text-gray-800">
        Checking Scholarship Applications
      </h3>

      <p className="mt-2 text-gray-500">
        Please wait while we check the current scholarship cycle.
      </p>

    </div>

  </div>

) : cycleError ? (

  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

    <div className="text-5xl">
      ⚠️
    </div>

    <h2 className="mt-4 text-2xl font-bold text-red-800">
      Unable to Load Scholarship Information
    </h2>

    <p className="mt-3 text-gray-700">
      {cycleError}
    </p>

  </div>

) : activeCycle ? (

  <>
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
  </>

) : (

  <div className="mt-8">

    <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-8 md:p-12 shadow-xl">

      <div className="mx-auto max-w-3xl text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl shadow-inner">
          🎓
        </div>

        <span className="mt-6 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
          Applications Currently Closed
        </span>

        <h2 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900">
          Scholarship Applications Are Currently Closed
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">

          There is currently no active scholarship cycle.
          Please check the information below for the next
          scholarship opportunity.

        </p>

      </div>


      {nextCycle ? (

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-yellow-200 bg-white p-6 md:p-8 shadow-md">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
              📅
            </div>

            <div>

              <p className="text-sm font-medium uppercase tracking-wide text-yellow-700">
                Next Scholarship Cycle
              </p>

              <h3 className="text-2xl font-bold text-gray-900">
                {nextCycle.title}
              </h3>

            </div>

          </div>


          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Scholarship Year
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {nextCycle.scholarship_year}
              </p>

            </div>


            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Application Opens
              </p>

              <p className="mt-1 text-lg font-semibold text-green-700">
                {formatCycleDate(nextCycle.start_date)}
              </p>

            </div>


            <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">

              <p className="text-sm text-gray-500">
                Application Period
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">

                {formatCycleDate(nextCycle.start_date)}

                <span className="mx-2 text-gray-400">
                  →
                </span>

                {formatCycleDate(nextCycle.end_date)}

              </p>

            </div>

          </div>


          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-sm leading-6 text-blue-800">

              Applications will become available once this
              scholarship cycle is activated by the
              Vidya Jyothi Foundation.

            </p>

          </div>

        </div>

      ) : (

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">

          <div className="text-4xl">
            📢
          </div>

          <h3 className="mt-4 text-2xl font-bold text-gray-800">
            Next Scholarship Cycle Not Yet Announced
          </h3>

          <p className="mt-3 leading-7 text-gray-600">

            The current scholarship applications are closed.
            Please check back later for information about the
            next scholarship cycle.

          </p>

        </div>

      )}

    </div>

  </div>

)}
  





    </div>
  );
}

export default ScholarshipApplication;