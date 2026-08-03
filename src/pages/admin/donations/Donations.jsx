import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaEye,
  FaEdit,
  FaArchive,
  FaUndo,
  FaBan,
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaTimesCircle,
  FaWallet,
  FaShieldAlt,
  FaFileInvoice,
} from "react-icons/fa";

import {
  getDonations,
  getDonationStatistics,
  getDonationTypes,
  getPaymentModes,
  archiveDonation,
  restoreDonation,
  cancelDonation,
  generateReceipt,
} from "../../../api/donationApi";

const STATUS_STYLES = {
  RECEIVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CLEARED: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  REFUNDED: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

function AdminDonations() {
  const navigate = useNavigate();

  /* ==========================================================
      State
  ========================================================== */

  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [donations, setDonations] = useState([]);
  const [donationTypes, setDonationTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    donationTypeId: "",
    paymentModeId: "",
    financialYear: "",
    includeArchived: false,
  });

  /* ==========================================================
      Actions
  ========================================================== */

const handleView = (donationCode) => {
    navigate(`/admin/donations/${donationCode}`);
};

const handleEdit = (donationCode) => {
    navigate(`/admin/donations/${donationCode}/edit`);
};
  const handleCancel = async (donationCode) => {
    const result = await Swal.fire({
      title: "Cancel Donation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelDonation(donationCode);

      Swal.fire(
        "Cancelled!",
        "Donation cancelled successfully.",
        "success"
      );

      loadDonations();
      loadStatistics();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to cancel donation.",
        "error"
      );
    }
  };

  const handleArchive = async (donationCode) => {
    const result = await Swal.fire({
      title: "Archive Donation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Archive",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await archiveDonation(donationCode);

      Swal.fire(
        "Archived!",
        "Donation archived successfully.",
        "success"
      );

      loadDonations();
      loadStatistics();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to archive donation.",
        "error"
      );
    }
  };

  const handleRestore = async (donationCode) => {
    const result = await Swal.fire({
      title: "Restore Donation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
      confirmButtonColor: "#16a34a",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreDonation(donationCode);

      Swal.fire(
        "Restored!",
        "Donation restored successfully.",
        "success"
      );

      loadDonations();
      loadStatistics();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to restore donation.",
        "error"
      );
    }
  };

  const handleGenerateReceipt = async (donation) => {

  const result = await Swal.fire({
    title: "Generate Receipt?",
    text: `Generate receipt for ${donation.donation_code}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Generate",
    confirmButtonColor: "#16a34a",
  });

  if (!result.isConfirmed) return;

  try {

    const payload = {
      donation_id: donation.id,
      receipt_date: new Date().toISOString().split("T")[0],
      created_by: 1,
      updated_by: 1,
    };

    const response = await generateReceipt(payload);

    Swal.fire({
      icon: "success",
      title: "Receipt Generated",
      text: response.data.message,
    });

    loadDonations();
    loadStatistics();

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "Unable to generate receipt.",
    });

  }

};

  /* ==========================================================
      Loaders
  ========================================================== */

  const loadStatistics = async () => {
    try {
      const response = await getDonationStatistics();
      setStatistics(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDonationTypes = async () => {
    try {
      const response = await getDonationTypes();
      setDonationTypes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPaymentModes = async () => {
    try {
      const response = await getPaymentModes();
      setPaymentModes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDonations = async () => {
    try {
      setLoading(true);

      const response = await getDonations({
        page,
        limit,
        ...filters,
      });

      const data = response.data.data;

      setDonations(data.donations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
    loadDonationTypes();
    loadPaymentModes();
  }, []);

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  /* ==========================================================
      Derived
  ========================================================== */

  const statCards = useMemo(
    () => [
      {
        label: "Total Donations",
        value: statistics.totalDonations || 0,
        icon: FaHandHoldingUsd,
        accent: "from-slate-400 to-slate-500",
        format: (v) => v,
      },
      {
        label: "Received",
        value: statistics.receivedDonations || 0,
        icon: FaCheckCircle,
        accent: "from-emerald-400 to-emerald-500",
        format: (v) => v,
      },
      {
        label: "Cancelled",
        value: statistics.cancelledDonations || 0,
        icon: FaTimesCircle,
        accent: "from-rose-400 to-rose-500",
        format: (v) => v,
      },
      {
        label: "Total Collection",
        value: statistics.totalCollection || 0,
        icon: FaWallet,
        accent: "from-sky-400 to-sky-500",
        format: (v) => `₹ ${Number(v).toLocaleString("en-IN")}`,
      },
      {
        label: "Active Collection",
        value: statistics.activeCollection || 0,
        icon: FaFileInvoice,
        accent: "from-indigo-400 to-indigo-500",
        format: (v) => `₹ ${Number(v).toLocaleString("en-IN")}`,
      },
    ],
    [statistics]
  );

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
                Finance &amp; Receipts
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Donations
              </h1>

              <p className="text-indigo-200/70 mt-2 max-w-xl">
                Manage donations, receipts and payment records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/donations/add")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#1c2347] font-semibold hover:bg-indigo-50 shadow-lg shadow-black/20 transition"
            >
              <FaPlus />
              Add Donation
            </button>
          </div>

          {/* Stat strip */}

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-9">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm px-5 py-4 overflow-hidden group hover:bg-white/[0.09] transition"
              >
                <div
                  className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.accent} opacity-20 blur-xl group-hover:opacity-30 transition`}
                />

                <div className="flex items-center justify-between relative">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-indigo-200/60 font-medium truncate">
                      {stat.label}
                    </p>
                    <h2 className="text-xl font-bold text-white mt-1.5 truncate">
                      {stat.format(stat.value)}
                    </h2>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.accent} flex items-center justify-center text-white text-sm shadow-md shrink-0`}
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
            Filters
        ========================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {/* Search */}

            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

              <input
                type="text"
                placeholder="Search donation code, donor..."
                className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Status */}

            <div className="relative">
              <select
                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white transition"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="RECEIVED">Received</option>
                <option value="CLEARED">Cleared</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            </div>

            {/* Donation Type */}

            <div className="relative">
              <select
                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white transition"
                value={filters.donationTypeId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    donationTypeId: e.target.value,
                  })
                }
              >
                <option value="">All Types</option>
                {donationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            </div>

            {/* Payment Mode */}

            <div className="relative">
              <select
                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 bg-white transition"
                value={filters.paymentModeId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    paymentModeId: e.target.value,
                  })
                }
              >
                <option value="">All Modes</option>
                {paymentModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.mode_name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
            </div>

            {/* Financial Year */}

            <input
              type="text"
              placeholder="2026-27"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
              value={filters.financialYear}
              onChange={(e) =>
                setFilters({ ...filters, financialYear: e.target.value })
              }
            />

            {/* Archived */}

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-indigo-600"
                checked={filters.includeArchived}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    includeArchived: e.target.checked,
                  })
                }
              />
              Show Archived
            </label>
          </div>
        </div>

        {/* ==========================================================
            Table
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
          ) : donations.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 text-4xl mb-5">
                <FaHandHoldingUsd />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No donations found
              </h3>

              <p className="text-slate-500 mt-1">
                No donation records match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <th className="px-4 py-3.5 font-semibold text-left">
                      Donation Code
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-left">
                      Donor
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-left">
                      Mobile
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-left">
                      Donation Type
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-left">
                      Payment Mode
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-right">
                      Amount
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-center">
                      Date
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-center">
                      Status
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-center">
                      Receipt
                    </th>
                    <th className="px-4 py-3.5 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((donation, idx) => (
                    <tr
                      key={donation.id}
                      className={`border-b border-slate-100 last:border-0 hover:bg-indigo-50/40 transition-colors duration-200 ${
                        idx % 2 === 1 ? "bg-slate-50/40" : ""
                      } ${donation.is_archived ? "opacity-60" : ""}`}
                    >
                      {/* Donation Code */}

                      <td className="px-4 py-3.5 font-semibold text-indigo-600 whitespace-nowrap">
                        {donation.donation_code}
                      </td>

                      {/* Donor */}

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800">
                          {donation.full_name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {donation.donor_code}
                        </div>
                      </td>

                      {/* Mobile */}

                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {donation.mobile}
                      </td>

                      {/* Donation Type */}

                      <td className="px-4 py-3.5 text-slate-600">
                        {donation.donation_type}
                      </td>

                      {/* Payment Mode */}

                      <td className="px-4 py-3.5 text-slate-600">
                        {donation.payment_mode}
                      </td>

                      {/* Amount */}

                      <td className="px-4 py-3.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                        ₹ {Number(donation.amount).toLocaleString("en-IN")}
                      </td>

                      {/* Date */}

                      <td className="px-4 py-3.5 text-center text-slate-600 whitespace-nowrap">
                        {new Date(donation.donation_date).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            STATUS_STYLES[donation.status] ||
                            "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                          }`}
                        >
                          {donation.status}
                        </span>
                      </td>

                      {/* Receipt */}

                     <td className="px-4 py-3.5 text-center">
{donation.receipt_generated ? (
  <div className="flex flex-col items-center gap-1">
    <span className="text-emerald-600 font-semibold text-xs">
      Generated
    </span>

    <span className="text-[11px] font-mono text-slate-500">
      {donation.receipt_code}
    </span>

    <button
      onClick={() =>
        navigate(`/admin/receipts/${donation.receipt_code}`)
      }
      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
    >
      View Receipt
    </button>
  </div>
) : (
    <div className="flex flex-col items-center gap-2">
      <span className="text-orange-500 font-semibold text-xs">
        Pending
      </span>

      <button
        onClick={() => handleGenerateReceipt(donation)}
        className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition"
      >
        Generate Receipt
      </button>
    </div>
  )}

</td>

                      {/* Actions */}

                      <td className="px-4 py-3.5">
                        <div className="flex justify-center gap-3">
                          <button
    onClick={() =>
        navigate(`/admin/donations/${donation.donation_code}`)
    }
    className="text-blue-600 hover:text-blue-800"
>
    <FaEye />
</button>

                          {!donation.is_archived &&
                            donation.status !== "CANCELLED" && (
                              <button
                                onClick={() =>
                                  handleEdit(donation.donation_code)
                                }
                                title="Edit"
                                className="text-emerald-600 hover:text-emerald-800 hover:-translate-y-0.5 transition-transform"
                              >
                                <FaEdit />
                              </button>
                            )}

                          {!donation.is_archived &&
                            donation.status !== "CANCELLED" && (
                              <button
                                onClick={() =>
                                  handleCancel(donation.donation_code)
                                }
                                title="Cancel Donation"
                                className="text-rose-600 hover:text-rose-800 hover:-translate-y-0.5 transition-transform"
                              >
                                <FaBan />
                              </button>
                            )}

                          {!donation.is_archived ? (
                            <button
                              onClick={() =>
                                handleArchive(donation.donation_code)
                              }
                              title="Archive"
                              className="text-slate-500 hover:text-slate-800 hover:-translate-y-0.5 transition-transform"
                            >
                              <FaArchive />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleRestore(donation.donation_code)
                              }
                              title="Restore"
                              className="text-indigo-600 hover:text-indigo-800 hover:-translate-y-0.5 transition-transform"
                            >
                              <FaUndo />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==========================================================
            Pagination
        ========================================================== */}

        <div className="flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Previous
          </button>

          <span className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-700">{page}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalPages}
            </span>
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDonations;