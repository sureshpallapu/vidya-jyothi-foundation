function StatusBadge({ status }) {
  const styles = {
    Submitted:
      "bg-yellow-100 text-yellow-800",

    "Documents Verified":
      "bg-blue-100 text-blue-800",

    "Under Review":
      "bg-purple-100 text-purple-800",

    Approved:
      "bg-green-100 text-green-800",

    Rejected:
      "bg-red-100 text-red-800",

    "Scholarship Released":
      "bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;