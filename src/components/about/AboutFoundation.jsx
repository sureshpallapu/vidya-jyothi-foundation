import {
  FaGraduationCap,
  FaBookOpen,
  FaHandsHelping,
} from "react-icons/fa";

function AboutFoundation() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}

          <div>

            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Who We Are
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
              Lighting the Path Through Education
            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-9">

              Vidya Jyothi Foundation was established with a simple
              yet meaningful purpose — to ensure that financial
              challenges never become a barrier to education for
              deserving students.

            </p>

            <p className="mt-6 text-lg text-slate-600 leading-9">

              We aspire to support students through scholarships,
              educational guidance, mentorship, and community
              initiatives that encourage learning, confidence,
              and personal growth.

            </p>

            <p className="mt-6 text-lg text-slate-600 leading-9">

              Although our journey has just begun, our vision is
              long-term. We believe every opportunity given to a
              student today contributes to building a stronger,
              more educated, and compassionate society tomorrow.

            </p>

          </div>

          {/* Right Card */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-slate-900
              via-blue-950
              to-slate-900
              p-10
              shadow-2xl
            "
          >

            <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl" />

            <div className="relative">

              <div className="w-20 h-20 rounded-2xl bg-yellow-500 flex items-center justify-center text-slate-900 text-4xl">

                <FaGraduationCap />

              </div>

              <h3 className="mt-8 text-3xl font-bold text-white">

                Education Changes Lives

              </h3>

              <p className="mt-6 text-slate-300 leading-8">

                Every student deserves the opportunity to dream,
                learn, and succeed. By supporting education, we
                invest not only in individuals but also in the
                future of families, communities, and society.

              </p>

              <div className="mt-10 space-y-5">

                <div className="flex items-center gap-4">

                  <FaBookOpen className="text-yellow-400 text-xl" />

                  <span className="text-white">
                    Supporting Education
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <FaHandsHelping className="text-yellow-400 text-xl" />

                  <span className="text-white">
                    Empowering Students
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <FaGraduationCap className="text-yellow-400 text-xl" />

                  <span className="text-white">
                    Building Brighter Futures
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AboutFoundation;