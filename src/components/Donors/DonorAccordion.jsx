import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function DonorAccordion({ donor }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {donor?.name || "Donor"}
          </h3>

          {donor?.amount && (
            <p className="text-sm text-gray-500 mt-1">
              Donation: ₹{donor.amount}
            </p>
          )}
        </div>

        {open ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t bg-gray-50">
          {donor?.message && (
            <p className="mt-4 text-gray-700">{donor.message}</p>
          )}

          {donor?.date && (
            <p className="mt-2 text-sm text-gray-500">
              Date: {donor.date}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DonorAccordion;