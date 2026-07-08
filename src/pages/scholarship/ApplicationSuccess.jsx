import { Link, useLocation } from "react-router-dom";

function ApplicationSuccess() {

  const { state } = useLocation();

  const applicationId =
    state?.applicationId || "Not Available";

  return (
    <div className="max-w-3xl mx-auto py-20 px-6">

      <div className="bg-white rounded-xl shadow-lg p-10 text-center">

        <div className="text-6xl mb-4">
          ✅
        </div>

        <h1 className="text-4xl font-bold text-green-700">
          Application Submitted Successfully
        </h1>

        <p className="mt-6 text-gray-600">
          Your scholarship application has been received.
        </p>

        <div className="mt-8 bg-gray-100 rounded-lg p-6">

          <p className="text-gray-500">
            Application Number
          </p>

          <h2 className="text-3xl font-bold tracking-wider text-blue-700 mt-2">
            {applicationId}
          </h2>

        </div>

        <p className="mt-8 text-gray-600">
          Please save this application number for future reference.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <Link
            to="/check-status"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Check Status
          </Link>

          <Link
            to="/"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ApplicationSuccess;