import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaUsers,
  FaHeart,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { foundation } from "../data/foundation";

function Hero() {
  return (
    <section
      className="
        relative
        min-h-[90vh]
        flex
        items-center
        overflow-hidden
        bg-slate-950
      "
    >
      {/* Background Image */}

      <div
        className="
          absolute
          inset-0
          bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')]
          bg-cover
          bg-center
        "
      />

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-slate-950/95
          via-blue-950/90
          to-slate-950/80
        "
      />

      {/* Content */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <span
              className="
                inline-flex
                items-center
                gap-2
                bg-yellow-500
                text-slate-900
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                shadow-lg
              "
            >
              🎓 {foundation.name}
            </span>

            {/* Heading */}

            <h1
              className="
                mt-6
                text-6xl
                md:text-7xl
                font-extrabold
                leading-tight
                text-white
              "
            >
              Empowering
              <br />

              <span className="text-yellow-400">
                Dreams
              </span>

              <br />

              Through Education
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                text-xl
                leading-9
                text-slate-300
                max-w-2xl
              "
            >
              Supporting talented students from financially
              challenged backgrounds through scholarships,
              mentorship, and life-changing opportunities.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap gap-4">

              {/* Apply */}

              <Link
                to="/apply"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  bg-yellow-500
                  text-slate-900
                  shadow-lg
                  shadow-yellow-500/20
                  transition-all
                  duration-300
                  hover:bg-yellow-400
                  hover:shadow-yellow-500/40
                  hover:-translate-y-1
                "
              >
                🎓 Apply Scholarship
              </Link>

              {/* Donate */}

              <Link
                to="/donate"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  text-white
                  bg-white/10
                  border
                  border-white/20
                  backdrop-blur-md
                  shadow-lg
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-slate-900
                  hover:border-white
                  hover:shadow-2xl
                  hover:-translate-y-1
                "
              >
                ❤️ Donate Now
              </Link>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div
              className="
                backdrop-blur-xl
                bg-white/10
                border
                border-white/20
                rounded-3xl
                p-10
                shadow-2xl
              "
            >

              <h3
                className="
                  text-4xl
                  font-bold
                  text-center
                  text-white
                "
              >
                Our Commitment
              </h3>

              <div
                className="
                  mt-10
                  grid
                  grid-cols-3
                  gap-6
                "
              >

                <div className="text-center">
                  <FaGraduationCap className="mx-auto text-5xl text-yellow-400" />
                  <p className="mt-4 text-white">
                    Education
                  </p>
                </div>

                <div className="text-center">
                  <FaUsers className="mx-auto text-5xl text-yellow-400" />
                  <p className="mt-4 text-white">
                    Community
                  </p>
                </div>

                <div className="text-center">
                  <FaHeart className="mx-auto text-5xl text-yellow-400" />
                  <p className="mt-4 text-white">
                    Support
                  </p>
                </div>

              </div>

              <div className="mt-10 border-t border-white/20 pt-8">

                <div className="grid grid-cols-2 gap-8">

                  <div className="flex items-center gap-4">

                    <FaShieldAlt className="text-4xl text-yellow-400" />

                    <div>

                      <h4 className="text-3xl font-bold text-yellow-400">
                        100%
                      </h4>

                      <p className="text-slate-300">
                        Transparency
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <FaMapMarkerAlt className="text-4xl text-yellow-400" />

                    <div>

                      <h4 className="text-3xl font-bold text-yellow-400">
                        Guntur
                      </h4>

                      <p className="text-slate-300">
                        Initial Focus
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;