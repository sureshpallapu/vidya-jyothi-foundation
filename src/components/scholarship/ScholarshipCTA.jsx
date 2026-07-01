import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

function ScholarshipCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 py-24">

      <div className="max-w-5xl mx-auto px-6">

        <div
          className="
            bg-white/10
            backdrop-blur-lg
            border border-white/20
            rounded-3xl
            p-12
            text-center
            shadow-2xl
          "
        >

          <div className="flex justify-center">

            <div
              className="
                w-24
                h-24
                rounded-full
                bg-yellow-500
                flex
                items-center
                justify-center
                text-white
                text-4xl
              "
            >
              <FaGraduationCap />
            </div>

          </div>

          <h2 className="mt-8 text-5xl font-bold text-white">
            Ready To Begin Your
            <br />
            Scholarship Journey?
          </h2>

          <p className="mt-8 text-xl text-slate-300 leading-8 max-w-3xl mx-auto">
            We are currently preparing our online scholarship
            application portal.

            Before applications open, please make sure you have:

          </p>

          {/* Checklist */}

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">

            <div className="bg-white/10 rounded-2xl p-6">

              ✅ Read the eligibility criteria carefully

            </div>

            <div className="bg-white/10 rounded-2xl p-6">

              ✅ Keep all required documents ready

            </div>

            <div className="bg-white/10 rounded-2xl p-6">

              ✅ Verify your academic information

            </div>

            <div className="bg-white/10 rounded-2xl p-6">

              ✅ Follow future application announcements

            </div>

          </div>

          {/* Status */}

          <div
            className="
              mt-12
              inline-flex
              items-center
              gap-3
              bg-yellow-100
              text-yellow-800
              px-6
              py-3
              rounded-full
              font-semibold
            "
          >

            <FaClock />

            Applications Opening Soon

          </div>

          {/* Button */}

          <div className="mt-12">

            <Link to="/apply">

              <button
                className="
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-white
                  px-10
                  py-4
                  rounded-xl
                  font-bold
                  text-lg
                  inline-flex
                  items-center
                  gap-3
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >

                Start Scholarship Application

                <FaArrowRight />

              </button>

            </Link>

          </div>

          <p className="mt-8 text-slate-400">

            The online application portal will be available soon.
            Please visit this page regularly for updates.

          </p>

        </div>

      </div>

    </section>
  );
}

export default ScholarshipCTA;