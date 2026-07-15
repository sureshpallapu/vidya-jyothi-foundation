import * as XLSX from "xlsx";

/*
|--------------------------------------------------------------------------
| Export Reports to Excel
|--------------------------------------------------------------------------
*/

export const exportReportsToExcel = (
  reports
) => {

  if (!reports.length) {

    alert("No data to export.");

    return;

  }

  const data = reports.map((item) => ({

    "Application ID":
      item.application_id,

    Student:
      item.student_name,

    District:
      item.district,

    College:
      item.college_name,

    Course:
      item.course,

    Status:
      item.status,

    "Sanctioned Amount":
      item.sanctioned_amount,

    "Applied Date":
      new Date(
        item.created_at
      ).toLocaleDateString("en-IN"),

  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Applications"

  );

  XLSX.writeFile(

    workbook,

    `Scholarship_Report_${Date.now()}.xlsx`

  );

};