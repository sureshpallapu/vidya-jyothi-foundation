import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaPlus,
  FaSyncAlt,
  FaHandHoldingHeart,
  FaSearch,
  FaEye,
  FaEdit,
  FaUserCheck,
  FaUserTimes,
  FaChevronDown,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";

import {
  getDonors,
  archiveDonor,
  restoreDonor,
} from "../../../api/donorApi";

function AdminDonors() {
  const navigate = useNavigate();

  /* ==========================================================
      State
  ========================================================== */

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ==========================================================
      Load Donors
  ========================================================== */

 const loadDonors = async () => {
  try {
    setLoading(true);

    const response = await getDonors();

console.log("response.data =", response.data);
console.log("response.data.data =", response.data.data);
console.log("response.data.data.data =", response.data.data.data);
console.log(
  "Is Array?",
  Array.isArray(response.data.data.data)
);

setDonors(response?.data?.data?.data || []);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadDonors();
  }, []);

  /* ==========================================================
      Archive / Restore Donor
  ========================================================== */

  const handleStatusChange = async (donor) => {
    const isActive = donor.status === "ACTIVE";

    const result = await Swal.fire({
      title: isActive ? "Archive Donor?" : "Restore Donor?",

      text: isActive
        ? `${donor.full_name} will be archived.`
        : `${donor.full_name} will be restored.`,

      icon: "question",

      showCancelButton: true,

      confirmButtonText: isActive ? "Archive" : "Restore",

      cancelButtonText: "Cancel",

      confirmButtonColor: isActive ? "#dc2626" : "#16a34a",

      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setStatusLoading(donor.donor_code);

      if (isActive) {
        await archiveDonor(donor.donor_code);
      } else {
        await restoreDonor(donor.donor_code);
      }

      await loadDonors();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: isActive
          ? "Donor archived successfully."
          : "Donor restored successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Failed to update donor status.",
      });
    } finally {
      setStatusLoading(null);
    }
  };

  /* ==========================================================
      Statistics
  ========================================================== */
