import {
  FaBuilding,
  FaSave,
} from "react-icons/fa";

function OrganizationCard({
  settings,
  handleChange,
  handleSave,
  saving,
}) {

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

      {/* Header */}

      <div className="flex items-center gap-3 border-b px-6 py-4">

        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">

          <FaBuilding />

        </div>

        <div>

          <h2 className="text-xl font-semibold">

            Organization Information

          </h2>

          <p className="text-gray-500 text-sm">

            Configure Trust Details

          </p>

        </div>

      </div>

      {/* Body */}

      <div className="p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="font-medium">

              Trust Name

            </label>

            <input
              type="text"
              name="trust_name"
              value={settings.trust_name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Trust Email

            </label>

            <input
              type="email"
              name="trust_email"
              value={settings.trust_email}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Trust Phone

            </label>

            <input
              type="text"
              name="trust_phone"
              value={settings.trust_phone}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-medium">

              Website

            </label>

            <input
              type="text"
              name="trust_website"
              value={settings.trust_website}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

        </div>

        <div>

          <label className="font-medium">

            Address

          </label>

          <textarea
            rows={4}
            name="trust_address"
            value={settings.trust_address}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >

          <FaSave />

          {saving
            ? "Saving..."
            : "Save Organization"}

        </button>

      </div>

    </div>

  );

}

export default OrganizationCard;