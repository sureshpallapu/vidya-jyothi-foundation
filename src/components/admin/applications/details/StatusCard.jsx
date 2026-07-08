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
    Submitted: [
      "Documents Verified",
      "Rejected",
    ],
  },

  REVIEW_OFFICER: {
    "Documents Verified": [
      "Under Review",
      "Rejected",
    ],
  },

  FOUNDER: {
    "Under Review": [
      "Approved",
      "Rejected",
    ],
  },

  ACCOUNTS: {
    Approved: [
      "Scholarship Released",
    ],
  },

  SUPER_ADMIN: {
    Submitted: [
      "Documents Verified",
      "Rejected",
    ],

    "Documents Verified": [
      "Under Review",
      "Rejected",
    ],

    "Under Review": [
      "Approved",
      "Rejected",
    ],

    Approved: [
      "Scholarship Released",
    ],

    Rejected: [],

    "Scholarship Released": [],
  },
};

function StatusCard({
  application,
  onSave,
  loading,
}) {

  const [nextStatus, setNextStatus] = useState("");

  const [remarks, setRemarks] = useState("");

  const [sanctionedAmount, setSanctionedAmount] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Logged In Admin
  |--------------------------------------------------------------------------
  */

  const admin = useMemo(() => {

    const stored =
      localStorage.getItem("admin");

    return stored
      ? JSON.parse(stored)
      : null;

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
console.log("Admin:", admin);
console.log("Role:", admin?.role);
console.log("Application Status:", application.status);
  const availableOptions =
    ROLE_OPTIONS[
      admin?.role
    ]?.[
      application.status
    ] || [];
console.log("Available:", availableOptions);
  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave = () => {

  console.log("Save clicked");

  console.log({
    nextStatus,
    remarks,
    sanctionedAmount,
  });

  onSave({
    status: nextStatus,
    remarks,
    sanctionedAmount,
  });

};

  return (

    <SectionCard title="Verification Panel">

      <div className="space-y-6">

        {/* Current Status */}

        <div>

          <label className="block text-sm font-medium text-gray-600 mb-2">

            Current Status

          </label>

          <StatusBadge
            status={application.status}
          />

        </div>

        {/* Next Action */}

        <div>

          <label className="block text-sm font-medium text-gray-600 mb-2">

            Next Action

          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={nextStatus}
            onChange={(e) =>
              setNextStatus(e.target.value)
            }
          >

            <option value="">
              Select Action
            </option>

            {availableOptions.map((status) => (

              <option
                key={status}
                value={status}
              >

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
            className="w-full border rounded-lg p-3 disabled:bg-gray-100"
            placeholder="Enter sanctioned amount"
            value={sanctionedAmount}
            disabled={
              nextStatus !== "Approved"
            }
            onChange={(e) =>
              setSanctionedAmount(
                e.target.value
              )
            }
          />

        </div>

        {/* Remarks */}

        <div>

          <label className="block text-sm font-medium text-gray-600 mb-2">

            Admin Remarks

          </label>

          <textarea
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />

        </div>

        {/* Save */}

        <button
          type="button"
          disabled={
            loading ||
            !nextStatus
          }
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
        >

          {loading
            ? "Saving..."
            : "Save Workflow"}

        </button>

      </div>

    </SectionCard>

  );

}

export default StatusCard;