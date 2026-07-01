import {
  FaSchool,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
} from "react-icons/fa";

function Founder() {
  const journey = [
    {
      icon: <FaSchool />,
      title: "Humble Beginnings",
      description:
        "Born into a financially struggling family and faced challenges in accessing educational opportunities.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Education Through Scholarships",
      description:
        "Continued studies step by step with the support of scholarships earned through academic merit.",
    },
    {
      icon: <FaBriefcase />,
      title: "Professional Career",
      description:
        "After years of perseverance and hard work, secured a professional job and became financially independent.",
    },
    {
      icon: <FaHeart />,
      title: "Giving Back",
      description:
        "Founded Vidya Jyothi Foundation to help deserving students continue their education without financial barriers.",
    },
  ];

  return (
    <div className="bg-slate-50">

      {/* Hero */}

      <section className="bg-gradient-to-r from-slate-950 to-blue-950 text-white py-28">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">
            Founder Story
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">
            From Scholarship Recipient
            <br />
            To Scholarship Provider
          </h1>

          <p className="mt-8 text-xl text-slate-300 max-w-3xl mx-auto">
            A personal journey that inspired the creation of
            Vidya Jyothi Foundation.
          </p>

        </div>

      </section>

      {/* Story */}

      <section className="py-24 bg-white">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Why This Foundation Exists
          </h2>

          <p className="mt-10 text-lg text-slate-600 leading-9 text-center">
            I come from a financially challenged background where
            continuing education was never easy.

            Throughout my academic journey, scholarships and merit-based
            support programs played a crucial role in helping me continue
            my studies.

            Through determination, hard work, and the opportunities
            provided by education, I secured a professional career.

            Today, my goal is to create similar opportunities for
            students who are facing the same struggles that I once faced.
          </p>

        </div>

      </section>

      {/* Timeline */}

      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            My Journey
          </h2>

          <div className="space-y-8">

            {journey.map((item, index) => (
              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-lg
                  hover:shadow-2xl
                  transition
                "
              >

                <div className="flex gap-6">

                  <div
                    className="
                      h-16
                      w-16
                      rounded-2xl
                      bg-yellow-500
                      text-white
                      flex
                      items-center
                      justify-center
                      text-2xl
                    "
                  >
                    {item.icon}
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
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

        </div>

      </section>

      {/* Vision */}

      <section className="bg-white py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold">
            My Vision
          </h2>

          <p className="mt-8 text-lg text-slate-600 leading-8">
            To ensure that no deserving student is forced to
            discontinue education because of financial hardship.

            Through scholarships, mentorship, and community support,
            Vidya Jyothi Foundation aims to empower the next generation
            of students and future leaders.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Founder;