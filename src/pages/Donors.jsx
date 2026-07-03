import { FaHeart } from "react-icons/fa";
import DonorAccordion from "../components/Donors/DonorAccordion";
import { donorData } from "../data/donors";

function Donors() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <div className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">

            <FaHeart />

            Our Donors

          </div>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">

            Donors & Contributions

          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-xl text-slate-300 leading-9">

            Every contribution helps us move one step closer to ensuring
            that deserving students never have to stop their education due
            to financial hardship.

          </p>

        </div>

      </section>

      {/* Intro */}

      <section className="py-16">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <p className="text-lg leading-8 text-slate-600">

            As part of our commitment to complete transparency, we publicly
            acknowledge all contributions received by the foundation.
            This list will be updated regularly as new donations are received.

          </p>

        </div>

      </section>

      {/* Accordion */}

      <section className="pb-24">

        <div className="max-w-6xl mx-auto px-6">

          {donorData.map((year) => (

            <DonorAccordion
              key={year.year}
              year={year.year}
              donors={year.donors}
            />

          ))}

        </div>

      </section>

    </div>
  );
}

export default Donors;