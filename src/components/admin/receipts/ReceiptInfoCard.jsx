import {
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaHashtag,
  FaUniversity,
  FaCheckCircle,
  FaReceipt,
  FaRupeeSign,
} from "react-icons/fa";

export default function ReceiptInfoCard({ receipt }) {
  const statusClasses = {
    GENERATED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-gray-100 text-gray-700",
  };

  const InfoRow = ({ icon, label, value, badge }) => (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">

      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>

        {badge ? (
          <span
            className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
              statusClasses[value] || "bg-gray-100 text-gray-700"
            }`}
          >
            {value}
          </span>
        ) : (
          <p className="font-semibold text-gray-800 mt-1">
            {value || "-"}
          </p>
        )}

      </div>

    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">

        <h2 className="text-lg font-semibold text-white">
          Receipt Information
        </h2>

      </div>

      {/* Body */}

      <div className="p-6">

        <InfoRow
          icon={<FaFileInvoiceDollar />}
          label="Receipt Number"
          value={receipt?.receipt_code}
        />

        <InfoRow
          icon={<FaReceipt />}
          label="Donation Code"
          value={receipt?.donation_code}
        />

        <InfoRow
          icon={<FaCalendarAlt />}
          label="Receipt Date"
          value={receipt?.receipt_date}
        />

        <InfoRow
          icon={<FaUniversity />}
          label="Financial Year"
          value={receipt?.financial_year}
        />

        <InfoRow
          icon={<FaMoneyCheckAlt />}
          label="Receipt Type"
          value={receipt?.receipt_type}
        />

        <InfoRow
          icon={<FaCheckCircle />}
          label="Receipt Status"
          value={receipt?.receipt_status}
          badge
        />

        <InfoRow
          icon={<FaRupeeSign />}
          label="Payment Mode"
          value={receipt?.payment_mode}
        />

        <InfoRow
          icon={<FaHashtag />}
          label="Reference Number"
          value={receipt?.reference_number}
        />

      </div>
    </div>
  );
}