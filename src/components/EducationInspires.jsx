import {
  FaGraduationCap,
  FaLightbulb,
  FaHandsHelping,
  FaSeedling,
} from "react-icons/fa";

import SectionHeader from "./SectionHeader";

function EducationInspires() {
  const values = [
    {
      icon: <FaGraduationCap />,
      title: "Education Transforms Lives",
      description:
        "Education is the foundation of personal growth. It empowers individuals with knowledge, confidence, and the ability to build a brighter future.",
    },
    {
      icon: <FaLightbulb />,
      title: "Knowledge Creates Opportunity",
      description:
        "Every deserving student deserves the opportunity to learn, grow, and achieve their dreams regardless of financial circumstances.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Together We Can Make a Difference",
      description:
        "Communities grow stronger when compassionate individuals come together to support education and create equal opportunities for everyone.",
    },
    {
      icon: <FaSeedling />,
      title: "Investing in Future Generations",
      description:
        "Supporting education today nurtures tomorrow's leaders, innovators, teachers, and changemakers who will positively impact society.",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <SectionHeader
          badge="Why Education Matters"
          title="Inspiring Hope Through the Power of Education"
          description="At Vidya Jyothi Foundation, we believe education is more than learning—it is the key to opportunity, dignity, and lasting social transformation."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {values.map((item, index) => (

            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-2xl
                hover:border-yellow-300
              "
            >

              {/* Top Accent */}

              <div
                className="
                  absolute
                  top-0
                  left-0
                  h-1
                  w-0
                  bg-yellow-500
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />

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

              {/* Title */}

              <h3 className="mt-8 text-2xl font-bold text-slate-900 leading-snug">

                {item.title}

              </h3>

              {/* Description */}

              <p className="mt-5 text-slate-600 leading-8">

                {item.description}

              </p>

            </div>

          ))}

        </div>

        {/* Bottom Quote */}

        <div
          className="
            mt-20
            rounded-3xl
            bg-gradient-to-r
            from-yellow-500
            to-yellow-400
            p-10
            text-center
            shadow-xl
          "
        >

          <h3 className="text-3xl font-bold text-slate-900">

            "When we educate one student, we empower an entire generation."

          </h3>

          <p className="mt-5 text-lg text-slate-800 max-w-3xl mx-auto leading-8">

            Every contribution towards education creates opportunities,
            strengthens communities, and inspires hope for a better tomorrow.

          </p>

        </div>

      </div>

    </section>
  );
}

export default EducationInspires;