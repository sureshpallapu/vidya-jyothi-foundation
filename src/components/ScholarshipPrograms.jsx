import {
  FaAward,
  FaUniversity,
  FaBookOpen,
  FaUserTie,
  FaArrowRight,
} from "react-icons/fa";

import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";

function ScholarshipPrograms() {
  const programs = [
    {
      title: "Merit Scholarships",
      description:
        "Financial assistance for academically outstanding students to pursue their educational goals without financial barriers.",
      icon: <FaAward />,
    },
    {
      title: "College Fee Support",
      description:
        "Helping deserving students continue higher education by supporting tuition fees and essential academic expenses.",
      icon: <FaUniversity />,
    },
    {
      title: "Books & Study Resources",
      description:
        "Providing textbooks, study materials, stationery, and learning resources to encourage academic excellence.",
      icon: <FaBookOpen />,
    },
    {
      title: "Career Mentorship",
      description:
        "Connecting students with experienced mentors for career guidance, skill development, and future opportunities.",
      icon: <FaUserTie />,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <SectionHeader
          badge="Our Programs"
          title="Scholarship Programs"
          description="Supporting deserving students through financial assistance, educational resources, and career guidance to build a brighter future."
        />

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {programs.map((program, index) => (

            <div
              key={index}
              className="
                flex
                flex-col
                justify-between
                rounded-3xl
                border
                border-slate-200
                bg-gradient-to-b
                from-white
                to-slate-50
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
                "
              >
                {program.icon}
              </div>

              {/* Title */}

              <h3 className="mt-8 text-2xl font-bold text-slate-900">

                {program.title}

              </h3>

              {/* Description */}

              <p className="mt-4 text-slate-600 leading-7 flex-grow">

                {program.description}

              </p>

              {/* Learn More */}

            <Link
  to="/scholarships"
  className="
    mt-8
    inline-flex
    items-center
    gap-2
    text-yellow-600
    font-semibold
    transition-all
    duration-300
    hover:text-yellow-700
    hover:gap-3
  "
>
  Learn More

  <FaArrowRight className="text-sm" />
</Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default ScholarshipPrograms;