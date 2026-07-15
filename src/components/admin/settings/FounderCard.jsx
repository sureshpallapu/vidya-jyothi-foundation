import {
  FaUserTie,
  FaSave,
} from "react-icons/fa";

function FounderCard({
  settings,
  handleChange,
  handleSave,
  saving,
}) {

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

      {/* Header */}

      <div className="flex items-center gap-3 border-b px-6 py-4">

        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">

          <FaUserTie />

        </div>

        <div>

          <h2 className="text-xl font-semibold">

            Founder Information

          </h2>

          <p className="text-gray-500 text-sm">

            Configure Founder Details

          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-medium">

              Founder Name

            </label>

            <input
              type="text"
              name="founder_name"
              value={settings.founder_name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Designation

            </label>

            <input
              type="text"
              name="founder_designation"
              value={settings.founder_designation}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

        </div>

        <div>

          <label className="font-medium">

            Founder Message

          </label>

          <textarea
            rows={5}
            name="founder_message"
            value={settings.founder_message}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mt-2"
          />

        </div>

      </div>

      {/* Footer */}

      <div className="border-t px-6 py-4 flex justify-end">

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >

          <FaSave />

          {saving
            ? "Saving..."
            : "Save Founder"}

        </button>

      </div>

    </div>

  );

}

export default FounderCard;