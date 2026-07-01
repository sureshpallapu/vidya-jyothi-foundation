import {
  FaFileAlt,
  FaSearch,
  FaUserCheck,
  FaAward,
  FaUniversity,
  FaCheckCircle,
} from "react-icons/fa";

function SelectionProcess() {
  const steps = [
    {
      icon: <FaFileAlt />,
      title: "Application Submission",
      description:
        "Students submit the scholarship application along with all required documents within the application period.",
    },
    {
      icon: <FaSearch />,
      title: "Document Verification",
      description:
        "Our team carefully verifies the submitted documents to ensure accuracy and completeness.",
    },
    {
      icon: <FaUserCheck />,
      title: "Eligibility Review",
      description:
        "Applications are evaluated based on eligibility criteria, academic performance, and financial need.",
    },
    {
      icon: <FaAward />,
      title: "Merit Evaluation",
      description:
        "Eligible applications are shortlisted through a transparent merit-based evaluation process.",
    },
    {
      icon: <FaUniversity />,
      title: "Scholarship Approval",
      description:
        "Selected students receive official confirmation along with scholarship award details.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Fund Disbursement",
      description:
        "Scholarship funds are transferred according to the approved guidelines and educational requirements.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
            Selection Process
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            How Applications Are Evaluated
          </h2>

          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto leading-8">
            Every scholarship application follows a transparent and structured
            review process to ensure fairness and equal opportunity for all applicants.
          </p>

        </div>

        {/* Timeline */}

        <div className="mt-20 relative">

          {/* Vertical Line */}

          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200 hidden md:block"></div>

          <div className="space-y-12">

            {steps.map((step, index) => (

              <div
                key={index}
                className="relative flex items-start gap-8"
              >

                {/* Number Circle */}

                <div
                  className="
                    relative
                    z-10
                    w-16
                    h-16
                    rounded-full
                    bg-blue-700
                    text-white
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-bold
                    shadow-lg
                  "
                >
                  {index + 1}
                </div>

                {/* Card */}

                <div
                  className="
                    flex-1
                    bg-white
                    rounded-3xl
                    p-8
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
                      {step.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>

                  </div>

                  <p className="mt-5 text-slate-600 leading-8">
                    {step.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Note */}

        <div className="mt-16 bg-green-50 border-l-4 border-green-600 rounded-2xl p-8">

          <h3 className="text-2xl font-bold text-slate-900">
            Our Commitment
          </h3>

          <p className="mt-4 text-slate-700 leading-8">
            Every application is reviewed fairly without discrimination.
            Scholarships are awarded solely based on eligibility,
            academic merit, financial need, and the availability of funds.
          </p>

        </div>

      </div>

    </section>
  );
}

export default SelectionProcess;