import { FaEye } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";


function ApplicationTable({
  applications,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        No applications found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-4 text-left">
              Application ID
            </th>

            <th className="px-5 py-4 text-left">
              Student
            </th>

            <th className="px-5 py-4 text-left">
              Mobile
            </th>

            <th className="px-5 py-4 text-left">
              College
            </th>

            <th className="px-5 py-4 text-left">
              District
            </th>

            <th className="px-5 py-4 text-left">
              Status
            </th>

            <th className="px-5 py-4 text-left">
              Applied On
            </th>

            <th className="px-5 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {applications.map((application) => (

            <tr
              key={application.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-5 py-4 font-semibold">
                {application.application_id}
              </td>

              <td className="px-5 py-4">
                {application.student_name}
              </td>

              <td className="px-5 py-4">
                {application.mobile}
              </td>

              <td className="px-5 py-4">
                {application.college_name}
              </td>

              <td className="px-5 py-4">
                {application.district}
              </td>

              <td className="px-5 py-4">
                <StatusBadge
                  status={application.status}
                />
              </td>

              <td className="px-5 py-4">
                {new Date(
                  application.created_at
                ).toLocaleDateString()}
              </td>

              <td className="px-5 py-4 text-center">
<Link
  to={`/admin/applications/${application.id}`}
  className="text-blue-600 hover:text-blue-800"
>
  <FaEye size={18}/>
</Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ApplicationTable;