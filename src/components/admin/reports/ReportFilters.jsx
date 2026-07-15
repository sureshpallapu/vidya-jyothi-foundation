function ReportFilters({

  filters,

  setFilters,

  onSearch,

  onReset,

}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <div className="grid md:grid-cols-4 gap-4">

        {/* Status */}

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-3"
        >

          <option value="">
            All Status
          </option>

          <option>
            Submitted
          </option>

          <option>
            Documents Verified
          </option>

          <option>
            Under Review
          </option>

          <option>
            Approved
          </option>

          <option>
            Scholarship Released
          </option>

          <option>
            Rejected
          </option>

        </select>

        {/* District */}

        <input
          type="text"
          placeholder="District"
          value={filters.district}
          onChange={(e) =>
            setFilters({
              ...filters,
              district: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-3"
        />

        {/* Gender */}

        <select
          value={filters.gender}
          onChange={(e) =>
            setFilters({
              ...filters,
              gender: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-3"
        >

          <option value="">
            All Gender
          </option>

          <option>
            Male
          </option>

          <option>
            Female
          </option>

          <option>
            Other
          </option>

        </select>

        {/* Buttons */}

        <div className="flex gap-3">

          <button
            onClick={onSearch}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >

            Search

          </button>

          <button
            onClick={onReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >

            Reset

          </button>

        </div>

      </div>

    </div>

  );

}

export default ReportFilters;