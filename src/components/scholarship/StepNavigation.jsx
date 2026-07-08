function StepNavigation({
  currentStep,
  handleNext,
  handlePrevious,
  handleFinalSubmit,
  loading,
}) {
  const isLastStep = currentStep === 7;

  return (
    <div className="flex items-center justify-between mt-8 border-t pt-6">

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

      {!isLastStep ? (
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
        >
          Next →
        </button>
      ) : (
<button
  onClick={handleFinalSubmit}
  disabled={loading}
  className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
>
  {loading ? "Submitting..." : "Submit Application"}
</button>
      )}

    </div>
  );
}

export default StepNavigation;