import {
  FaIdCard,
  FaImage,
  FaFileInvoice,
  FaUniversity,
  FaSchool,
  FaLandmark,
  FaUserGraduate,
  FaExclamationTriangle,
} from "react-icons/fa";

function RequiredDocuments() {
  const documents = [
    {
      icon: <FaIdCard />,
      title: "Aadhaar Card",
      description:
        "A valid Aadhaar Card for identity verification.",
      mandatory: true,
    },
    {
      icon: <FaImage />,
      title: "Passport Size Photograph",
      description:
        "Recent passport-size photograph with a clear background.",
      mandatory: true,
    },
    {
      icon: <FaFileInvoice />,
      title: "Latest Marks Memo",
      description:
        "Latest semester or academic marks memo issued by the institution.",
      mandatory: true,
    },
    {
      icon: <FaLandmark />,
      title: "Income Certificate",
      description:
        "Government-issued income certificate of the parent/guardian.",
      mandatory: true,
    },
    {
      icon: <FaSchool />,
      title: "Bonafide Certificate",
      description:
        "Certificate issued by the current school or college.",
      mandatory: true,
    },
    {
      icon: <FaUniversity />,
      title: "Bank Passbook",
      description:
        "Student's or parent's bank account first page copy.",
      mandatory: true,
    },
    {
      icon: <FaUserGraduate />,
      title: "College / Student ID",
      description:
        "Valid identity card issued by your educational institution.",
      mandatory: true,
    },
  ];

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
            Required Documents
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Documents to Keep Ready
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
            Please keep the following documents ready before starting your
            scholarship application. Having these documents prepared will
            help you complete the application smoothly.
          </p>

        </div>

        {/* Documents Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {documents.map((doc, index) => (

            <div
              key={index}
              className="
                bg-slate-50
                rounded-3xl
                p-8
                shadow-md
                hover:shadow-xl
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >

              <div className="flex justify-between items-start">

                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
                  {doc.icon}
                </div>

                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Mandatory
                </span>

              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {doc.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {doc.description}
              </p>

            </div>

          ))}

        </div>

        {/* Additional Documents */}

        <div className="mt-20 bg-slate-50 rounded-3xl p-10">

          <h3 className="text-3xl font-bold text-slate-900">
            Additional Documents (If Applicable)
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h4 className="font-bold text-lg">
                Caste Certificate
              </h4>

              <p className="mt-2 text-slate-600">
                Required if you wish to provide reservation details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h4 className="font-bold text-lg">
                Disability Certificate
              </h4>

              <p className="mt-2 text-slate-600">
                Applicable for students with disabilities.
              </p>
            </div>

          </div>

        </div>

        {/* Important Instructions */}

        <div className="mt-16 bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-8">

          <div className="flex gap-5">

            <FaExclamationTriangle className="text-amber-500 text-3xl mt-1" />

            <div>

              <h3 className="text-2xl font-bold text-slate-900">
                Important Instructions
              </h3>

              <ul className="mt-5 space-y-3 text-slate-700 leading-7">

                <li>• Ensure all documents are clear and readable.</li>

                <li>• The information in all documents must match your application.</li>

                <li>• Keep original documents ready for verification if requested.</li>

                <li>• Submission of incorrect or forged documents will lead to immediate rejection.</li>

              </ul>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default RequiredDocuments;