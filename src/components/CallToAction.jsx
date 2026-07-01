import { Link } from "react-router-dom";
import {
  FaHandHoldingHeart,
  FaArrowRight,
} from "react-icons/fa";

function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-400 py-24">

      {/* Decorative Background */}

      <div className="absolute inset-0 opacity-10">

        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white" />

        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white" />

      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}

        <span
          className="
            inline-flex
            items-center
            gap-2
            bg-white/30
            backdrop-blur-md
            px-5
            py-2
            rounded-full
            text-sm
            font-semibold
            text-slate-900
          "
        >
          <FaHandHoldingHeart />

          Join Our Mission

        </span>

        {/* Heading */}

        <h2
          className="
            mt-8
            text-5xl
            md:text-6xl
            font-extrabold
            text-slate-900
            leading-tight
          "
        >
          Together We Can Build
          <br />

          A Brighter Future

        </h2>

        {/* Description */}

        <p
          className="
            mt-8
            text-xl
            leading-9
            text-slate-800
            max-w-3xl
            mx-auto
          "
        >
          Your support can help deserving students pursue
          quality education, unlock opportunities, and
          transform their lives. Every contribution,
          no matter how small, creates a lasting impact.
        </p>

        {/* Buttons */}

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          {/* Donate */}

          <Link
            to="/donate"
            className="
              inline-flex
              items-center
              gap-3
              bg-slate-900
              text-white
              px-8
              py-4
              rounded-xl
              font-semibold
              shadow-xl
              transition-all
              duration-300
              hover:bg-slate-800
              hover:-translate-y-1
            "
          >
            Donate Now

            <FaArrowRight />
          </Link>

          {/* Volunteer */}

          <Link
            to="/volunteer"
            className="
              inline-flex
              items-center
              gap-3
              bg-white
              text-slate-900
              px-8
              py-4
              rounded-xl
              font-semibold
              shadow-xl
              transition-all
              duration-300
              hover:bg-slate-100
              hover:-translate-y-1
            "
          >
            Become a Volunteer

            <FaArrowRight />
          </Link>

        </div>

        {/* Bottom Text */}

        <p className="mt-10 text-slate-800 font-medium">

          Together, let's create opportunities, inspire hope,
          and empower the next generation through education.

        </p>

      </div>

    </section>
  );
}

export default CallToAction;