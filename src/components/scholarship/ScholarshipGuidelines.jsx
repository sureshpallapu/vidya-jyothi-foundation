import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaHandshake,
} from "react-icons/fa";

function ScholarshipGuidelines() {
  const guidelines = [
    {
      icon: <FaCheckCircle />,
      color: "bg-green-100 text-green-700",
      title: "Read Carefully Before Applying",
      description:
        "Please read all scholarship information, eligibility criteria, and required documents before starting your application.",
    },
    {
      icon: <FaTimesCircle />,
      color: "bg-red-100 text-red-700",
      title: "Applications May Be Rejected If",
      description:
        "Incomplete applications, incorrect information, forged documents, or failure to meet eligibility requirements may result in rejection.",
    },
    {
      icon: <FaClock />,
      color: "bg-blue-100 text-blue-700",
      title: "Application Timeline",
      description:
        "Scholarship applications will be accepted only during the official application period announced by the foundation.",
    },
    {
      icon: <FaShieldAlt />,
      color: "bg-purple-100 text-purple-700",
      title: "Fair & Transparent Selection",
      description:
        "Every application is evaluated objectively based on merit, financial need, and document verification without discrimination.",
    },
    {
      icon: <FaExclamationTriangle />,
      color: "bg-amber-100 text-amber-700",
      title: "Fraud Warning",
      description:
        "Vidya Jyothi Foundation never charges any application or processing fee. Beware of fraudulent calls or messages requesting money.",
    },
    {
      icon: <FaHandshake />,
      color: "bg-cyan-100 text-cyan-700",
      title: "Our Commitment",
      description:
        "We are committed to supporting deserving students with integrity, transparency, and equal opportunity.",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
            Important Information
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Scholarship Guidelines
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
            Please read these important guidelines carefully before submitting your scholarship application.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          {guidelines.map((item, index) => (
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

              <div className="flex gap-5">

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-slate-600 leading-7">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default ScholarshipGuidelines;