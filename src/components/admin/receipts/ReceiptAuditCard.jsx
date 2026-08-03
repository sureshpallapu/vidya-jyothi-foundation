import {
  FaUserShield,
  FaCalendarCheck,
  FaHistory,
  FaArchive,
  FaBan,
} from "react-icons/fa";

export default function ReceiptAuditCard({ receipt }) {
  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const AuditRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">

      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
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

      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">

        <h2 className="text-lg font-semibold text-white">
          Audit Information
        </h2>

      </div>

      {/* Body */}

      <div className="p-6">

        <AuditRow
          icon={<FaUserShield />}
          label="Created By"
          value={receipt?.created_by_name}
        />

        <AuditRow
          icon={<FaCalendarCheck />}
          label="Created On"
          value={formatDateTime(receipt?.created_at)}
        />

        <AuditRow
          icon={<FaHistory />}
          label="Last Updated"
          value={formatDateTime(receipt?.updated_at)}
        />

        <AuditRow
          icon={<FaArchive />}
          label="Archived By"
          value={
            receipt?.archived_by_name
              ? `${receipt.archived_by_name} (${formatDateTime(receipt.archived_at)})`
              : "-"
          }
        />

        <AuditRow
          icon={<FaBan />}
          label="Cancelled By"
          value={
            receipt?.cancelled_by_name
              ? `${receipt.cancelled_by_name} (${formatDateTime(receipt.cancelled_at)})`
              : "-"
          }
        />

      </div>

    </div>
  );
}