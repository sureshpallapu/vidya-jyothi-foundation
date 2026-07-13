import {
  FaEye,
  FaEdit,
  FaTrash,
  FaKey,
  FaUserShield,
  FaUserCheck,
} from "react-icons/fa";

const ROLE_BADGES = {
  SUPER_ADMIN: {
    label: "Super Admin",
    emoji: "👑",
    className: "bg-purple-100 text-purple-700",
  },
  FOUNDER: {
    label: "Founder",
    emoji: "⭐",
    className: "bg-indigo-100 text-indigo-700",
  },
  VERIFICATION_OFFICER: {
    label: "Verification Officer",
    emoji: "📄",
    className: "bg-blue-100 text-blue-700",
  },
  REVIEW_OFFICER: {
    label: "Review Officer",
    emoji: "🔍",
    className: "bg-yellow-100 text-yellow-700",
  },
  ACCOUNTS: {
    label: "Accounts",
    emoji: "💰",
    className: "bg-green-100 text-green-700",
  },
};

function AdminTable({
  admins,
  loading,
  onView,
  onEdit,
  onStatus,
  onResetPassword,
  onDelete,
}) {
  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */
  if (admins.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center">
        <div className="text-7xl">👤</div>
        <h2 className="mt-5 text-2xl font-bold text-gray-800">
          No Administrators Found
        </h2>
        <p className="text-gray-500 mt-2">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Table
  |--------------------------------------------------------------------------
  */
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600">
              <th className="px-6 py-4 text-left">Administrator</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => {
              const protectedAdmin =
                admin.role === "SUPER_ADMIN" || admin.role === "FOUNDER";
              const roleBadge = ROLE_BADGES[admin.role];

              return (
                <tr
                  key={admin.id}
                  className="hover:bg-blue-50/60 transition-colors duration-150"
                >
                  {/* Administrator */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserShield className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {admin.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {admin.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-6 py-5 font-medium text-gray-800">
                    {admin.username}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-5">
                    {roleBadge ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.className}`}
                      >
                        {roleBadge.emoji} {roleBadge.label}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                        {admin.role}
                      </span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-800">
                      {admin.mobile || "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {admin.email || "-"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    {admin.status === "ACTIVE" ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        🟢 Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        🔴 Inactive
                      </span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="px-6 py-5 text-gray-700">
                    {new Date(admin.created_at).toLocaleDateString("en-IN")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => onView(admin)}
                        className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
                        title="View"
                      >
                        <FaEye />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(admin)}
                        className="w-10 h-10 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition flex items-center justify-center"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* Status */}
                      <button
                        disabled={protectedAdmin}
                        onClick={() => onStatus(admin)}
                        title={
                          protectedAdmin
                            ? "Protected Administrator"
                            : "Activate / Deactivate"
                        }
                        className={`w-10 h-10 rounded-lg text-white transition flex items-center justify-center ${
                          protectedAdmin
                            ? "bg-gray-300 cursor-not-allowed"
                            : admin.status === "ACTIVE"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        <FaUserCheck />
                      </button>

                      {/* Reset Password */}
                      <button
                        onClick={() => onResetPassword(admin)}
                        className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition flex items-center justify-center"
                        title="Reset Password"
                      >
                        <FaKey />
                      </button>

                      {/* Delete */}
                      <button
                        disabled={protectedAdmin}
                        onClick={() => onDelete(admin)}
                        title={
                          protectedAdmin
                            ? "Protected Administrator"
                            : "Delete"
                        }
                        className={`w-10 h-10 rounded-lg text-white transition flex items-center justify-center ${
                          protectedAdmin
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
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing
          <span className="font-semibold text-gray-800 mx-1">
            {admins.length}
          </span>
          administrator{admins.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}

export default AdminTable;