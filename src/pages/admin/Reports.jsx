import { useEffect, useState } from "react";

import { getApplicationReport } from "../../api/reportApi";
import ReportFilters from "../../components/admin/reports/ReportFilters";
import ReportTable from "../../components/admin/reports/ReportTable";
import { exportReportsToExcel }
from "../../utils/exportExcel";

import { exportReportsToPDF }
from "../../utils/exportPdf";
import ReportSummary from "../../components/admin/reports/ReportSummary";

function Reports() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    district: "",
    gender: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Load Reports
  |--------------------------------------------------------------------------
  */
  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await getApplicationReport(filters);
      setReports(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleReset = () => {
    setFilters({
      status: "",
      district: "",
      gender: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-500 mt-2">
          Scholarship Application Reports
        </p>
      </div>

      <ReportFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={loadReports}
        onReset={handleReset}
      />

<ReportSummary
  reports={reports}
/>


<div className="flex justify-end gap-3">

  <button
    onClick={() =>
      exportReportsToExcel(reports)
    }
    className="
      bg-green-600
      hover:bg-green-700
      text-white
      px-5
      py-3
      rounded-lg
      font-medium
    "
  >
    Export Excel
  </button>

  <button
    onClick={() =>
      exportReportsToPDF(reports)
    }
    className="
      bg-red-600
      hover:bg-red-700
      text-white
      px-5
      py-3
      rounded-lg
      font-medium
    "
  >
    Export PDF
  </button>
<button
  onClick={() => window.print()}
  className="
    bg-slate-700
    hover:bg-slate-800
    text-white
    px-5
    py-3
    rounded-lg
    font-medium
  "
>
  Print
</button>
</div>


      <ReportTable reports={reports} loading={loading} />
    </div>
  );
}

export default Reports;