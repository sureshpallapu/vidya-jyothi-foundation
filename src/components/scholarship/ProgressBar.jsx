import scholarshipSteps from "../../data/scholarshipSteps";

function ProgressBar({ currentStep }) {
  return (
    <div className="mb-8">

      <div className="flex items-center justify-between overflow-x-auto">

        {scholarshipSteps.map((step, index) => {

          const stepNumber = index + 1;

          const completed = stepNumber < currentStep;

          const active = stepNumber === currentStep;

          return (
            <div
              key={step.id}
              className="flex items-center flex-1"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all

                  ${
                    completed
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-yellow-500 border-yellow-500 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }
                  `}
                >

                  {completed ? "✓" : stepNumber}

                </div>

                <p
                  className={`mt-2 text-sm font-medium text-center

                  ${
                    active
                      ? "text-yellow-600"
                      : completed
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                  `}
                >
                  {step.title}
                </p>

              </div>

              {index < scholarshipSteps.length - 1 && (

                <div
                  className={`flex-1 h-1 mx-2 rounded

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
  );
}

export default ProgressBar;