import {
  FaUserShield,
  FaCalendarAlt,
  FaCommentDots,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

function HistoryCard({ history = [] }) {

  if (history.length === 0) {

    return (

      <SectionCard title="Workflow Activity">

        <div className="py-10 text-center text-gray-500">

          No workflow history available.

        </div>

      </SectionCard>

    );

  }

  return (

    <SectionCard title="Workflow Activity">

      <div className="space-y-6">

        {history.map((item, index) => (

          <div
            key={item.id}
            className="relative rounded-xl border bg-white shadow-sm p-6"
          >

            {/* Timeline Line */}

            {index !== history.length - 1 && (

              <div className="absolute left-8 top-20 w-1 h-full bg-blue-100"></div>

            )}

            <div className="flex gap-5">

              {/* Status Icon */}

              <div className="flex-shrink-0">

                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">

                  <FaCheckCircle />

                </div>

              </div>

              {/* Details */}

              <div className="flex-1">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                  <div>

                    <h3 className="text-xl font-bold text-gray-800">

                      {item.current_status}

                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">

                      <FaCalendarAlt />

                      {new Date(
                        item.changed_at
                      ).toLocaleString("en-IN")}

                    </div>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">

                  <div>

                    <div className="flex items-center gap-2 text-gray-500">

                      <FaUserShield />

                      Changed By

                    </div>

                    <p className="mt-2 font-semibold">

                      {item.admin_name}

                    </p>

                  </div>

                  {item.sanctioned_amount && (

                    <div>

                      <div className="flex items-center gap-2 text-gray-500">

                        <FaMoneyBillWave />

                        Sanctioned Amount

                      </div>

                      <p className="mt-2 font-semibold text-green-700">

                        ₹{" "}

                        {Number(
                          item.sanctioned_amount
                        ).toLocaleString("en-IN")}

                      </p>

                    </div>

                  )}

                </div>

                <div className="mt-6">

                  <div className="flex items-center gap-2 text-gray-500">

                    <FaCommentDots />

                    Remarks

                  </div>

                  <div className="mt-3 rounded-xl bg-gray-50 border p-4 leading-7">

                    {item.remarks || "-"}

                  </div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </SectionCard>

  );

}

export default HistoryCard;