import jsPDF from "jspdf";

/* ==========================================================================
   Layout Constants
   ========================================================================== */

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297; // A4 mm
const MARGIN_TOP = 16;
const MARGIN_BOTTOM = 16;
const CONTENT_LEFT = 10;
const CONTENT_RIGHT = 200;
const LABEL_WIDTH = 55;
const VALUE_WIDTH = 135;
const ROW_HEIGHT = 10;


const loadImageAsBase64 = (url) => {

  return new Promise((resolve, reject) => {

    const img = new Image();

    img.crossOrigin = "Anonymous";

    img.onload = () => {

      const canvas = document.createElement("canvas");

      canvas.width = img.width;

      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/jpeg"));

    };

    img.onerror = reject;

    img.src = url;

  });

};
/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Ensures there's enough vertical space left on the current page before
 * drawing the next block. Adds a new page (and resets y) if not — this is
 * what was completely missing before, and why content silently ran off
 * the bottom of the page on any application with a normal amount of data.
 */
function checkPageBreak(pdf, y, neededHeight) {
  if (y + neededHeight > PAGE_HEIGHT - MARGIN_BOTTOM) {
    pdf.addPage();
    return MARGIN_TOP;
  }
  return y;
}

function drawSectionTitle(pdf, y, title) {
  y = checkPageBreak(pdf, y, ROW_HEIGHT);

  pdf.setFillColor(230, 230, 230);
  pdf.rect(CONTENT_LEFT, y, 190, ROW_HEIGHT, "F");
  pdf.rect(CONTENT_LEFT, y, 190, ROW_HEIGHT);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(title, CONTENT_LEFT + 3, y + 6);

  return y + ROW_HEIGHT;
}

/**
 * Draws a single label/value row. Automatically wraps the value onto
 * multiple lines (and grows the row height to fit) if it's too long to
 * fit on one line — previously long values like Address or Scholarship
 * Purpose could silently overflow past the box border.
 */
function drawRow(pdf, y, label, value) {
  const displayValue = value ? String(value) : "-";

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const maxValueTextWidth = VALUE_WIDTH - 6;
  const wrappedLines = pdf.splitTextToSize(displayValue, maxValueTextWidth);
  const rowHeight = Math.max(ROW_HEIGHT, wrappedLines.length * 5 + 4);

  y = checkPageBreak(pdf, y, rowHeight);

  pdf.rect(CONTENT_LEFT, y, LABEL_WIDTH, rowHeight);
  pdf.rect(CONTENT_LEFT + LABEL_WIDTH, y, VALUE_WIDTH, rowHeight);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(label, CONTENT_LEFT + 3, y + 6);

  pdf.setFont("helvetica", "normal");
  pdf.text(wrappedLines, CONTENT_LEFT + LABEL_WIDTH + 3, y + 6);

  return y + rowHeight;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN");
}

function formatCurrency(value) {
  if (!value) return "-";
  return `Rs. ${Number(value).toLocaleString("en-IN")}`;
}

function buildFileName(application) {
  const idPart = application.application_id || "APPLICATION";
  const namePart = (application.student_name || "Applicant")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  return `${idPart}_${namePart}.pdf`;
}

/* ==========================================================================
   Main Generator
   ========================================================================== */

