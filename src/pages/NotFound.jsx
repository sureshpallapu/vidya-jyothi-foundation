import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-yellow-500 text-6xl" />
        </div>

        <h1 className="text-7xl font-bold text-slate-800">404</h1>

        <h2 className="text-3xl font-semibold mt-4 text-slate-700">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;