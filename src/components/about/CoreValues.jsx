import {
  FaBalanceScale,
  FaShieldAlt,
  FaHandsHelping,
  FaGraduationCap,
  FaUsers,
  FaLeaf,
} from "react-icons/fa";

function CoreValues() {
  const values = [
    {
      icon: <FaBalanceScale />,
      title: "Integrity",
      color: "bg-blue-100 text-blue-700",
      description:
        "We act with honesty, ethics, and accountability in every initiative we undertake.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Transparency",
      color: "bg-yellow-100 text-yellow-600",
      description:
        "We believe trust is built through openness, responsible governance, and clear communication.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Compassion",
      color: "bg-red-100 text-red-600",
      description:
        "Every action begins with empathy, kindness, and a genuine desire to uplift others.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Education",
      color: "bg-green-100 text-green-700",
      description:
        "Education is the foundation of opportunity and the most powerful investment in the future.",
    },
    {
      icon: <FaUsers />,
      title: "Community",
      color: "bg-purple-100 text-purple-700",
      description:
        "We believe lasting change happens when communities come together to support one another.",
    },
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      color: "bg-emerald-100 text-emerald-700",
      description:
        "Our goal is to build initiatives that create meaningful and lasting impact for generations.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
            Our Core Values
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            The Values That Define Us
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            These values guide every decision we make and every
            initiative we pursue. They represent our commitment to
            serving society with honesty, compassion, and purpose.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {values.map((value, index) => (

            <div
              key={index}
              className="
                group
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-8
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-2xl
                hover:border-yellow-300
              "
            >

              {/* Icon */}

              <div
                className={`
                  w-16
                  h-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-3xl
                  transition-all
                  duration-300
                  ${value.color}
                `}
              >
                {value.icon}
              </div>

              {/* Title */}

              <h3 className="mt-8 text-2xl font-bold text-slate-900">

                {value.title}

              </h3>

              {/* Description */}

              <p className="mt-5 text-slate-600 leading-8">

                {value.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CoreValues;