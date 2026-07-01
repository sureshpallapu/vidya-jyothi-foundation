import {
  FaQuoteLeft,
  FaUserTie,
} from "react-icons/fa";

function FounderMessage() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
              Founder’s Message
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900">
              A Message From
              <br />
              Our Founder
            </h2>

            <div className="mt-10 space-y-7 text-lg leading-9 text-slate-600">

              <p>

                Education has the remarkable ability to transform not
                only individual lives but also entire families and
                communities.

              </p>

              <p>

                Throughout my journey, I have witnessed talented
                students whose dreams were interrupted simply because
                they lacked financial support or guidance.

              </p>

              <p>

                Vidya Jyothi Foundation was established with the hope
                of changing that reality. Our mission is to create
                opportunities where every deserving student can pursue
                education with confidence and dignity.

              </p>

              <p>

                Although our journey has just begun, our commitment is
                unwavering. We aspire to serve society with honesty,
                transparency, compassion, and accountability in every
                initiative we undertake.

              </p>

              <p>

                I warmly invite students, parents, volunteers,
                well-wishers, and donors to join us in this mission.
                Together, we can light the path toward a brighter and
                more educated future.

              </p>

            </div>

            <div className="mt-10 border-l-4 border-yellow-500 pl-6">

              <h3 className="text-2xl font-bold text-slate-900">
                Suresh
              </h3>

              <p className="text-slate-500 mt-2">
                Founder
              </p>

              <p className="font-semibold text-yellow-600 mt-1">
                Vidya Jyothi Foundation
              </p>

            </div>

          </div>

          {/* Right */}

          <div>

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-slate-900
                via-blue-950
                to-slate-900
                p-12
                shadow-2xl
              "
            >

              <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-yellow-400/20 blur-3xl" />

              <FaQuoteLeft className="text-6xl text-yellow-400" />

              <blockquote className="mt-8 text-2xl leading-10 text-white italic">

                "Education is not merely about earning a degree;
                it is about unlocking human potential, creating
                opportunities, and building a future where no dream
                is limited by financial hardship."

              </blockquote>

              <div className="mt-12 flex items-center gap-5">

                <div
                  className="
                    w-20
                    h-20
                    rounded-full
                    bg-yellow-500
                    flex
                    items-center
                    justify-center
                    text-slate-900
                    text-3xl
                  "
                >
                  <FaUserTie />
                </div>

                <div>

                  <h4 className="text-2xl font-bold text-white">
                    Suresh
                  </h4>

                  <p className="text-slate-300">
                    Founder, Vidya Jyothi Foundation
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

export default FounderMessage;