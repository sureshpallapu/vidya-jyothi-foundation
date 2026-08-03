import { FaSearch, FaUndo } from "react-icons/fa";

export default function ReceiptFilters({
  filters,
  setFilters,
  onSearch,
  onReset,
}) {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-lg font-semibold mb-5">
        Search & Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {/* Search */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Search
          </label>

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Receipt / Donation / Donor"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Status */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Receipt Status
          </label>

          <select
            name="receiptStatus"
            value={filters.receiptStatus}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="GENERATED">Generated</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Receipt Type */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Receipt Type
          </label>

          <select
            name="receiptType"
            value={filters.receiptType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="ORIGINAL">Original</option>
            <option value="DUPLICATE">Duplicate</option>
            <option value="REPRINT">Reprint</option>
          </select>
        </div>

        {/* Financial Year */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Financial Year
          </label>

          <input
            type="text"
            name="financialYear"
            value={filters.financialYear}
            onChange={handleChange}
            placeholder="2026-2027"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* From Date */}

        <div>
          <label className="block text-sm font-medium mb-2">
            From Date
          </label>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* To Date */}

        <div>
          <label className="block text-sm font-medium mb-2">
            To Date
          </label>

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2 border rounded-lg hover:bg-gray-100"
        >
          <FaUndo />

          Reset
        </button>

        <button
          onClick={onSearch}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaSearch />

          Search
        </button>

      </div>

    </div>
  );
}