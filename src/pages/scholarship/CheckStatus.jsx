import { useState } from "react";
import { Link } from "react-router-dom";
import { checkApplicationStatus } from "../../api/scholarshipApi";

function CheckStatus() {
  const [formData, setFormData] = useState({
    applicationId: "",
    aadhaar: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Aadhaar: allow numbers only
    if (name === "aadhaar") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const applicationId = formData.applicationId.trim();
    const aadhaar = formData.aadhaar.trim();

    if (!applicationId) {
      setError("Please enter your Application Number.");
      return;
    }

    if (!aadhaar) {
      setError("Please enter your Aadhaar Number.");
      return;
    }

    if (aadhaar.length !== 12) {
      setError("Aadhaar Number must contain exactly 12 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await checkApplicationStatus({
        applicationId,
        aadhaar,
      });

      setResult(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch application status. Please verify your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      applicationId: "",
      aadhaar: "",
    });

    setResult(null);
    setError("");
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "_");

    switch (normalizedStatus) {
      case "approved":
      case "accepted":
      case "selected":
        return {
          container:
            "bg-green-50 border-green-200 text-green-700",
          dot: "bg-green-500",
        };

      case "rejected":
      case "declined":
        return {
          container:
            "bg-red-50 border-red-200 text-red-700",
          dot: "bg-red-500",
        };

      case "pending":
      case "submitted":
      case "under_review":
      case "under verification":
      case "verification_pending":
        return {
          container:
            "bg-yellow-50 border-yellow-200 text-yellow-700",
          dot: "bg-yellow-500",
        };

      case "in_progress":
      case "processing":
        return {
          container:
            "bg-blue-50 border-blue-200 text-blue-700",
          dot: "bg-blue-500",
        };

      default:
        return {
          container:
            "bg-gray-50 border-gray-200 text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  const statusStyle = result
    ? getStatusStyle(result.status)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-5 py-10 md:py-14">

      <div className="max-w-4xl mx-auto">

        {/* Back Button */}

        <div className="mb-6">

          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800"
          >
            <span className="text-lg">
              ←
            </span>

            Back to Scholarships
          </Link>

        </div>


        {/* Page Header */}

        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-900 p-8 text-white shadow-xl md:p-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                🎓 Scholarship Portal
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                Track Your Application
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-yellow-100">
                Enter your Application Number and Aadhaar Number
                to securely check the current status of your
                scholarship application.
              </p>

            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-5xl backdrop-blur-sm md:flex">
              🔎
            </div>

          </div>

        </div>


        {/* Search Card */}

        {!result && (

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl md:p-8">

            <div className="mb-7">

              <h2 className="text-2xl font-bold text-gray-900">
                Check Application Status
              </h2>

              <p className="mt-2 text-gray-500">
                Please enter the details exactly as provided
                during your scholarship application.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Application Number */}

              <div>

                <label
                  htmlFor="applicationId"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Application Number
                </label>

                <input
                  id="applicationId"
                  type="text"
                  name="applicationId"
                  value={formData.applicationId}
                  onChange={handleChange}
                  placeholder="Example: VJF202600001"
                  autoComplete="off"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                />

              </div>


              {/* Aadhaar */}

              <div>

                <label
                  htmlFor="aadhaar"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Aadhaar Number
                </label>

                <input
                  id="aadhaar"
                  type="password"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  maxLength={12}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Enter 12-digit Aadhaar Number"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 tracking-widest text-gray-900 outline-none transition placeholder:tracking-normal placeholder:text-gray-400 focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Your Aadhaar Number is used only to verify
                  your application.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                  <span className="text-xl">
                    ⚠️
                  </span>

                  <div>

                    <p className="font-semibold">
                      Unable to Check Status
                    </p>

                    <p className="mt-1 text-sm">
                      {error}
                    </p>

                  </div>

                </div>

              )}


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 font-semibold text-white shadow-md transition hover:from-yellow-700 hover:to-yellow-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Checking Application...
                  </>
                ) : (
                  <>
                    🔎

                    Check Application Status
                  </>
                )}

              </button>

            </form>


            {/* Help */}

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-sm leading-6 text-blue-800">

                <strong>Need help?</strong>{" "}
                Make sure your Application Number and Aadhaar
                Number match the information submitted in your
                scholarship application.

              </p>

            </div>

          </div>

        )}


        {/* Result */}

        {result && (

          <div className="space-y-6">

            {/* Success Header */}

            <div className="rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-lg md:p-8">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-green-700">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      ✓
                    </span>

                    <span className="font-semibold">
                      Application Found
                    </span>

                  </div>

                  <h2 className="mt-3 text-2xl font-bold text-gray-900">
                    Your Scholarship Application
                  </h2>

                  <p className="mt-2 text-gray-600">
                    The latest available application information
                    is displayed below.
                  </p>

                </div>

                <div className="rounded-xl bg-white px-5 py-4 shadow-sm">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Application Number
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {result.application_id}
                  </p>

                </div>

              </div>

            </div>


            {/* Main Details */}

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl md:p-8">

              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Application Details
              </h3>


              <div className="grid gap-4 md:grid-cols-2">

                {/* Student Name */}

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Student Name
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.student_name || "-"}
                  </p>

                </div>


                {/* Application Number */}

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Application Number
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {result.application_id || "-"}
                  </p>

                </div>


                {/* Applied Date */}

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Applied On
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatDate(result.created_at)}
                  </p>

                </div>


                {/* Status */}

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                  <div className="mt-2">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle.container}`}
                    >

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`}
                      />

                      {result.status || "Unknown"}

                    </span>

                  </div>

                </div>

              </div>


              {/* Remarks */}

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <p className="text-sm font-semibold text-blue-800">
                  Committee Remarks
                </p>

                <p className="mt-2 leading-7 text-gray-700">
                  {result.remarks || "No remarks have been added yet."}
                </p>

              </div>


              {/* Aadhaar Privacy */}

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs leading-5 text-gray-500">

                  🔒 For your privacy, Aadhaar details are not
                  displayed on this page.

                </p>

              </div>


              {/* Actions */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-xl border border-yellow-500 bg-white px-6 py-3.5 font-semibold text-yellow-700 transition hover:bg-yellow-50"
                >
                  🔄 Check Another Application
                </button>

                <Link
                  to="/scholarships"
                  className="flex flex-1 items-center justify-center rounded-xl bg-yellow-600 px-6 py-3.5 font-semibold text-white transition hover:bg-yellow-700"
                >
                  ← Back to Scholarships
                </Link>

              </div>

            </div>

          </div>

        )}


        {/* Footer Note */}

        <div className="mt-8 text-center">

          <p className="text-sm text-gray-500">
            Vidya Jyothi Foundation • Scholarship Application Portal
          </p>

        </div>

      </div>

    </div>
  );
}

export default CheckStatus;