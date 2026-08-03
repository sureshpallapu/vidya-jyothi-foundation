import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaReceipt,
} from "react-icons/fa";

export default function ReceiptDetailsHeader({
  receipt,
  onBack,
}) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6">

        {/* Left */}

        <div className="flex items-start gap-4">

          <button
            onClick={onBack}
            className="w-11 h-11 rounded-lg bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
          >
            <FaArrowLeft />
          </button>

          <div>

            <p className="text-sm text-gray-500">
              Donation Receipt
            </p>

            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">

              <FaReceipt className="text-blue-600" />

              {receipt.receipt_code}

            </h1>

            <div className="mt-3">

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  receipt.status === "GENERATED"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {receipt.status}
              </span>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-slate-50 rounded-xl p-4">

            <div className="flex items-center gap-2 text-gray-500 text-sm">

              <FaMoneyBillWave />

              Donation Amount

            </div>

            <div className="mt-2 text-xl font-bold text-green-700">

              {formatCurrency(receipt.amount)}

            </div>

          </div>

          <div className="bg-slate-50 rounded-xl p-4">

            <div className="flex items-center gap-2 text-gray-500 text-sm">

              <FaCreditCard />

              Payment Mode

            </div>

            <div className="mt-2 text-lg font-semibold text-slate-800">

              {receipt.payment_mode || "-"}

            </div>

          </div>

          <div className="bg-slate-50 rounded-xl p-4">

            <div className="flex items-center gap-2 text-gray-500 text-sm">

              <FaCalendarAlt />

              Receipt Date

            </div>

            <div className="mt-2 text-lg font-semibold text-slate-800">

              {formatDate(receipt.receipt_date)}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}