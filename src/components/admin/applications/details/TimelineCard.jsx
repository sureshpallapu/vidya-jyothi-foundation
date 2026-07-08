import SectionCard from "../SectionCard";

const WORKFLOW = [
  "Submitted",
  "Documents Verified",
  "Under Review",
  "Approved",
  "Scholarship Released",
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

  return (

    <SectionCard title="Application Timeline">

      <div className="space-y-5">

        {WORKFLOW.map((status, index) => {

          const completed =
            completedStatuses.includes(status);

          const active =
            currentStatus === status;

          return (

            <div
              key={status}
              className="flex items-start gap-4"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`w-5 h-5 rounded-full border-2
                  ${
                    completed
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-400"
                  }`}
                />

                {index !==
                  WORKFLOW.length - 1 && (
                  <div
                    className={`w-1 h-12
                    ${
                      completed
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}

              </div>

              <div>

                <h3
                  className={`font-semibold
                  ${
                    active
                      ? "text-blue-700"
                      : "text-gray-800"
                  }`}
                >

                  {status}

                </h3>

                {active && (

                  <p className="text-sm text-blue-500">

                    Current Stage

                  </p>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </SectionCard>

  );

}

export default TimelineCard;