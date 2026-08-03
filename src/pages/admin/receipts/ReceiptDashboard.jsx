import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaReceipt,
  FaSearch,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import { getReceiptStatistics } from "../../../api/receiptApi";

import ReceiptStats from "../../../components/admin/receipts/ReceiptStats";

export default function ReceiptDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await getReceiptStatistics();

      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Receipt Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor receipt statistics and access receipt management.
          </p>

        </div>

        <button
          onClick={() => navigate("/admin/receipts/list")}
          className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow transition"
        >
          <FaReceipt />

          View All Receipts

          <FaArrowRight />
        </button>

      </div>

      {/* ====================================================== */}
      {/* Statistics */}
      {/* ====================================================== */}

      <ReceiptStats
        stats={stats}
        loading={loading}
      />

      {/* ====================================================== */}
      {/* Quick Actions */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Receipt Management */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold text-slate-800">
                Receipt Management
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Search, filter, print, archive and manage all receipts.
              </p>

            </div>

            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">

              <FaReceipt
                size={26}
                className="text-indigo-600"
              />

            </div>

          </div>

          <button
            onClick={() => navigate("/admin/receipts/list")}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition"
          >
            Open Receipt Management
          </button>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold text-slate-800">
                Search Receipts
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Quickly locate receipts using donor name, donation code or receipt number.
              </p>

            </div>

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

              <FaSearch
                size={24}
                className="text-green-600"
              />

            </div>

          </div>

          <button
            onClick={() => navigate("/admin/receipts/list")}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition"
          >
            Search Receipts
          </button>

        </div>

        {/* Reports */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-lg font-semibold text-slate-800">
                Reports & Analytics
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                View receipt trends and financial summaries.
              </p>

            </div>

            <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">

              <FaChartLine
                size={24}
                className="text-yellow-600"
              />

            </div>

          </div>

          <button
            disabled
            className="mt-6 w-full bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed"
          >
            Coming Soon
          </button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* Information */}
      {/* ====================================================== */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white p-8 shadow">

        <h2 className="text-2xl font-semibold">
          Receipt Management
        </h2>

        <p className="mt-3 text-indigo-100 leading-7">
          Use the Receipt Management module to search receipts, print,
          download PDFs, archive, restore, cancel receipts and export
          reports. The dashboard is intended to provide a quick overview
          of receipt statistics, while all operational activities are
          performed from the Receipt Management page.
        </p>

        <button
          onClick={() => navigate("/admin/receipts/list")}
          className="mt-6 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          Go to Receipt Management
        </button>

      </div>

    </div>
  );
}