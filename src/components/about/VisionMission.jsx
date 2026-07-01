import {
  FaEye,
  FaBullseye,
  FaHeart,
} from "react-icons/fa";

function VisionMission() {
  const items = [
    {
      icon: <FaEye />,
      title: "Our Vision",
      color: "bg-blue-100 text-blue-700",
      description:
        "To create a future where every deserving student has equal access to quality education, opportunities, and the confidence to achieve their dreams, regardless of financial circumstances.",
    },
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      color: "bg-yellow-100 text-yellow-600",
      description:
        "To identify, encourage, mentor, and support students through scholarships, educational resources, career guidance, and community initiatives that inspire lifelong learning.",
    },
    {
      icon: <FaHeart />,
      title: "Our Motto",
      color: "bg-red-100 text-red-600",
      description:
        "\"Empowering Education. Transforming Lives.\" Every initiative we undertake reflects our commitment to integrity, compassion, transparency, and meaningful social impact.",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
            Vision • Mission • Motto
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            The Principles That Guide Us
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Every decision we make and every initiative we plan is
            guided by these core principles. They define our purpose,
            inspire our work, and shape the future we aspire to build.
          </p>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          {items.map((item, index) => (

            <div
              key={index}
              className="
                group
                bg-slate-50
                border
                border-slate-200
                rounded-3xl
                p-10
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
                  ${item.color}
                `}
              >
                {item.icon}
              </div>

              {/* Title */}

              <h3 className="mt-8 text-3xl font-bold text-slate-900">

                {item.title}

              </h3>

              {/* Description */}

              <p className="mt-6 text-slate-600 leading-8">

                {item.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default VisionMission;