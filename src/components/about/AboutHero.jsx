import { FaGraduationCap } from "react-icons/fa";
import { foundation } from "../../data/foundation";

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 py-28">

      {/* Background Decoration */}

      <div className="absolute inset-0 opacity-10">

        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-yellow-400 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-white blur-3xl" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        {/* Badge */}

        <span
          className="
            inline-flex
            items-center
            gap-2
            bg-yellow-500
            text-slate-900
            px-5
            py-2
            rounded-full
            font-semibold
          "
        >
          <FaGraduationCap />

          About Our Foundation

        </span>

        {/* Heading */}

        <h1
          className="
            mt-8
            text-5xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            text-white
            leading-tight
          "
        >
          {foundation.name}
        </h1>

        {/* Description */}

        <p
          className="
            mt-8
            max-w-4xl
            mx-auto
            text-xl
            leading-9
            text-slate-300
          "
        >
          Vidya Jyothi Foundation is dedicated to creating
          educational opportunities for deserving students by
          promoting equal access to learning, mentorship,
          scholarships, and community-driven support.

          <br />
          <br />

          We believe education has the power to transform
          lives, strengthen communities, and inspire
          generations.

        </p>

      </div>

    </section>
  );
}

export default AboutHero;