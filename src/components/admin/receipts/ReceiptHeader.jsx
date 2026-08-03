import {
  FaFileInvoiceDollar,
  FaFileExcel,
  FaFilePdf,
  FaSyncAlt,
} from "react-icons/fa";

export default function ReceiptHeader({
  onRefresh,
  onExportExcel,
  onExportPDF,
}) {
  return (
    <div className="bg-white rounded-xl shadow border">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">

              <FaFileInvoiceDollar
                className="text-indigo-600"
                size={24}
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold">

                Receipt Management

              </h1>

              <p className="text-gray-500 mt-1">

                Manage donation receipts, print,
                archive and download PDF copies.

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-3">

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 transition"
          >
            <FaSyncAlt />

            Refresh
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition"
          >
            <FaFileExcel />

            Export Excel
          </button>

          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition"
          >
            <FaFilePdf />

            Export PDF
          </button>

        </div>

      </div>

    </div>
  );
}