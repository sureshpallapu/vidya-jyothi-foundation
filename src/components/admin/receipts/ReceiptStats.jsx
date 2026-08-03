import {
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
  FaCalendarDay,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const cards = [
  {
    key: "totalReceipts",
    title: "Total Receipts",
    icon: FaReceipt,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "generatedReceipts",
    title: "Generated",
    icon: FaCheckCircle,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "cancelledReceipts",
    title: "Cancelled",
    icon: FaTimesCircle,
    color: "bg-red-100 text-red-600",
  },
  {
    key: "archivedReceipts",
    title: "Archived",
    icon: FaArchive,
    color: "bg-gray-100 text-gray-600",
  },
  {
    key: "todayReceipts",
    title: "Today's Receipts",
    icon: FaCalendarDay,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    key: "currentMonthReceipts",
    title: "Current Month",
    icon: FaCalendarAlt,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    key: "totalReceiptAmount",
    title: "Receipt Amount",
    icon: FaRupeeSign,
    color: "bg-emerald-100 text-emerald-700",
    currency: true,
  },
];

export default function ReceiptStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="bg-white rounded-xl shadow border p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.currency
                    ? `₹ ${Number(
                        stats?.[card.key] || 0
                      ).toLocaleString("en-IN")}`
                    : stats?.[card.key] ?? 0}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${card.color}`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}