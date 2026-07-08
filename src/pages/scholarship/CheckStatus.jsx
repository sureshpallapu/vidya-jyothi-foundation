import { useState } from "react";
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

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      setResult(null);

      const response =
        await checkApplicationStatus(formData);

      setResult(response.data.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to fetch application."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-3xl mx-auto py-12 px-5">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">

          Scholarship Application Status

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="font-medium">

              Application Number

            </label>

            <input
              type="text"
              name="applicationId"
              value={formData.applicationId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Aadhaar Number

            </label>

            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              maxLength={12}
              className="w-full border rounded-lg px-4 py-3 mt-2"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white py-3 rounded-lg"
          >
            {loading
              ? "Checking..."
              : "Check Status"}
          </button>

        </form>

        {error && (

          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">

            {error}

          </div>

        )}

        {result && (

          <div className="mt-8 border rounded-xl p-6 bg-gray-50">

            <h2 className="text-2xl font-bold mb-5">

              Application Details

            </h2>

            <div className="space-y-3">

              <p>

                <strong>Application Number:</strong>{" "}

                {result.application_id}

              </p>

              <p>

                <strong>Student Name:</strong>{" "}

                {result.student_name}

              </p>

              <p>

                <strong>Status:</strong>{" "}

                <span className="font-semibold text-blue-700">

                  {result.status}

                </span>

              </p>

              <p>

                <strong>Remarks:</strong>{" "}

                {result.remarks || "-"}

              </p>

              <p>

                <strong>Applied On:</strong>{" "}

                {new Date(
                  result.created_at
                ).toLocaleDateString()}

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default CheckStatus;