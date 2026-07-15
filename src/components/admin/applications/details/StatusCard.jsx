import { useEffect, useMemo, useState } from "react";
import SectionCard from "../SectionCard";
import StatusBadge from "../StatusBadge";

/*
|--------------------------------------------------------------------------
| Role Based Workflow Options
|--------------------------------------------------------------------------
*/

const ROLE_OPTIONS = {
  VERIFICATION_OFFICER: {
    Submitted: ["Documents Verified", "Rejected"],
  },

  REVIEW_OFFICER: {
    "Documents Verified": ["Under Review", "Rejected"],
  },

  FOUNDER: {
    "Under Review": ["Approved", "Rejected"],
  },

  ACCOUNTS: {
    Approved: ["Scholarship Released"],
  },

  SUPER_ADMIN: {
    Submitted: ["Documents Verified", "Rejected"],
    "Documents Verified": ["Under Review", "Rejected"],
    "Under Review": ["Approved", "Rejected"],
    Approved: ["Scholarship Released"],
    Rejected: [],
    "Scholarship Released": [],
  },
};

function StatusCard({ application, onSave, loading }) {
  const [nextStatus, setNextStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [sanctionedAmount, setSanctionedAmount] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Logged In Admin
  |--------------------------------------------------------------------------
  */
  const admin = useMemo(() => {
    const stored = localStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setNextStatus("");
    setRemarks("");
    setSanctionedAmount("");
  }, [application]);

  /*
  |--------------------------------------------------------------------------
  | Available Actions
  |--------------------------------------------------------------------------
  */
  const availableOptions =
    ROLE_OPTIONS[admin?.role]?.[application.status] || [];
  const canTakeAction = availableOptions.length > 0;

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */
  const handleSave = () => {
    onSave({
      status: nextStatus,
      remarks,
      sanctionedAmount,
    });
  };

  return (
    <SectionCard title="Workflow Management">
      <div className="space-y-8">
        {/* Current Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Current Status
          </label>
          <StatusBadge status={application.status} />
        </div>

        {/* Logged In As */}
        <div className="rounded-xl border bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Logged In As
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-800">
            {admin?.role?.replaceAll("_", " ")}
          </h3>
        </div>

        {/* Workflow action form — only shown when this admin actually
            has an available action for the application's current status */}
        {canTakeAction ? (
          <>
            {/* Next Action */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Next Action
              </label>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
              >
                <option value="">Select Action</option>
                {availableOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sanctioned Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Sanctioned Amount
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter sanctioned amount"
                value={sanctionedAmount}
                disabled={nextStatus !== "Approved"}
                onChange={(e) => setSanctionedAmount(e.target.value)}
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Admin Remarks
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Save */}
            <button
              type="button"
              disabled={loading || !nextStatus}
              onClick={handleSave}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 font-semibold transition"
            >
              {loading ? "Saving Workflow..." : "Save Workflow"}
            </button>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 border p-4 text-center">
            <p className="text-gray-500">
              No workflow actions are available for your role at the
              current application status.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default StatusCard;