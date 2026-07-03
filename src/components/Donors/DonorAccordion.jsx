import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

function DonorAccordion({ year, donors }) {
  const [open, setOpen] = useState(year === 2026);

  const total = donors.reduce(
    (sum, donor) => sum + donor.amount,
    0
  );

  return (
    <div className="mb-8 bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">

      {/* Header */}

      <button
        onClick={() => setOpen(!open)}
        className="
          w-full
          flex
          items-center
          justify-between
          px-8
          py-6
          bg-slate-900
          text-white
          hover:bg-slate-800
          transition
        "
      >
        <div className="flex items-center gap-4">

          {open ? (
            <FaChevronDown className="text-yellow-400" />
          ) : (
            <FaChevronRight className="text-yellow-400" />
          )}

          <h2 className="text-2xl font-bold">
            {year} Donors List
          </h2>

        </div>

        <span className="text-yellow-400 font-semibold">
          {donors.length} Donors
        </span>

      </button>

      {/* Body */}

      {open && (

        <div className="p-8">

          {donors.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-slate-500 text-lg">
                No donation records available for {year}.
              </p>

            </div>

          ) : (

            <>

              {/* Table */}

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b-2 border-slate-200">

                      <th className="text-left py-4 text-slate-900 text-lg font-bold">
                        Donor Name
                      </th>

                      <th className="text-right py-4 text-slate-900 text-lg font-bold">
                        Donation Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {donors.map((donor, index) => (

                      <tr
                        key={index}
                        className="
                          border-b
                          border-slate-100
                          hover:bg-slate-50
                          transition
                        "
                      >

                        <td className="py-5 text-slate-700">

                          {donor.name}

                        </td>

                        <td className="py-5 text-right font-semibold text-green-700">

                          ₹ {donor.amount.toLocaleString()}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                  <tfoot>

                    <tr className="bg-yellow-50 border-t-2 border-yellow-300">

                      <td className="py-5 font-bold text-lg">

                        Total Donations

                      </td>

                      <td className="py-5 text-right text-xl font-bold text-green-700">

                        ₹ {total.toLocaleString()}

                      </td>

                    </tr>

                  </tfoot>

                </table>

              </div>

            </>

          )}

        </div>

      )}

    </div>
  );
}

export default DonorAccordion;