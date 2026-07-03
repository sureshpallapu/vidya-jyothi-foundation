import { FaUniversity } from "react-icons/fa";
import BankRecordAccordion from "../components/bank/BankRecordAccordion";
import { bankRecords } from "../data/bankRecords";

function BankRecords() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <div className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">

            <FaUniversity />

            Financial Transparency

          </div>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">

            Bank Records

          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-xl text-slate-300 leading-9">

            We are committed to complete transparency.
            Monthly bank statements and financial records
            will be published here for public reference.

          </p>

        </div>

      </section>

      {/* Intro */}

      <section className="py-16">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <p className="text-lg leading-8 text-slate-600">

            These records will be updated regularly after
            verification and approval by the Foundation.
            Visitors can download the available monthly
            statements in PDF format.

          </p>

        </div>

      </section>

      {/* Accordion */}

      <section className="pb-24">

        <div className="max-w-6xl mx-auto px-6">

          {bankRecords.map((item) => (

            <BankRecordAccordion
              key={item.year}
              year={item.year}
              records={item.records}
            />

          ))}

        </div>

      </section>

    </div>
  );
}

export default BankRecords;