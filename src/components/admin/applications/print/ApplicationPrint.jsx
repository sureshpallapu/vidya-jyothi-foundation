import PrintRow from "./PrintRow";



function ApplicationPrint({

  application,

}) {

  if (!application) return null;

  return (

    <div
      id="application-print"
      className="
        bg-white
        mx-auto
        w-[210mm]
        min-h-[297mm]
        p-10
        text-black
      "
    >

      {/* ====================================================== */}
      {/* Placeholder */}
      {/* ====================================================== */}

   {/* ====================================================== */}
{/* Header */}
{/* ====================================================== */}

<div className="border-b-2 border-black pb-6">

  <h1 className="text-3xl font-bold text-center uppercase">

    Vidya Jyothi Foundation

  </h1>

  <h2 className="text-xl text-center font-semibold mt-2 uppercase">

    Scholarship Application Form

  </h2>

</div>

{/* ====================================================== */}
{/* Application Information */}
{/* ====================================================== */}

<div className="mt-8 flex justify-between gap-10">

  {/* Left */}

  <div className="flex-1">

    <table className="w-full text-sm">

      <tbody>

        <tr>

          <td className="py-2 font-semibold w-44">

            Application No

          </td>

          <td>

            : {application.application_id}

          </td>

        </tr>

        <tr>

          <td className="py-2 font-semibold">

            Applied Date

          </td>

          <td>

            : {new Date(
              application.created_at
            ).toLocaleDateString("en-IN")}

          </td>

        </tr>

        <tr>

          <td className="py-2 font-semibold">

            Scholarship Cycle

          </td>

          <td>

            : {application.cycle_id}

          </td>

        </tr>

        <tr>

          <td className="py-2 font-semibold">

            Current Status

          </td>

          <td>

            : {application.status}

          </td>

        </tr>

      </tbody>

    </table>

  </div>

  {/* Right */}

  <div>

    <div className="w-36 h-44 border-2 border-black flex items-center justify-center overflow-hidden">

      {application.photo_url ? (

        <img
          src={`http://localhost:5000/${application.photo_url}`}
          alt="Student"
          className="w-full h-full object-cover"
        />

      ) : (

        <div className="text-center text-xs px-3">

          Passport Size Photo

        </div>

      )}

    </div>

  </div>

</div>
{/* ====================================================== */}
{/* Personal Information */}
{/* ====================================================== */}

<div className="mt-8">

  <div className="border border-black">

    <div className="bg-gray-100 border-b border-black px-4 py-2">

      <h2 className="font-bold uppercase">

        Personal Information

      </h2>

    </div>

    <table className="w-full border-collapse text-sm">

      <tbody>

        <PrintRow
          label="Student Name"
          value={application.student_name}
        />

        <PrintRow
          label="Father Name"
          value={application.father_name}
        />

        <PrintRow
          label="Mother Name"
          value={application.mother_name}
        />

        <PrintRow
          label="Date of Birth"
          value={
            application.dob
              ? new Date(
                  application.dob
                ).toLocaleDateString("en-IN")
              : "-"
          }
        />

        <PrintRow
          label="Gender"
          value={application.gender}
        />

        <PrintRow
          label="Mobile Number"
          value={application.mobile}
        />

        <PrintRow
          label="Email Address"
          value={application.email}
        />

        <PrintRow
          label="Aadhaar Number"
          value={application.aadhaar}
        />

      </tbody>

    </table>

  </div>

</div>

{/* ====================================================== */}
{/* Address Information */}
{/* ====================================================== */}

<div className="mt-8">

  <div className="border border-black">

    <div className="bg-gray-100 border-b border-black px-4 py-2">

      <h2 className="font-bold uppercase">

        Address Information

      </h2>

    </div>

    <table className="w-full border-collapse text-sm">

      <tbody>

        <PrintRow
          label="Full Address"
          value={application.address}
        />

        <PrintRow
          label="District"
          value={application.district}
        />

        <PrintRow
          label="State"
          value={application.state}
        />

        <PrintRow
          label="Pincode"
          value={application.pincode}
        />

      </tbody>

    </table>

  </div>

</div>



{/* ====================================================== */}
{/* Education Information */}
{/* ====================================================== */}

<div className="mt-8 break-before-page">

  <div className="border border-black">

    <div className="bg-gray-100 border-b border-black px-4 py-2">

      <h2 className="font-bold uppercase">

        Education Information

      </h2>

    </div>

    <table className="w-full border-collapse text-sm">

      <tbody>

        <PrintRow
          label="College Name"
          value={application.college_name}
        />

        <PrintRow
          label="Course"
          value={application.course}
        />

        <PrintRow
          label="Study Year"
          value={application.study_year}
        />

        <PrintRow
          label="Previous Qualification"
          value={application.previous_qualification}
        />

        <PrintRow
          label="Previous Percentage"
          value={
            application.previous_percentage
              ? `${application.previous_percentage}%`
              : "-"
          }
        />

        <PrintRow
          label="Annual Family Income"
          value={
            application.annual_family_income
              ? `₹ ${Number(
                  application.annual_family_income
                ).toLocaleString("en-IN")}`
              : "-"
          }
        />

        <PrintRow
          label="Scholarship Purpose"
          value={application.scholarship_purpose}
        />

      </tbody>

    </table>

  </div>

</div>

{/* ====================================================== */}
{/* Bank Information */}
{/* ====================================================== */}

<div className="mt-8">

  <div className="border border-black">

    <div className="bg-gray-100 border-b border-black px-4 py-2">

      <h2 className="font-bold uppercase">

        Bank Information

      </h2>

    </div>

    <table className="w-full border-collapse text-sm">

      <tbody>

        <PrintRow
          label="Bank Name"
          value={application.bank_name}
        />

        <PrintRow
          label="Account Number"
          value={application.account_number}
        />

        <PrintRow
          label="IFSC Code"
          value={application.ifsc_code}
        />

      </tbody>

    </table>

  </div>

</div>

{/* ====================================================== */}
{/* Declaration */}
{/* ====================================================== */}

<div className="mt-10 border border-black p-5">

  <h2 className="font-bold uppercase">

    Declaration

  </h2>

  <p className="mt-5 leading-8 text-sm text-justify">

    I hereby declare that the information furnished in this
    scholarship application is true and correct to the best of
    my knowledge. I understand that if any information is found
    to be false or misleading, the Vidya Jyothi Foundation has
    the right to reject or cancel my scholarship application.

  </p>

</div>
<div className="mt-16 flex justify-between">

  <div>

    ___________________________

    <p className="mt-2 text-sm">

      Student Signature

    </p>

  </div>

  <div>

    ___________________________

    <p className="mt-2 text-sm">

      Date

    </p>

  </div>

</div>

{/* ====================================================== */}
{/* Office Use */}
{/* ====================================================== */}

<div className="mt-16">

  <div className="border border-black">

    <div className="bg-gray-200 border-b border-black px-4 py-2">

      <h2 className="font-bold uppercase">

        Office Use Only

      </h2>

    </div>

    <table className="w-full border-collapse text-sm">

      <tbody>

        <PrintRow
          label="Verification Officer"
          value=""
        />

        <PrintRow
          label="Review Officer"
          value=""
        />

        <PrintRow
          label="Founder Approval"
          value=""
        />

        <PrintRow
          label="Accounts Department"
          value=""
        />

        <PrintRow
          label="Sanctioned Amount"
          value=""
        />

        <PrintRow
          label="Remarks"
          value=""
        />

      </tbody>

    </table>

  </div>

</div>




    </div>

  );

}

export default ApplicationPrint;