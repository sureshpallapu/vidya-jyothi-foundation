import { Link } from "react-router-dom";
import {
  FaEye,
  FaSort,
  FaUserGraduate,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

// Generates a consistent color pair for a student's initials avatar,
// so each student reads as a distinct person at a glance without needing a photo.
const AVATAR_PALETTE = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
];

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColors(name = "") {
  const index =
    name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

function ApplicationTable({ applications, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4 text-left">
                <button className="flex items-center gap-1.5 hover:text-slate-700 transition">
                  Application
                  <FaSort className="text-[10px]" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">College</th>
              <th className="px-6 py-4 text-left">District</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Applied</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">
                      📂
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-slate-800">
                      No applications found
                    </h2>
                    <p className="text-slate-500 mt-1.5 text-sm">
                      Try changing your filters or search.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map((application) => {
                const avatar = getAvatarColors(application.student_name);
                return (
                  <tr
                    key={application.id}
                    className="group hover:bg-yellow-50/60 transition-colors duration-150"
                  >
                    {/* Application ID */}
                    <td className="px-6 py-4 align-top">
                      <p className="font-semibold text-slate-800">
                        {application.application_id}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ID #{application.id}
                      </p>
                    </td>

                    {/* Student */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${avatar.bg} ${avatar.text}`}
                        >
                          {getInitials(application.student_name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {application.student_name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <FaPhoneAlt className="text-[10px] shrink-0" />
                            <span className="truncate">{application.mobile}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <FaEnvelope className="text-[10px] shrink-0" />
                            <span className="truncate">
                              {application.email || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* College */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <FaUniversity className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {application.college_name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {application.course || "-"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {application.study_year || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* District */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <FaMapMarkerAlt className="text-red-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {application.district}
                          </p>
                          <p className="text-xs text-slate-500">
                            {application.state || "Andhra Pradesh"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-top">
                      <StatusBadge status={application.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <FaCalendarAlt className="text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {new Date(
                              application.created_at
                            ).toLocaleDateString("en-IN")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(
                              application.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex justify-center">
                        <Link
                          to={`/admin/applications/${application.id}`}
                          className="
                            inline-flex items-center gap-2
                            bg-blue-600 group-hover:bg-blue-700
                            text-white text-sm font-medium
                            px-4 py-2 rounded-lg
                            shadow-sm hover:shadow
                            transition-all duration-150
                          "
                        >
                          <FaEye className="text-xs" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      {applications.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Showing
            <span className="font-semibold text-slate-800 mx-1">
              {applications.length}
            </span>
            application{applications.length === 1 ? "" : "s"}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="
                flex items-center gap-1.5
                px-3.5 py-2 rounded-lg
                border border-slate-200 bg-white
                text-sm text-slate-600
                hover:bg-slate-100 hover:text-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              "
              disabled
            >
              <FaChevronLeft className="text-xs" />
              Previous
            </button>

            <button className="w-9 h-9 rounded-lg bg-blue-600 text-white text-sm font-semibold">
              1
            </button>

            <button
              className="
                flex items-center gap-1.5
                px-3.5 py-2 rounded-lg
                border border-slate-200 bg-white
                text-sm text-slate-600
                hover:bg-slate-100 hover:text-slate-800
                transition
              "
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationTable;