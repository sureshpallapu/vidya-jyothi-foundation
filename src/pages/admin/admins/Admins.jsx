import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSyncAlt, FaSearch, FaFilePdf, FaFileExcel } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  resetAdminPassword,
  deleteAdmin,
} from "../../../api/adminManagementApi";
import AdminTable from "../../../components/admin/admins/AdminTable";
import AdminFormModal from "../../../components/admin/admins/AdminFormModal";
import AdminViewModal from "../../../components/admin/admins/AdminViewModal";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "VERIFICATION_OFFICER", label: "Verification Officer" },
  { value: "REVIEW_OFFICER", label: "Review Officer" },
  { value: "ACCOUNTS", label: "Accounts" },
  { value: "FOUNDER", label: "Founder" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

function Admins() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAdmins();
      setAdmins(response.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load administrators.",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Administrator (create or update)
  |--------------------------------------------------------------------------
  */
  const handleSave = async (formData) => {
    try {
      if (selectedAdmin) {
        await updateAdmin(selectedAdmin.id, formData);
        Swal.fire({
          icon: "success",
          title: "Administrator Updated",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createAdmin(formData);
        Swal.fire({
          icon: "success",
          title: "Administrator Created",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setShowModal(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change Administrator Status
  |--------------------------------------------------------------------------
  */
  const handleStatus = async (admin) => {
    const nextStatus = admin.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const result = await Swal.fire({
      title:
        nextStatus === "ACTIVE"
          ? "Activate Administrator?"
          : "Deactivate Administrator?",
      text: `${admin.full_name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "ACTIVE" ? "#16a34a" : "#ea580c",
      confirmButtonText: nextStatus === "ACTIVE" ? "Activate" : "Deactivate",
    });

    if (!result.isConfirmed) return;

    try {
      await updateAdminStatus(admin.id, nextStatus);
      Swal.fire({
        icon: "success",
        title: `Administrator ${nextStatus.toLowerCase()}`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadAdmins();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.response?.data?.message || "Unable to update status.",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Administrator Password
  |--------------------------------------------------------------------------
  */
  const handleResetPassword = async (admin) => {
    const { value: password } = await Swal.fire({
      title: "Reset Password",
      html: `
        <p class="mb-3">
          Enter a new password for
          <br>
          <strong>${admin.full_name}</strong>
        </p>
      `,
      input: "password",
      inputPlaceholder: "Enter new password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Reset Password",
      confirmButtonColor: "#7C3AED",
      inputValidator: (value) => {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
      },
    });

    if (!password) return;

    try {
      await resetAdminPassword(admin.id, password);
      Swal.fire({
        icon: "success",
        title: "Password Reset Successfully",
        text: `${admin.full_name}'s password has been updated.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: error.response?.data?.message || "Unable to reset password.",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Administrator
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (admin) => {
    const result = await Swal.fire({
      title: "Delete Administrator?",
      html: `
        <p>
          Are you sure you want to delete
          <br>
          <strong>${admin.full_name}</strong>?
        </p>
        <br>
        <span style="color:#dc2626">
          This action cannot be undone.
        </span>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdmin(admin.id);
      Swal.fire({
        icon: "success",
        title: "Administrator Deleted",
        timer: 1500,
        showConfirmButton: false,
      });
      loadAdmins();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Unable to delete administrator.",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search & Filters
  |--------------------------------------------------------------------------
  */
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        admin.full_name?.toLowerCase().includes(keyword) ||
        admin.username?.toLowerCase().includes(keyword) ||
        admin.email?.toLowerCase().includes(keyword) ||
        admin.mobile?.includes(search);

      const matchesRole = roleFilter === "ALL" || admin.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || admin.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | Dashboard Statistics
  |--------------------------------------------------------------------------
  */
  const stats = {
    total: admins.length,
    active: admins.filter((admin) => admin.status === "ACTIVE").length,
    inactive: admins.filter((admin) => admin.status === "INACTIVE").length,
    superAdmins: admins.filter((admin) => admin.role === "SUPER_ADMIN").length,
    verification: admins.filter(
      (admin) => admin.role === "VERIFICATION_OFFICER"
    ).length,
    review: admins.filter((admin) => admin.role === "REVIEW_OFFICER").length,
    accounts: admins.filter((admin) => admin.role === "ACCOUNTS").length,
    founders: admins.filter((admin) => admin.role === "FOUNDER").length,
  };

  const statCards = [
    { label: "Total", value: stats.total, className: "bg-white" },
    {
      label: "Active",
      value: stats.active,
      className: "bg-green-50 border border-green-200 text-green-700",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      className: "bg-red-50 border border-red-200 text-red-700",
    },
    {
      label: "Super Admin",
      value: stats.superAdmins,
      className: "bg-blue-50 border border-blue-200 text-blue-700",
    },
    {
      label: "Verification",
      value: stats.verification,
      className: "bg-yellow-50 border border-yellow-200 text-yellow-700",
    },
    {
      label: "Review",
      value: stats.review,
      className: "bg-purple-50 border border-purple-200 text-purple-700",
    },
    {
      label: "Accounts",
      value: stats.accounts,
      className: "bg-orange-50 border border-orange-200 text-orange-700",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */
  return (
    <div className="p-8 space-y-6">
      {/* ------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Administrator Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage Foundation Administrators, Roles & Permissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadAdmins}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition"
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow transition">
            <FaFilePdf />
            Export PDF
          </button>

          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition">
            <FaFileExcel />
            Export Excel
          </button>

          <button
            onClick={() => {
              setSelectedAdmin(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow transition"
          >
            <FaPlus />
            Add Administrator
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Statistics */}
      {/* ------------------------------------------------------ */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl shadow p-5 ${card.className}`}
          >
            <p className="text-sm opacity-80">{card.label}</p>
            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* Search & Filters */}
      {/* ------------------------------------------------------ */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username, email, or mobile..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-56"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-48"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Table */}
      {/* ------------------------------------------------------ */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <AdminTable
          admins={filteredAdmins}
          loading={loading}
          onView={(admin) => setViewAdmin(admin)}
          onEdit={(admin) => {
            setSelectedAdmin(admin);
            setShowModal(true);
          }}
          onStatus={handleStatus}
          onResetPassword={handleResetPassword}
          onDelete={handleDelete}
        />
      </div>

      {/* ------------------------------------------------------ */}
      {/* Add / Edit Administrator Modal */}
      {/* ------------------------------------------------------ */}
      <AdminFormModal
        open={showModal}
        admin={selectedAdmin}
        onClose={() => {
          setShowModal(false);
          setSelectedAdmin(null);
        }}
        onSave={handleSave}
      />

      {/* ------------------------------------------------------ */}
      {/* View Administrator Modal */}
      {/* ------------------------------------------------------ */}
      <AdminViewModal
        open={Boolean(viewAdmin)}
        admin={viewAdmin}
        onClose={() => setViewAdmin(null)}
      />
    </div>
  );
}

export default Admins;