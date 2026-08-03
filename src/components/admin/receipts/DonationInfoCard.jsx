import {
  FaRupeeSign,
  FaHandHoldingHeart,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaHashtag,
  FaStickyNote,
} from "react-icons/fa";

export default function DonationInfoCard({ receipt }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">

      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="font-semibold text-gray-800 mt-1">
          {value || "-"}
        </p>

      </div>

    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">

        <h2 className="text-white text-lg font-semibold">
          Donation Information
        </h2>

      </div>

      {/* Amount Card */}

      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">

        <p className="text-sm text-gray-600">
          Donation Amount
        </p>

        <h1 className="text-4xl font-bold text-green-700 mt-2">
          {formatCurrency(receipt?.amount)}
        </h1>

      </div>

      {/* Details */}

      <div className="px-6">

        <InfoItem
          icon={<FaHandHoldingHeart />}
          label="Donation Purpose"
          value={receipt?.donation_purpose}
        />

        <InfoItem
          icon={<FaMoneyCheckAlt />}
          label="Payment Mode"
          value={receipt?.payment_mode}
        />

        <InfoItem
          icon={<FaCalendarAlt />}
          label="Donation Date"
          value={receipt?.donation_date}
        />

        <InfoItem
          icon={<FaHashtag />}
          label="Transaction / UTR / Cheque No"
          value={receipt?.reference_number}
        />

        <InfoItem
          icon={<FaStickyNote />}
          label="Remarks"
          value={receipt?.remarks}
        />

      </div>

    </div>
  );
}