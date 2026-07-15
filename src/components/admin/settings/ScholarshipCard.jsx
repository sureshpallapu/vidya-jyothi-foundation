import {
  FaGraduationCap,
  FaSave,
} from "react-icons/fa";

function ScholarshipCard({
  settings,
  handleChange,
  handleSave,
  saving,
}) {

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

      {/* Header */}

      <div className="flex items-center gap-3 border-b px-6 py-4">

        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl">

          <FaGraduationCap />

        </div>

        <div>

          <h2 className="text-xl font-semibold">

            Scholarship Settings

          </h2>

          <p className="text-gray-500 text-sm">

            Configure Scholarship Preferences

          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-medium">

              Application Prefix

            </label>

            <input
              type="text"
              name="application_prefix"
              value={settings.application_prefix}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Session Timeout (Minutes)

            </label>

            <input
              type="number"
              name="session_timeout"
              value={settings.session_timeout}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
              min={1}
            />

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t px-6 py-4 flex justify-end">

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >

          <FaSave />

          {saving
            ? "Saving..."
            : "Save Scholarship"}

        </button>

      </div>

    </div>

  );

}

export default ScholarshipCard;