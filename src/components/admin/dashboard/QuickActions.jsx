import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaPlusCircle,
} from "react-icons/fa";

const actions = [
  {
    title: "Applications",
    icon: <FaFileAlt />,
    path: "/admin/applications",
    color: "bg-blue-600",
  },
  {
    title: "Add Admin",
    icon: <FaUsers />,
    path: "/admin/admins",
    color: "bg-green-600",
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    path: "/admin/reports",
    color: "bg-purple-600",
  },
  {
    title: "New Scholarship Cycle",
    icon: <FaPlusCircle />,
    path: "/admin/cycles",
    color: "bg-yellow-500",
  },
];

function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className={`flex items-center gap-4 p-4 rounded-lg text-white transition hover:scale-[1.02] ${action.color}`}
          >
            <div className="text-2xl">
              {action.icon}
            </div>

            <span className="font-medium">
              {action.title}
            </span>
          </Link>
        ))}

      </div>

    </div>
  );
}

export default QuickActions;