import {
  FaCalendarAlt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaSeedling,
} from "react-icons/fa";

import SectionHeader from "./SectionHeader";

function ImpactStats() {
  const highlights = [
    {
      icon: <FaCalendarAlt />,
      value: "2026",
      title: "Foundation Established",
      description:
        "Vidya Jyothi Foundation began its journey with a mission to support education and empower deserving students.",
    },
    {
      icon: <FaShieldAlt />,
      value: "100%",
      title: "Transparency Commitment",
      description:
        "We are committed to maintaining complete transparency in our initiatives, donations, and scholarship programs.",
    },
    {
      icon: <FaMapMarkerAlt />,
      value: "Guntur",
      title: "Initial Service Area",
      description:
        "Our journey begins in Guntur, Andhra Pradesh, with a vision to expand our reach across many communities.",
    },
    {
      icon: <FaSeedling />,
      value: "Future",
      title: "Growing Together",
      description:
        "Every initiative we undertake is a step toward creating lasting educational opportunities for future generations.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <SectionHeader
          badge="Foundation Highlights"
          title="Building Trust Through Purpose & Commitment"
          description="Every great journey begins with a vision. These values define who we are and the impact we aspire to create."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {highlights.map((item, index) => (

            <div
              key={index}
              className="
                group
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-8
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-yellow-300
                hover:shadow-2xl
              "
            >

              {/* Icon */}

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-yellow-100
                  text-yellow-600
                  flex
                  items-center
                  justify-center
                  text-3xl
                  transition-all
                  duration-300
                  group-hover:bg-yellow-500
                  group-hover:text-white
                "
              >
                {item.icon}
              </div>

              {/* Value */}

              <h3 className="mt-8 text-4xl font-extrabold text-slate-900">

                {item.value}

              </h3>

              {/* Title */}

              <h4 className="mt-3 text-xl font-bold text-slate-800">

                {item.title}

              </h4>

              {/* Description */}

              <p className="mt-5 text-slate-600 leading-7">

                {item.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default ImpactStats;