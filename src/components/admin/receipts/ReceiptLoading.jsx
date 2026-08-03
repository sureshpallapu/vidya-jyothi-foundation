export default function ReceiptLoading() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            {[
              "Receipt",
              "Donation",
              "Donor",
              "Amount",
              "Date",
              "Status",
              "Type",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                {heading}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {[...Array(8)].map((_, row) => (

            <tr key={row} className="border-t">

              {[...Array(8)].map((__, col) => (

                <td key={col} className="px-6 py-5">

                  <div className="h-4 rounded bg-gray-200 animate-pulse"></div>

                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}