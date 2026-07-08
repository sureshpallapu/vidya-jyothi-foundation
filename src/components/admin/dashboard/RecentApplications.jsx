import { Link } from "react-router-dom";

function RecentApplications({
  applications = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          Recent Applications
        </h2>

        <Link
          to="/admin/applications"
          className="text-blue-600 hover:underline"
        >
          View All
        </Link>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Application
              </th>

              <th className="text-left">
                Student
              </th>

              <th className="text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {applications.length === 0 ? (

              <tr>

                <td
                  colSpan="3"
                  className="py-8 text-center text-gray-500"
                >
                  No applications available.
                </td>

              </tr>

            ) : (

              applications.slice(0, 5).map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4">
                    {item.application_id}
                  </td>

                  <td>
                    {item.student_name}
                  </td>

                  <td>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">

                      {item.status}

                    </span>

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

export default RecentApplications;