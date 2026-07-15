import {
  FaFileAlt,
  FaSearch,
  FaUserCheck,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaTimesCircle,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

const WORKFLOW = [
  {
    status: "Submitted",
    icon: <FaFileAlt />,
  },
  {
    status: "Documents Verified",
    icon: <FaSearch />,
  },
  {
    status: "Under Review",
    icon: <FaUserCheck />,
  },
  {
    status: "Approved",
    icon: <FaCheckCircle />,
  },
  {
    status: "Scholarship Released",
    icon: <FaMoneyCheckAlt />,
  },
];

function TimelineCard({
  currentStatus,
  history = [],
}) {

  const completedStatuses = history.map(
    (item) => item.current_status
  );

  if (!completedStatuses.includes("Submitted")) {
    completedStatuses.unshift("Submitted");
  }

  const rejected =
    currentStatus === "Rejected";

  return (

    <SectionCard title="Application Workflow">

      {rejected ? (

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-center gap-3">

            <FaTimesCircle className="text-red-600 text-3xl" />

            <div>

              <h3 className="text-xl font-bold text-red-700">

                Application Rejected

              </h3>

              <p className="text-red-600 mt-1">

                This application has exited the workflow.

              </p>

            </div>

          </div>

        </div>

      ) : (

        <div>

          {/* Timeline */}

          <div className="overflow-x-auto">

            <div className="flex items-center min-w-[850px]">

              {WORKFLOW.map((step, index) => {

                const completed =
                  completedStatuses.includes(
                    step.status
                  );

                const active =
                  currentStatus ===
                  step.status;

                return (

                  <div
                    key={step.status}
                    className="flex items-center flex-1"
                  >

                    {/* Circle */}

                    <div className="flex flex-col items-center">

                      <div
                        className={`
                          w-14
                          h-14
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-white
                          text-xl
                          shadow-md
                          ${
                            completed
                              ? "bg-green-600"
                              : active
                              ? "bg-yellow-500 animate-pulse"
                              : "bg-gray-300"
                          }
                        `}
                      >

                        {step.icon}

                      </div>

                      <p
                        className={`
                          mt-3
                          text-sm
                          font-semibold
                          text-center
                          w-28
                          ${
                            active
                              ? "text-yellow-700"
                              : completed
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        `}
                      >

                        {step.status}

                      </p>

                      {active && (

                        <span className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                          Current Stage

                        </span>

                      )}

                    </div>

                    {/* Connector */}

                    {index !==
                      WORKFLOW.length - 1 && (

                      <div
                        className={`
                          flex-1
                          h-1
                          mx-2
                          rounded
                          ${
                            completed
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }
                        `}
                      />

                    )}

                  </div>

                );

              })}

            </div>

          </div>

          {/* Summary */}

          <div className="mt-10 grid md:grid-cols-2 gap-6">

            <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">

              <p className="text-sm text-blue-600">

                Current Status

              </p>

              <h3 className="mt-2 text-2xl font-bold text-blue-800">

                {currentStatus}

              </h3>

            </div>

            <div className="rounded-xl bg-green-50 border border-green-200 p-5">

              <p className="text-sm text-green-600">

                Workflow Progress

              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-800">

                {
                  completedStatuses.length
                } / {WORKFLOW.length} Completed

              </h3>

            </div>

          </div>

        </div>

      )}

    </SectionCard>

  );

}

export default TimelineCard;