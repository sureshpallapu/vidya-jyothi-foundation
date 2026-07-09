import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

import {
  getScholarshipCycles,
  createScholarshipCycle,
  updateScholarshipCycle,
  activateScholarshipCycle,
  deleteScholarshipCycle,
} from "../../../api/scholarshipCycleApi";import CycleFormModal from "./CycleFormModal";
import CycleTable from "../../../components/admin/scholarshipCycles/CycleTable";
function ScholarshipCycles() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedCycle, setSelectedCycle] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      setLoading(true);

      const response =
        await getScholarshipCycles();

      setCycles(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  /*
|--------------------------------------------------------------------------
| Save Scholarship Cycle
|--------------------------------------------------------------------------
*/

const handleSave = async (formData) => {
  try {

    if (
      new Date(formData.end_date) <
      new Date(formData.start_date)
    ) {

      return Swal.fire({
        icon: "warning",
        title: "Invalid Dates",
        text: "End Date cannot be earlier than Start Date.",
      });

    }

    if (selectedCycle) {

      await updateScholarshipCycle(
        selectedCycle.id,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Scholarship Cycle updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

    } else {

      await createScholarshipCycle(formData);

      Swal.fire({
        icon: "success",
        title: "Created Successfully",
        text: "Scholarship Cycle created successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

    }

    setShowModal(false);

    setSelectedCycle(null);

    loadCycles();

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to save scholarship cycle.",
    });

  }
};

/*
|--------------------------------------------------------------------------
| Activate Scholarship Cycle
|--------------------------------------------------------------------------
*/

const handleActivate = async (cycle) => {

  const result = await Swal.fire({

    title: "Activate Scholarship Cycle?",

    html: `
      <strong>${cycle.title}</strong><br/>
      Academic Year : ${cycle.scholarship_year}
      <br/><br/>
      Only one scholarship cycle can remain active.
    `,

    icon: "question",

    showCancelButton: true,

    confirmButtonColor: "#16a34a",

    confirmButtonText: "Activate",

    cancelButtonText: "Cancel",

  });

  if (!result.isConfirmed) return;

  try {

    await activateScholarshipCycle(cycle.id);

    Swal.fire({

      icon: "success",

      title: "Activated",

      text:
        "Scholarship Cycle activated successfully.",

      timer: 1800,

      showConfirmButton: false,

    });

    loadCycles();

  } catch (error) {

    Swal.fire({

      icon: "error",

      title: "Activation Failed",

      text:
        "Unable to activate scholarship cycle.",

    });

  }

};

/*
|--------------------------------------------------------------------------
| Delete Scholarship Cycle
|--------------------------------------------------------------------------
*/

const handleDelete = async (cycle) => {

  if (cycle.is_active) {

    return Swal.fire({

      icon: "warning",

      title: "Active Scholarship Cycle",

      text:
        "Deactivate this scholarship cycle before deleting it.",

    });

  }

  const result = await Swal.fire({

    title: "Delete Scholarship Cycle?",

    text:
      "This action cannot be undone.",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#dc2626",

    cancelButtonColor: "#6b7280",

    confirmButtonText: "Delete",

    cancelButtonText: "Cancel",

  });

  if (!result.isConfirmed) return;

  try {

    await deleteScholarshipCycle(cycle.id);

    Swal.fire({

      icon: "success",

      title: "Deleted",

      text:
        "Scholarship Cycle deleted successfully.",

      timer: 1800,

      showConfirmButton: false,

    });

    loadCycles();

  } catch (error) {

    Swal.fire({

      icon: "error",

      title: "Delete Failed",

      text:
        "Unable to delete scholarship cycle.",

    });

  }

};
  /*
  |--------------------------------------------------------------------------
  | Search Filter
  |--------------------------------------------------------------------------
  */

  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => {
      return (
        cycle.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        cycle.scholarship_year
          ?.toString()
          .includes(search)
      );
    });
  }, [cycles, search]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const stats = {
    total: cycles.length,

    active: cycles.filter(
      (cycle) => cycle.is_active
    ).length,

    inactive: cycles.filter(
      (cycle) => !cycle.is_active
    ).length,
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-8 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">

            Scholarship Cycles

          </h1>

          <p className="text-gray-500 mt-2">

            Manage Scholarship Application Cycles

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={loadCycles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <FaSyncAlt />

            Refresh

          </button>

          <button
            onClick={() => {
              setSelectedCycle(null);
              setShowModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <FaPlus />

            Add Cycle

          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">

            Total Cycles

          </p>

          <h2 className="text-4xl font-bold mt-2 text-gray-800">

            {stats.total}

          </h2>

        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl shadow p-6">

          <p className="text-green-700">

            Active

          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-700">

            {stats.active}

          </h2>

        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow p-6">

          <p className="text-gray-600">

            Inactive

          </p>

          <h2 className="text-4xl font-bold mt-2 text-gray-700">

            {stats.inactive}

          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="relative">

          <FaSearch
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by Scholarship Year or Title..."
            className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

        </div>

      </div>

      {/* Table Placeholder */}

      {/* Cycle Table */}

<div className="bg-white rounded-2xl shadow overflow-hidden">

<CycleTable
  cycles={filteredCycles}
  loading={loading}
  onEdit={(cycle) => {
    setSelectedCycle(cycle);
    setShowModal(true);
  }}
  onDelete={handleDelete}
  onActivate={handleActivate}
/>

</div>

      {/* Modal Placeholder */}

<CycleFormModal

  open={showModal}

  cycle={selectedCycle}

  onClose={() => {

    setShowModal(false);

    setSelectedCycle(null);

  }}

  onSave={handleSave}

/>

    </div>
  );
}

export default ScholarshipCycles;