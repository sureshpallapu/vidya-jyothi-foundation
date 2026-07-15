import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/*
|--------------------------------------------------------------------------
| Export Reports to PDF
|--------------------------------------------------------------------------
*/

export const exportReportsToPDF = (
  reports
) => {

  if (!reports.length) {

    alert("No data to export.");

    return;

  }

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "Scholarship Application Report",
    14,
    18
  );

  const rows = reports.map((item) => [

    item.application_id,

    item.student_name,

    item.district,

    item.college_name,

    item.course,

    item.status,

    `₹${Number(
      item.sanctioned_amount || 0
    ).toLocaleString("en-IN")}`,

    new Date(
      item.created_at
    ).toLocaleDateString("en-IN"),

  ]);

  autoTable(doc, {

    startY: 28,

    head: [[
      "Application ID",
      "Student",
      "District",
      "College",
      "Course",
      "Status",
      "Amount",
      "Applied"
    ]],

    body: rows,

    styles: {

      fontSize: 8,

    },

    headStyles: {

      fillColor: [37, 99, 235],

    },

  });

  doc.save(

    `Scholarship_Report_${Date.now()}.pdf`

  );

};