import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

function ScholarshipHero() {
  return (
    <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white py-28">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-3 bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold">

            <FaGraduationCap />

            Scholarship Program

          </div>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">

            Empowering Students

            <br />

            Through Scholarships

          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-xl text-slate-300 leading-8">

            Our scholarship program is designed to support deserving
            students who demonstrate academic excellence and genuine
            financial need, helping them continue their education
            without financial barriers.

          </p>

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
                font-semibold
                text-lg
                transition
              "
              >
                Start Application
              </button>

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ScholarshipHero;