import {
  FaGraduationCap,
  FaHandsHelping,
  FaBullseye,
  FaUsers,
} from "react-icons/fa";

function ScholarshipOverview() {
  const overview = [
    {
      icon: <FaGraduationCap />,
      title: "Education Support",
      description:
        "We believe that no deserving student should discontinue education because of financial difficulties.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Financial Assistance",
      description:
        "The foundation provides financial assistance to eligible students based on merit and genuine need.",
    },
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      description:
        "To empower students through scholarships, mentorship, and opportunities that build a brighter future.",
    },
    {
      icon: <FaUsers />,
      title: "Who Can Apply?",
      description:
        "Students pursuing Intermediate, Diploma, Undergraduate, or Postgraduate education who meet the eligibility criteria.",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            Scholarship Overview
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Building Futures Through Education
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
            Our scholarship program is designed to support academically
            deserving students who face financial challenges. We aim to
            remove financial barriers and encourage students to continue
            their education with confidence.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          {overview.map((item, index) => (

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

              <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-white text-2xl">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default ScholarshipOverview;