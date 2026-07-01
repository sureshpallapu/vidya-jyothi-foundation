import {
  FaSeedling,
  FaGraduationCap,
  FaHandsHelping,
} from "react-icons/fa";

function OurStory() {
  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Our Story
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
              Every Great Journey
              <br />
              Begins With A Purpose
            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-9">

              Across many communities, countless talented students
              dream of pursuing higher education. Unfortunately,
              financial challenges often prevent them from reaching
              their full potential.

            </p>

            <p className="mt-6 text-lg text-slate-600 leading-9">

              Vidya Jyothi Foundation was established with a simple
              yet meaningful purpose — to encourage education,
              inspire hope, and create opportunities for deserving
              students through scholarships, mentorship, and
              community support.

            </p>

            <p className="mt-6 text-lg text-slate-600 leading-9">

              While our journey is only beginning, our commitment is
              unwavering. Every initiative we undertake is guided by
              the belief that investing in education today creates
              stronger families, empowered communities, and a better
              tomorrow.

            </p>

          </div>

          {/* Right */}

          <div className="space-y-6">

            <div
              className="
                bg-white
                rounded-3xl
                p-8
                shadow-lg
                border
                border-slate-200
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >

              <div className="flex items-start gap-5">

                <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">

                  <FaSeedling className="text-yellow-600 text-3xl" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">

                    A Humble Beginning

                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">

                    Every meaningful change starts with a single
                    step. Our foundation begins with a vision to
                    support education and build lasting impact.

                  </p>

                </div>

              </div>

            </div>

            <div
              className="
                bg-white
                rounded-3xl
                p-8
                shadow-lg
                border
                border-slate-200
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >

              <div className="flex items-start gap-5">

                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <FaGraduationCap className="text-blue-700 text-3xl" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">

                    Education First

                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">

                    We believe education is the strongest foundation
                    for creating opportunities, confidence,
                    independence, and social progress.

                  </p>

                </div>

              </div>

            </div>

            <div
              className="
                bg-white
                rounded-3xl
                p-8
                shadow-lg
                border
                border-slate-200
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >

              <div className="flex items-start gap-5">

                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                  <FaHandsHelping className="text-green-700 text-3xl" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">

                    Serving With Purpose

                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">

                    Our mission is to support students with honesty,
                    compassion, transparency, and a genuine desire to
                    make education accessible for all.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default OurStory;