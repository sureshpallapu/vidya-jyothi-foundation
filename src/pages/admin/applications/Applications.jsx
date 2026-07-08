import { useEffect, useMemo, useState } from "react";

import {
  FaSearch,
  FaSyncAlt,
  FaFileAlt,
  FaCheckCircle,
  FaClipboardCheck,
  FaUserCheck,
  FaMoneyCheckAlt,
  FaTimesCircle,
} from "react-icons/fa";

import { getApplications } from "../../../api/applicationApi";

import ApplicationTable from "../../../components/admin/applications/ApplicationTable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";




const STATUS_FILTERS = [
  "All",
  "Submitted",
  "Documents Verified",
  "Under Review",
  "Approved",
  "Scholarship Released",
  "Rejected",
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState("All");

  const [district, setDistrict] =
    useState("");

  const [college, setCollege] =
    useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response =
        await getApplications();

      setApplications(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const stats = useMemo(() => ({
    total: applications.length,

    submitted:
      applications.filter(
        a => a.status === "Submitted"
      ).length,

    verified:
      applications.filter(
        a =>
          a.status ===
          "Documents Verified"
      ).length,

    review:
      applications.filter(
        a =>
          a.status ===
          "Under Review"
      ).length,

    approved:
      applications.filter(
        a =>
          a.status ===
          "Approved"
      ).length,

    released:
      applications.filter(
        a =>
          a.status ===
          "Scholarship Released"
      ).length,

    rejected:
      applications.filter(
        a =>
          a.status ===
          "Rejected"
      ).length,

  }), [applications]);

  /*
  |--------------------------------------------------------------------------
  | Dropdown Data
  |--------------------------------------------------------------------------
  */

  const districts = [
    ...new Set(
      applications
        .map(a => a.district)
        .filter(Boolean)
    ),
  ];

  const colleges = [
    ...new Set(
      applications
        .map(a => a.college_name)
        .filter(Boolean)
    ),
  ];

  /*
  |--------------------------------------------------------------------------
  | Filter Applications
  |--------------------------------------------------------------------------
  */

  const filteredApplications =
    useMemo(() => {

      return applications.filter(
        (application) => {

          const searchMatch =

            application.application_id
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            application.student_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            application.mobile
              ?.includes(search)

            ||

            application.aadhaar
              ?.includes(search);

          const statusMatch =
            status === "All"
              ? true
              : application.status ===
                status;

          const districtMatch =
            district === ""
              ? true
              : application.district ===
                district;

          const collegeMatch =
            college === ""
              ? true
              : application.college_name ===
                college;

          return (
            searchMatch &&
            statusMatch &&
            districtMatch &&
            collegeMatch
          );

        }
      );

    }, [
      applications,
      search,
      status,
      district,
      college,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Dashboard Cards
  |--------------------------------------------------------------------------
  */

  const cards = [
    {
      title: "Total",
      value: stats.total,
      status: "All",
      color: "bg-white",
      icon: <FaFileAlt />,
      text: "text-blue-600",
    },

    {
      title: "Submitted",
      value: stats.submitted,
      status: "Submitted",
      color: "bg-yellow-50",
      icon: <FaClipboardCheck />,
      text: "text-yellow-600",
    },

    {
      title: "Verified",
      value: stats.verified,
      status: "Documents Verified",
      color: "bg-blue-50",
      icon: <FaCheckCircle />,
      text: "text-blue-600",
    },

    {
      title: "Review",
      value: stats.review,
      status: "Under Review",
      color: "bg-purple-50",
      icon: <FaUserCheck />,
      text: "text-purple-600",
    },

    {
      title: "Approved",
      value: stats.approved,
      status: "Approved",
      color: "bg-green-50",
      icon: <FaCheckCircle />,
      text: "text-green-600",
    },

    {
      title: "Released",
      value: stats.released,
      status: "Scholarship Released",
      color: "bg-emerald-50",
      icon: <FaMoneyCheckAlt />,
      text: "text-emerald-600",
    },

    {
      title: "Rejected",
      value: stats.rejected,
      status: "Rejected",
      color: "bg-red-50",
      icon: <FaTimesCircle />,
      text: "text-red-600",
    },

  ];


  const exportExcel = () => {

  const rows = filteredApplications.map((item) => ({
    "Application ID": item.application_id,
    Student: item.student_name,
    Mobile: item.mobile,
    College: item.college_name,
    District: item.district,
    Status: item.status,
    "Applied Date": new Date(
      item.created_at
    ).toLocaleDateString("en-IN"),
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Applications"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    blob,
    "Scholarship_Applications.xlsx"
  );

};

const exportPDF = () => {

  const doc = new jsPDF();

  /* -------------------------------------------------- */
  /* Header */
  /* -------------------------------------------------- */

  // Logo Placeholder
  doc.setDrawColor(180);
  doc.rect(14, 10, 20, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);

  doc.text(
    "VIDYA JYOTHI FOUNDATION",
    40,
    18
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90);

  doc.text(
    "Empowering Education",
    40,
    25
  );

  doc.text(
    "Founder : Sri Suresh Kumar",
    40,
    31
  );

  doc.setDrawColor(180);
  doc.line(14, 36, 196, 36);

  /* -------------------------------------------------- */
  /* Report Title */
  /* -------------------------------------------------- */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(20);

  doc.text(
    "Scholarship Applications Report",
    14,
    47
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `Generated On : ${new Date().toLocaleString("en-IN")}`,
    14,
    54
  );

  /* -------------------------------------------------- */
  /* Summary Box */
  /* -------------------------------------------------- */

  const submitted =
    filteredApplications.filter(
      (a) => a.status === "Submitted"
    ).length;

  const verified =
    filteredApplications.filter(
      (a) => a.status === "Documents Verified"
    ).length;

  const review =
    filteredApplications.filter(
      (a) => a.status === "Under Review"
    ).length;

  const approved =
    filteredApplications.filter(
      (a) => a.status === "Approved"
    ).length;

  const released =
    filteredApplications.filter(
      (a) =>
        a.status === "Scholarship Released"
    ).length;

  const rejected =
    filteredApplications.filter(
      (a) => a.status === "Rejected"
    ).length;

  doc.setFillColor(245, 245, 245);

  doc.roundedRect(
    14,
    60,
    182,
    34,
    2,
    2,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.text(
    "Summary",
    18,
    68
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    `Total Applications : ${filteredApplications.length}`,
    18,
    76
  );

  doc.text(
    `Submitted : ${submitted}`,
    95,
    76
  );

  doc.text(
    `Verified : ${verified}`,
    18,
    84
  );

  doc.text(
    `Under Review : ${review}`,
    95,
    84
  );

  doc.text(
    `Approved : ${approved}`,
    18,
    92
  );

  doc.text(
    `Released : ${released}`,
    95,
    92
  );

  doc.text(
    `Rejected : ${rejected}`,
    150,
    92
  );

  /* -------------------------------------------------- */
  /* Applications Table */
  /* -------------------------------------------------- */

  autoTable(doc, {

    startY: 102,

    head: [[
      "Application ID",
      "Student",
      "Mobile",
      "College",
      "District",
      "Status",
    ]],

    body: filteredApplications.map(
      (item) => [

        item.application_id,

        item.student_name,

        item.mobile,

        item.college_name,

        item.district,

        item.status,

      ]
    ),

    headStyles: {

      fillColor: [22, 61, 107],

      textColor: 255,

      fontStyle: "bold",

      halign: "center",

    },

    styles: {

      fontSize: 9,

      cellPadding: 3,

      overflow: "linebreak",

    },

    alternateRowStyles: {

      fillColor: [248, 248, 248],

    },

    margin: {

      left: 14,

      right: 14,

    },

  });

  /* -------------------------------------------------- */
  /* Footer */
  /* -------------------------------------------------- */

  const pageHeight =
    doc.internal.pageSize.height;

  doc.setDrawColor(180);

  doc.line(
    14,
    pageHeight - 18,
    196,
    pageHeight - 18
  );

  doc.setFontSize(9);

  doc.setTextColor(100);

  doc.text(
    "Vidya Jyothi Foundation Scholarship Management System",
    14,
    pageHeight - 10
  );

  doc.text(
    `Page ${doc.internal.getNumberOfPages()}`,
    180,
    pageHeight - 10
  );

  /* -------------------------------------------------- */

  doc.save(
    "Scholarship_Applications_Report.pdf"
  );

};


  return (
  <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">

    {/* ===========================================================
        Header
    =========================================================== */}

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Scholarship Applications
        </h1>

        <p className="text-gray-500 mt-2">
          Manage, verify and approve scholarship applications.
        </p>

      </div>

    <div className="flex gap-3">

  <button
    onClick={exportExcel}
    className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"
  >
    Export Excel
  </button>

  <button
    onClick={exportPDF}
    className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white"
  >
    Export PDF
  </button>

  <button
    onClick={loadApplications}
    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
  >
    Refresh
  </button>

</div>
    </div>

    {/* ===========================================================
        Dashboard Cards
    =========================================================== */}

    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-5 mb-8">

      {cards.map((card) => (

        <button
          key={card.title}
          onClick={() => setStatus(card.status)}
          className={`
          ${card.color}
          rounded-2xl
          shadow-sm
          hover:shadow-lg
          border
          transition
          p-5
          text-left
          ${status === card.status
              ? "ring-2 ring-blue-500"
              : ""
            }
          `}
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-gray-500">

                {card.title}

              </p>

              <h2 className="text-3xl font-bold mt-3">

                {card.value}

              </h2>

            </div>

            <div
              className={`text-3xl ${card.text}`}
            >

              {card.icon}

            </div>

          </div>

        </button>

      ))}

    </div>

    {/* ===========================================================
        Search + Filters
    =========================================================== */}

    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">

      {/* Search */}

      <div className="relative mb-6">

        <FaSearch
          className="absolute left-4 top-4 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by Student Name, Application ID, Mobile or Aadhaar..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

      </div>

      {/* Status Chips */}

      <div className="flex flex-wrap gap-3 mb-6">

        {STATUS_FILTERS.map((item) => (

          <button
            key={item}
            onClick={() =>
              setStatus(item)
            }
            className={`
            px-5
            py-2.5
            rounded-full
            transition
            text-sm
            font-medium
            ${status === item
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-blue-100"
              }
            `}
          >

            {item}

          </button>

        ))}

      </div>

      {/* Dropdown Filters */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        <select
          value={district}
          onChange={(e) =>
            setDistrict(e.target.value)
          }
          className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        >

          <option value="">
            All Districts
          </option>

          {districts.map((item) => (

            <option
              key={item}
              value={item}
            >

              {item}

            </option>

          ))}

        </select>

        <select
          value={college}
          onChange={(e) =>
            setCollege(e.target.value)
          }
          className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        >

          <option value="">
            All Colleges
          </option>

          {colleges.map((item) => (

            <option
              key={item}
              value={item}
            >

              {item}

            </option>

          ))}

        </select>

        <button
          onClick={() => {

            setSearch("");

            setStatus("All");

            setDistrict("");

            setCollege("");

          }}
          className="bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
        >

          Clear Filters

        </button>

      </div>

    </div>

    {/* ===========================================================
        Table
    =========================================================== */}

    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      <ApplicationTable
        applications={filteredApplications}
        loading={loading}
      />

    </div>

  </div>
);
}

export default Applications;