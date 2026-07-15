import StatusBadge from "../StatusBadge";


function ApplicationHero({

  application,
  documents,

  onBack,

  onPrint,

}) {


  return (

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-6">

        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="text-blue-100 hover:text-white transition"
          >
            ← Back to Applications
          </button>
<button
  onClick={onPrint}
  className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-3 font-semibold transition"
>
Download Application
</button>
          <StatusBadge
            status={application.status}
          />

        </div>

      </div>

      {/* ====================================================== */}
      {/* Hero Body */}
      {/* ====================================================== */}

      <div className="p-8">

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Student Photo */}

          <div className="flex-shrink-0">

            <div className="w-40 h-48 rounded-xl overflow-hidden border bg-gray-100">

           {documents?.photo ? (

    <img
        src={`http://localhost:5000/uploads/scholarship/${documents.photo.application_id}/${documents.photo.file_name}`}
        alt="Student"
        className="w-full h-full object-cover"
    />

) : (

    <div className="text-gray-400 text-center text-sm">

        No Photo Available

    </div>

)}

            </div>

          </div>

          {/* Student Information */}

          <div className="flex-1">

            <p className="text-sm uppercase tracking-wider text-gray-500">

              Scholarship Application

            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">

              {application.student_name}

            </h1>

            <p className="mt-2 text-lg text-blue-700 font-medium">

              {application.course}

            </p>

            <p className="text-gray-600">

              {application.college_name}

            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div>

                <p className="text-sm text-gray-500">

                  Application Number

                </p>

                <p className="font-semibold">

                  {application.application_id}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Mobile Number

                </p>

                <p className="font-semibold">

                  {application.mobile}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  District

                </p>

                <p className="font-semibold">

                  {application.district}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Applied On

                </p>

                <p className="font-semibold">

                  {new Date(
                    application.created_at
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ApplicationHero;