import { useEffect, useState } from "react";

const EMPTY_FORM = {
  username: "",
  full_name: "",
  email: "",
  mobile: "",
  role: "VERIFICATION_OFFICER",
  status: "ACTIVE",
  password: "",
  confirmPassword: "",
};

function AdminFormModal({ open, onClose, onSave, admin }) {
  const isEdit = Boolean(admin);

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        full_name: admin.full_name,
        email: admin.email || "",
        mobile: admin.mobile || "",
        role: admin.role,
        status: admin.status,
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.full_name || !formData.username || !formData.role) {
      return alert("Please fill all required fields.");
    }

    if (!isEdit && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    onSave(formData);
  };

  // Bail out before rendering anything when the modal is closed.
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-5">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Administrator" : "Add Administrator"}
          </h2>
          <p className="text-blue-100 mt-1">
            {isEdit
              ? "Update administrator information."
              : "Create a new administrator account."}
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isEdit}
                className={`w-full border rounded-xl px-4 py-3 outline-none ${
                  isEdit
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="VERIFICATION_OFFICER">
                  Verification Officer
                </option>
                <option value="REVIEW_OFFICER">Review Officer</option>
                <option value="ACCOUNTS">Accounts</option>
                <option value="FOUNDER">Founder</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Password (only when creating a new admin) */}
            {!isEdit && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-8 py-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {isEdit ? "Update Administrator" : "Create Administrator"}
          </button>
        </div>
      </div>
    </div>
    
  );
}

export default AdminFormModal;