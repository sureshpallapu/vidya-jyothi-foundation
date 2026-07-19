import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaPlus,
  FaSyncAlt,
  FaSearch,
  FaEye,
  FaEdit,
  FaUserTie,
  FaGlobe,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

import {
  getTrustees,
  updateTrusteeStatus,
} from "../../../api/trusteeApi";

function Trustees() {
  const navigate = useNavigate();

  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  /*
  |--------------------------------------------------------------------------
  | Load Trustees
  |--------------------------------------------------------------------------
  */

  const loadTrustees = async () => {
    try {
      setLoading(true);

      const response = await getTrustees();

      setTrustees(response.data.data || []);
    } catch (error) {
      console.error("Failed to load trustees:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Trustees",
        text:
          error.response?.data?.message ||
          "Failed to fetch trustee records.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrustees();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    return {
      total: trustees.length,

      active: trustees.filter(
        (trustee) =>
          Number(trustee.is_active) === 1
      ).length,

      inactive: trustees.filter(
        (trustee) =>
          Number(trustee.is_active) === 0
      ).length,

      publicProfiles: trustees.filter(
        (trustee) =>
          Number(trustee.show_on_website) === 1 &&
          Number(trustee.is_active) === 1
      ).length,
    };
  }, [trustees]);

  /*
  |--------------------------------------------------------------------------
  | Unique Designations
  |--------------------------------------------------------------------------
  */

  const designations = useMemo(() => {
    return [
      ...new Set(
        trustees
          .map((trustee) => trustee.designation)
          .filter(Boolean)
      ),
    ];
  }, [trustees]);

  /*
  |--------------------------------------------------------------------------
  | Filter Trustees
  |--------------------------------------------------------------------------
  */

  const filteredTrustees = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return trustees.filter((trustee) => {
      const matchesSearch =
        !searchValue ||
        trustee.full_name
          ?.toLowerCase()
          .includes(searchValue) ||
        trustee.trustee_code
          ?.toLowerCase()
          .includes(searchValue) ||
        trustee.mobile_number
          ?.toLowerCase()
          .includes(searchValue) ||
        trustee.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesDesignation =
        designationFilter === "ALL" ||
        trustee.designation ===
          designationFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          Number(trustee.is_active) === 1) ||
        (statusFilter === "INACTIVE" &&
          Number(trustee.is_active) === 0);

      return (
        matchesSearch &&
        matchesDesignation &&
        matchesStatus
      );
    });
  }, [
    trustees,
    search,
    designationFilter,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Activate / Deactivate Trustee
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (trustee) => {
    const currentlyActive =
      Number(trustee.is_active) === 1;

    const action = currentlyActive
      ? "deactivate"
      : "activate";

    const result = await Swal.fire({
      title: currentlyActive
        ? "Deactivate Trustee?"
        : "Activate Trustee?",

      text: currentlyActive
        ? `${trustee.full_name} will be marked as inactive.`
        : `${trustee.full_name} will be marked as active.`,

      icon: "question",

      showCancelButton: true,

      confirmButtonText: currentlyActive
        ? "Deactivate"
        : "Activate",

      cancelButtonText: "Cancel",

      confirmButtonColor: currentlyActive
        ? "#dc2626"
        : "#16a34a",

      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setStatusLoading(trustee.id);

      await updateTrusteeStatus(
        trustee.id,
        currentlyActive ? 0 : 1
      );

      await loadTrustees();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Trustee ${action}d successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Trustee status update failed:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Failed to update trustee status.",
      });
    } finally {
      setStatusLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Trustee Image
  |--------------------------------------------------------------------------
  */

  const getTrusteeImage = (image) => {
    if (!image) {
      return null;
    }

    return `http://localhost:5000/uploads/trustees/${image}`;
  };

  return (
    <div className="space-y-6">

      {/* ================================================================
          Header
      ================================================================= */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Trustee Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage Foundation Trustees, profiles and website visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={loadTrustees}
            className="
              flex
              items-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            <FaSyncAlt />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/trustees/add")
            }
            className="
              flex
              items-center
              gap-2
              bg-violet-600
              hover:bg-violet-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            <FaPlus />

            Add Trustee
          </button>

        </div>
      </div>

      {/* ================================================================
          Statistics
      ================================================================= */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Trustees
              </p>

              <p className="text-3xl font-bold text-slate-800 mt-2">
                {statistics.total}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FaUserTie />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">
                Active
              </p>

              <p className="text-3xl font-bold text-green-700 mt-2">
                {statistics.active}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
              <FaUserCheck />
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">
                Inactive
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {statistics.inactive}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
              <FaUserTimes />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">
                Public Profiles
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {statistics.publicProfiles}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
              <FaGlobe />
            </div>
          </div>
        </div>

      </div>

      {/* ================================================================
          Search & Filters
      ================================================================= */}

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <div className="grid lg:grid-cols-[1fr_230px_200px] gap-4">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, trustee code, email, or mobile..."
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                py-3
                pl-11
                pr-4
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
              "
            />

          </div>

          <select
            value={designationFilter}
            onChange={(e) =>
              setDesignationFilter(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="ALL">
              All Designations
            </option>

            {designations.map(
              (designation) => (
                <option
                  key={designation}
                  value={designation}
                >
                  {designation}
                </option>
              )
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

        </div>

      </div>

      {/* ================================================================
          Trustee Table
      ================================================================= */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {loading ? (

          <div className="py-20 text-center text-gray-500">
            Loading trustees...
          </div>

        ) : filteredTrustees.length === 0 ? (

          <div className="py-20 text-center">

            <FaUserTie className="mx-auto text-5xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700 mt-4">
              No Trustees Found
            </h3>

            <p className="text-gray-500 mt-1">
              No trustee records match your current filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-gray-50 border-b">

                <tr className="text-left text-sm text-gray-600">

                  <th className="px-5 py-4">
                    Trustee
                  </th>

                  <th className="px-5 py-4">
                    Trustee Code
                  </th>

                  <th className="px-5 py-4">
                    Designation
                  </th>

                  <th className="px-5 py-4">
                    Contact
                  </th>

                  <th className="px-5 py-4">
                    Website
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTrustees.map(
                  (trustee) => (

                    <tr
                      key={trustee.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* Trustee */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {trustee.profile_image ? (

                            <img
                              src={getTrusteeImage(
                                trustee.profile_image
                              )}
                              alt=""
                              className="w-11 h-11 rounded-full object-cover border"
                            />

                          ) : (

                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {trustee.full_name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                          )}

                          <div>

                            <p className="font-semibold text-slate-800">
                              {trustee.full_name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {trustee.email ||
                                "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Code */}

                      <td className="px-5 py-4">

                        <span className="font-semibold text-gray-700">
                          {trustee.trustee_code}
                        </span>

                      </td>

                      {/* Designation */}

                      <td className="px-5 py-4">

                        <span className="inline-flex px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-medium">
                          {trustee.designation}
                        </span>

                      </td>

                      {/* Contact */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-gray-800">
                          {trustee.mobile_number}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {trustee.email || "-"}
                        </p>

                      </td>

                      {/* Website */}

                      <td className="px-5 py-4">

                        {Number(
                          trustee.show_on_website
                        ) === 1 ? (

                          <span className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            Public
                          </span>

                        ) : (

                          <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                            Hidden
                          </span>

                        )}

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        {Number(
                          trustee.is_active
                        ) === 1 ? (

                          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Active
                          </span>

                        ) : (

                          <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                            Inactive
                          </span>

                        )}

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            title="View Trustee"
                            onClick={() =>
                              navigate(
                                `/admin/trustees/${trustee.id}`
                              )
                            }
                            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            title="Edit Trustee"
                            onClick={() =>
                              navigate(
                                `/admin/trustees/${trustee.id}/edit`
                              )
                            }
                            className="w-10 h-10 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            disabled={
                              statusLoading ===
                              trustee.id
                            }
                            title={
                              Number(
                                trustee.is_active
                              ) === 1
                                ? "Deactivate Trustee"
                                : "Activate Trustee"
                            }
                            onClick={() =>
                              handleStatusChange(
                                trustee
                              )
                            }
                            className={`
                              w-10
                              h-10
                              rounded-lg
                              text-white
                              flex
                              items-center
                              justify-center
                              transition
                              disabled:opacity-50
                              ${
                                Number(
                                  trustee.is_active
                                ) === 1
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : "bg-green-600 hover:bg-green-700"
                              }
                            `}
                          >
                            {Number(
                              trustee.is_active
                            ) === 1 ? (
                              <FaUserTimes />
                            ) : (
                              <FaUserCheck />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Trustees;