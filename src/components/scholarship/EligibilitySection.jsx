import {
  FaCheckCircle,
  FaUserGraduate,
  FaUniversity,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";

function EligibilitySection() {
  const eligibility = [
    {
      icon: <FaUserGraduate />,
      title: "Academic Performance",
      description:
        "Applicants should have a good academic record and demonstrate a commitment to continuing their education.",
    },
    {
      icon: <FaUniversity />,
      title: "Educational Qualification",
      description:
        "Students studying Intermediate, Diploma, Undergraduate, or Postgraduate courses are eligible to apply.",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Financial Need",
      description:
        "Preference will be given to students from economically weaker families with genuine financial need.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Residence",
      description:
        "Initially, applications are invited from students residing in Guntur District, Andhra Pradesh. This may expand in the future.",
    },
    {
      icon: <FaFileAlt />,
      title: "Document Verification",
      description:
        "Applicants must submit valid supporting documents. Incomplete or incorrect documents may lead to rejection.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            Eligibility Criteria
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Who Can Apply?
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
            To ensure scholarships reach deserving students, applicants
            should satisfy the following eligibility requirements.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          {eligibility.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                p-8
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div className="flex gap-5">

                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-700 text-2xl">
                  {item.icon}
                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Important Note */}

        <div className="mt-16 bg-blue-50 border-l-4 border-blue-600 rounded-2xl p-8">

          <div className="flex items-start gap-4">

            <FaCheckCircle className="text-blue-600 text-3xl mt-1" />

            <div>

              <h3 className="text-2xl font-bold text-slate-900">
                Important Note
              </h3>

              <p className="mt-4 text-slate-700 leading-8">
                Meeting the eligibility criteria does not automatically
                guarantee selection. Applications will be reviewed based
                on academic merit, financial need, document verification,
                and available scholarship funds.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default EligibilitySection;