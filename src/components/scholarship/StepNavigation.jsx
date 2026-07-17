function StepNavigation({
  currentStep,
  handleNext,
  handlePrevious,
  handleFinalSubmit,
  loading,
  aadhaarVerifying,
}) {
  const isLastStep = currentStep === 7;

  // Document Upload is Step 5.
  // Only disable Next on Step 5 while Aadhaar OCR is processing.
  const isNextDisabled =
    currentStep === 5 && aadhaarVerifying;

  return (
    <div className="flex items-center justify-between mt-8 border-t pt-6">

      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-lg font-semibold transition ${
          currentStep === 1
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-800"
        }`}
      >
        ← Previous
      </button>

      {/* Next Button */}
      {!isLastStep ? (
        <button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
            isNextDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isNextDisabled
            ? "Verifying Aadhaar..."
            : "Next →"}
        </button>
      ) : (
        /* Final Submit Button */
        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Application"}
        </button>
      )}

    </div>
  );
}

export default StepNavigation;