const pdfGenerator = async (application, documents) => {
  if (!application) {
    console.error("pdfGenerator: no application data provided.");
    return;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  /*
  |--------------------------------------------------------------------------
  | Header
  |--------------------------------------------------------------------------
  */
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("VIDYA JYOTHI FOUNDATION", 105, 18, { align: "center" });

  pdf.setFontSize(14);
  pdf.text("Scholarship Application Form", 105, 26, { align: "center" });

  pdf.setLineWidth(0.5);
  pdf.line(10, 32, 200, 32);

/*
|--------------------------------------------------------------------------
| Application Information + Photo
|--------------------------------------------------------------------------
*/

let infoY = 45;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(11);

pdf.text("Application ID", 15, infoY);
pdf.setFont("helvetica", "normal");
pdf.text(application.application_id || "-", 55, infoY);

infoY += 8;

pdf.setFont("helvetica", "bold");
pdf.text("Applied Date", 15, infoY);
pdf.setFont("helvetica", "normal");
pdf.text(
  application.created_at
    ? new Date(application.created_at).toLocaleDateString("en-IN")
    : "-",
  55,
  infoY
);

infoY += 8;

pdf.setFont("helvetica", "bold");
pdf.text("Status", 15, infoY);
pdf.setFont("helvetica", "normal");
pdf.text(application.status || "-", 55, infoY);

infoY += 8;

pdf.setFont("helvetica", "bold");
pdf.text("Scholarship Cycle", 15, infoY);
pdf.setFont("helvetica", "normal");
pdf.text(
  application.cycle_id
    ? `Cycle ${application.cycle_id}`
    : "-",
  55,
  infoY
);

infoY += 8;

pdf.setFont("helvetica", "bold");
pdf.text("Application Source", 15, infoY);
pdf.setFont("helvetica", "normal");
pdf.text(application.application_source || "-", 55, infoY);

/*
|--------------------------------------------------------------------------
| Photo Box
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Student Photo
|--------------------------------------------------------------------------
*/

pdf.rect(160, 40, 35, 45);

if (documents?.photo) {

  try {

    const photoUrl =
      `http://localhost:5000/uploads/scholarship/${documents.photo.application_id}/${documents.photo.file_name}`;

    const photo =
      await loadImageAsBase64(photoUrl);

    pdf.addImage(
      photo,
      "JPEG",
      161,
      41,
      33,
      43
    );

  }

  catch (error) {

    console.error(
      "Failed to load student photo",
      error
    );

    pdf.setFontSize(9);

    pdf.text(
      "Photo",
      177,
      62,
      { align: "center" }
    );

  }

}

else {

  pdf.setFontSize(9);

  pdf.text(
    "Passport",
    177,
    58,
    { align: "center" }
  );

  pdf.text(
    "Photo",
    177,
    64,
    { align: "center" }
  );

}

  let y = 95;

  /*
  |--------------------------------------------------------------------------
  | PERSONAL INFORMATION
  |--------------------------------------------------------------------------
  */
  y = drawSectionTitle(pdf, y, "PERSONAL INFORMATION");
  y = drawRow(pdf, y, "Student Name", application.student_name);
  y = drawRow(pdf, y, "Father Name", application.father_name);
  y = drawRow(pdf, y, "Mother Name", application.mother_name);
  y = drawRow(pdf, y, "Date of Birth", formatDate(application.dob));
  y = drawRow(pdf, y, "Gender", application.gender);
  y = drawRow(pdf, y, "Mobile", application.mobile);
  y = drawRow(pdf, y, "Email", application.email);
  y = drawRow(pdf, y, "Aadhaar", application.aadhaar);
  y += 5;

  /*
  |--------------------------------------------------------------------------
  | ADDRESS INFORMATION
  |--------------------------------------------------------------------------
  */
  y = drawSectionTitle(pdf, y, "ADDRESS INFORMATION");
  y = drawRow(pdf, y, "Address", application.address);
  y = drawRow(pdf, y, "District", application.district);
  y = drawRow(pdf, y, "State", application.state);
  y = drawRow(pdf, y, "Pincode", application.pincode);
  y += 5;

  /*
  |--------------------------------------------------------------------------
  | EDUCATION INFORMATION
  |--------------------------------------------------------------------------
  */
  y = drawSectionTitle(pdf, y, "EDUCATION INFORMATION");
  y = drawRow(pdf, y, "College", application.college_name);
  y = drawRow(pdf, y, "Course", application.course);
  y = drawRow(pdf, y, "Study Year", application.study_year);
  y = drawRow(
    pdf,
    y,
    "Previous Qualification",
    application.previous_qualification
  );
  y = drawRow(
    pdf,
    y,
    "Percentage",
    application.previous_percentage
      ? `${application.previous_percentage}%`
      : "-"
  );
  y = drawRow(
    pdf,
    y,
    "Family Income",
    formatCurrency(application.annual_family_income)
  );
  y = drawRow(pdf, y, "Scholarship Purpose", application.scholarship_purpose);
  y += 5;

  /*
  |--------------------------------------------------------------------------
  | BANK INFORMATION
  |--------------------------------------------------------------------------
  */
  y = drawSectionTitle(pdf, y, "BANK INFORMATION");
  y = drawRow(pdf, y, "Bank Name", application.bank_name);
  y = drawRow(pdf, y, "Account Number", application.account_number);
  y = drawRow(pdf, y, "IFSC Code", application.ifsc_code);
  y += 5;

  /*
  |--------------------------------------------------------------------------
  | DECLARATION
  |--------------------------------------------------------------------------
  */
  const declaration =
    "I hereby declare that the information furnished above is true and " +
    "correct to the best of my knowledge. If any information is found " +
    "false, the scholarship may be cancelled by the Vidya Jyothi " +
    "Foundation.";

  const declarationLines = pdf.splitTextToSize(declaration, 180);
  const declarationHeight = ROW_HEIGHT + declarationLines.length * 6 + 10;

  y = checkPageBreak(pdf, y, declarationHeight);
  y = drawSectionTitle(pdf, y, "DECLARATION");

  y += 8;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(declarationLines, CONTENT_LEFT + 3, y);
  y += declarationLines.length * 6 + 14;

  /*
  |--------------------------------------------------------------------------
  | Signature Line
  |--------------------------------------------------------------------------
  */
  y = checkPageBreak(pdf, y, 20);

  pdf.setFontSize(10);
  pdf.line(20, y, 80, y);
  pdf.text("Student Signature", 25, y + 6);

  pdf.line(130, y, 190, y);
  pdf.text("Date", 150, y + 6);

  y += 20;

  /*
  |--------------------------------------------------------------------------
  | OFFICE USE ONLY
  |--------------------------------------------------------------------------
  */
  y = drawSectionTitle(pdf, y, "OFFICE USE ONLY");
  y = drawRow(pdf, y, "Verification Officer", "");
  y = drawRow(pdf, y, "Review Officer", "");
  y = drawRow(pdf, y, "Founder Approval", "");
  y = drawRow(pdf, y, "Accounts Department", "");
  y = drawRow(pdf, y, "Sanctioned Amount", "");
  y = drawRow(pdf, y, "Remarks", "");

  /*
  |--------------------------------------------------------------------------
  | Page Numbers
  |--------------------------------------------------------------------------
  */
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Page ${i} of ${pageCount}`, CONTENT_RIGHT, PAGE_HEIGHT - 8, {
      align: "right",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */
  pdf.save(buildFileName(application));
};

export default pdfGenerator;