const statistics = useMemo(() => {
  const list = Array.isArray(donors) ? donors : [];

  return {
    total: list.length,

    active: list.filter((d) => d.status === "ACTIVE").length,

    inactive: list.filter((d) => d.status === "INACTIVE").length,

    individual: list.filter(
      (d) => d.donor_type === "Individual"
    ).length,
  };
}, [donors]);

  /* ==========================================================
      Filter Donors
  ========================================================== */

  const filteredDonors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return donors.filter((donor) => {
      const matchesSearch =
        !keyword ||
        donor.full_name?.toLowerCase().includes(keyword) ||
        donor.donor_code?.toLowerCase().includes(keyword) ||
        donor.mobile?.includes(search) ||
        donor.email?.toLowerCase().includes(keyword);

      const matchesType =
        typeFilter === "ALL" || donor.donor_type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" || donor.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [donors, search, typeFilter, statusFilter]);

  /* ==========================================================
      Render
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* ==========================================================
          Header Band
      ========================================================== */}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#151a33] via-[#1c2347] to-[#2a2f63]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-200/80 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                <FaShieldAlt className="text-[13px]" />
                Donor Registry
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Donor Management
              </h1>

              <p className="text-indigo-200/70 mt-2 max-w-xl">
                Manage trust donors, their contact details and giving
                status in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadDonors}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium border border-white/10 backdrop-blur-sm transition"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/donors/add")}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#1c2347] font-semibold hover:bg-indigo-50 shadow-lg shadow-black/20 transition"
              >
                <FaPlus />
                Add Donor
              </button>
            </div>
          </div>

          {/* Stat strip */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
            {[
              {
                label: "Total Donors",
                value: statistics.total,
                icon: FaHandHoldingHeart,
                accent: "from-slate-400 to-slate-500",
              },
              {
                label: "Active",
                value: statistics.active,
                icon: FaCheckCircle,
                accent: "from-emerald-400 to-emerald-500",
              },
              {
                label: "Inactive",
                value: statistics.inactive,
                icon: FaTimesCircle,
                accent: "from-rose-400 to-rose-500",
              },
              {
                label: "Individuals",
                value: statistics.individual,
                icon: FaUser,
                accent: "from-violet-400 to-violet-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm px-5 py-4 overflow-hidden group hover:bg-white/[0.09] transition"
              >
                <div
                  className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.accent} opacity-20 blur-xl group-hover:opacity-30 transition`}
                />

                <div className="flex items-center justify-between relative">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-indigo-200/60 font-medium">
                      {stat.label}
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1.5">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.accent} flex items-center justify-center text-white text-sm shadow-md`}
                  >
                    <stat.icon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================================
          Body
      ========================================================== */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 space-y-6">
        {/* ==========================================================
            Search & Filters
        ========================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="grid lg:grid-cols-[1fr_220px_200px] gap-4">
            {/* Search */}

            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by donor name, code, email or mobile…"
                className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
              />
            </div>

            {/* Donor Type */}

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white transition"
              >
                <option value="ALL">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            </div>

            {/* Status */}

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white transition"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3 pl-1">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {filteredDonors.length}
            </span>{" "}
            of {donors.length} donors
          </p>
        </div>

        {/* ==========================================================
            Donor Table
        ========================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-14 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredDonors.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 text-4xl mb-5">
                <FaHandHoldingHeart />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No donors found
              </h3>

              <p className="text-slate-500 mt-1">
                No donor records match your current filters.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/donors/add")}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                <FaPlus className="text-xs" />
                Add Donor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <th className="px-5 py-3.5 font-semibold">Donor</th>
                    <th className="px-5 py-3.5 font-semibold">
                      Donor Code
                    </th>
                    <th className="px-5 py-3.5 font-semibold">Type</th>
                    <th className="px-5 py-3.5 font-semibold">Contact</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDonors.map((donor, idx) => {
                    const isActive = donor.status === "ACTIVE";
                    const isBusy = statusLoading === donor.donor_code;

                    return (
                      <tr
                        key={donor.id}
                        className={`border-b border-slate-100 last:border-0 hover:bg-indigo-50/40 transition-colors duration-200 ${
                          idx % 2 === 1 ? "bg-slate-50/40" : ""
                        }`}
                      >
                        {/* Donor */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xs shrink-0">
                              {(donor.full_name || "?")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {donor.full_name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {donor.email || "No Email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Code */}

                        <td className="px-5 py-4 font-medium text-slate-700 font-mono text-xs">
                          {donor.donor_code}
                        </td>

                        {/* Type */}

                        <td className="px-5 py-4">
                          <span className="inline-flex px-3 py-1 rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-xs font-medium">
                            {donor.donor_type}
                          </span>
                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">
                          <p className="text-slate-700">{donor.mobile}</p>
                          <p className="text-xs text-slate-400">
                            {donor.email}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View"
                              onClick={() =>
                                navigate(`/admin/donors/${donor.donor_code}`)
                              }
                              className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 text-white flex items-center justify-center transition-all"
                            >
                              <FaEye className="text-xs" />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/admin/donors/${donor.donor_code}/edit`
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-600 hover:-translate-y-0.5 text-white flex items-center justify-center transition-all"
                            >
                              <FaEdit className="text-xs" />
                            </button>

                            <button
                              type="button"
                              title={isActive ? "Archive" : "Restore"}
                              disabled={isBusy}
                              onClick={() => handleStatusChange(donor)}
                              className={`w-9 h-9 rounded-lg text-white flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${
                                isActive
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : "bg-emerald-600 hover:bg-emerald-700"
                              }`}
                            >
                              {isBusy ? (
                                <FaSyncAlt className="text-xs animate-spin" />
                              ) : isActive ? (
                                <FaUserTimes className="text-xs" />
                              ) : (
                                <FaUserCheck className="text-xs" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDonors;