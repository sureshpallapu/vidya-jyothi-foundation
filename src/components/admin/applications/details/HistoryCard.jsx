import SectionCard from "../SectionCard";

function HistoryCard({ history = [] }) {

  return (

    <SectionCard title="Workflow History">

      {
        history.length === 0 ? (

          <div className="text-center text-gray-500 py-8">

            No workflow history available.

          </div>

        ) : (

          <div className="space-y-6">

            {history.map((item) => (

              <div
                key={item.id}
                className="border-l-4 border-blue-500 pl-5 pb-6 relative"
              >

                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-blue-500"></div>

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-semibold text-lg">

                      {item.current_status}

                    </h3>

                    <p className="text-sm text-gray-500">

                      {new Date(item.changed_at).toLocaleString()}

                    </p>

                  </div>

                </div>

                <div className="mt-3">

                  <p>

                    <strong>Changed By :</strong>

                    {" "}

                    {item.admin_name}

                  </p>

                </div>

                {
                  item.sanctioned_amount && (

                    <div className="mt-2">

                      <strong>

                        Sanctioned Amount :

                      </strong>

                      {" "}

                      ₹ {item.sanctioned_amount}

                    </div>

                  )
                }

                <div className="mt-3">

                  <strong>

                    Remarks

                  </strong>

                  <div className="mt-1 bg-gray-50 rounded-lg p-3">

                    {item.remarks || "-"}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )

      }

    </SectionCard>

  );

}

export default HistoryCard;