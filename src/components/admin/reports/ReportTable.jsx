function ReportTable({ reports, loading }) {

  if (loading) {

    return (

      <div className="bg-white rounded-xl shadow p-8 text-center">

        Loading reports...

      </div>

    );

  }

  return (

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-5 py-4 text-left">
                Application ID
              </th>

              <th className="px-5 py-4 text-left">
                Student
              </th>

              <th className="px-5 py-4 text-left">
                District
              </th>

              <th className="px-5 py-4 text-left">
                College
              </th>

              <th className="px-5 py-4 text-left">
                Course
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>

              <th className="px-5 py-4 text-right">
                Amount
              </th>

              <th className="px-5 py-4 text-left">
                Applied
              </th>

            </tr>

          </thead>

          <tbody>

            {reports.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >

                  No reports found.

                </td>

              </tr>

            ) : (

              reports.map((report) => (

                <tr
                  key={report.application_id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-semibold">

                    {report.application_id}

                  </td>

                  <td className="px-5 py-4">

                    {report.student_name}

                  </td>

                  <td className="px-5 py-4">

                    {report.district}

                  </td>

                  <td className="px-5 py-4">

                    {report.college_name}

                  </td>

                  <td className="px-5 py-4">

                    {report.course}

                  </td>

                  <td className="px-5 py-4">

                    {report.status}

                  </td>

                  <td className="px-5 py-4 text-right">

                    ₹{Number(
                      report.sanctioned_amount || 0
                    ).toLocaleString("en-IN")}

                  </td>

                  <td className="px-5 py-4">

                    {new Date(
                      report.created_at
                    ).toLocaleDateString("en-IN")}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ReportTable;