import { FaEdit, FaEye, FaTrash, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

// Derives the cycle's real-time state once, so every column and every
// action button reads from the same source of truth instead of each
// recomputing (and risking drift, like the missing `isClosed` bug).
function getCycleState(cycle) {
  const today = new Date();
  const start = new Date(cycle.start_date);
  const end = new Date(cycle.end_date);

  const isUpcoming = today < start;
  const isClosed = today > end;
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  return { isUpcoming, isClosed, daysLeft };
}

function CycleTable({ cycles, loading, onEdit, onDelete, onActivate }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const showCycleDetails = (cycle) => {
    Swal.fire({
      icon: "info",
      title: cycle.title,
      html: `
        <div style="text-align:left;line-height:1.8">
          <p><strong>Scholarship Year:</strong> ${cycle.scholarship_year}</p>
          <p><strong>Start Date:</strong> ${new Date(
            cycle.start_date
          ).toLocaleDateString("en-IN")}</p>
          <p><strong>End Date:</strong> ${new Date(
            cycle.end_date
          ).toLocaleDateString("en-IN")}</p>
          <p><strong>Status:</strong> ${
            cycle.is_active ? "🟢 Active" : "⚪ Inactive"
          }</p>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
      width: 500,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Scholarship Title</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4">Remaining</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {cycles.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-6xl">📅</div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-800">
                      No Scholarship Cycles
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Create your first scholarship cycle.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              cycles.map((cycle) => {
                const { isUpcoming, isClosed, daysLeft } = getCycleState(cycle);

                return (
                  <tr
                    key={cycle.id}
                    className="hover:bg-blue-50/60 transition-colors duration-150"
                  >
                    {/* Year */}
                    <td className="px-6 py-5">
                      <span className="font-bold text-blue-700">
                        {cycle.scholarship_year}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-5">
                      <h3 className="font-semibold text-slate-800">
                        {cycle.title}
                      </h3>
                    </td>

                    {/* Start */}
                    <td className="px-6 py-5 text-slate-700">
                      {new Date(cycle.start_date).toLocaleDateString("en-IN")}
                    </td>

                    {/* End */}
                    <td className="px-6 py-5 text-slate-700">
                      {new Date(cycle.end_date).toLocaleDateString("en-IN")}
                    </td>

                    {/* Remaining */}
                    <td className="px-6 py-5">
                      {isUpcoming ? (
                        <span className="text-blue-600 font-semibold">
                          Upcoming
                        </span>
                      ) : isClosed ? (
                        <span className="text-red-600 font-semibold">
                          Expired
                        </span>
                      ) : (
                        <span className="font-semibold text-green-700">
                          {daysLeft} Days Left
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      {isUpcoming ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                          🔵 Upcoming
                        </span>
                      ) : isClosed ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                          🔴 Closed
                        </span>
                      ) : cycle.is_active ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                          🟢 Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                          ⚪ Inactive
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5 text-slate-700">
                      {new Date(cycle.created_at).toLocaleDateString("en-IN")}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => showCycleDetails(cycle)}
                          title="View details"
                          className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(cycle)}
                          disabled={isClosed}
                          title={
                            isClosed
                              ? "Closed scholarship cycle cannot be edited"
                              : "Edit"
                          }
                          className={`w-10 h-10 rounded-lg text-white transition flex items-center justify-center ${
                            isClosed
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          <FaEdit />
                        </button>

                        {/* Activate */}
                        {!cycle.is_active && (
                          <button
                            onClick={() => onActivate(cycle)}
                            disabled={isClosed || cycle.is_active}
                            title={
                              isClosed
                                ? "Expired cycle cannot be activated"
                                : cycle.is_active
                                ? "Already Active"
                                : "Activate"
                            }
                            className={`w-10 h-10 rounded-lg text-white transition flex items-center justify-center ${
                              isClosed || cycle.is_active
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            <FaCheckCircle />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(cycle)}
                          disabled={cycle.is_active || isClosed}
                          title={
                            cycle.is_active
                              ? "Active cycle cannot be deleted"
                              : isClosed
                              ? "Closed cycle cannot be deleted"
                              : "Delete"
                          }
                          className={`w-10 h-10 rounded-lg text-white transition flex items-center justify-center ${
                            cycle.is_active || isClosed
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing
          <span className="font-semibold text-slate-800 mx-1">
            {cycles.length}
          </span>
          cycle{cycles.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

export default CycleTable;