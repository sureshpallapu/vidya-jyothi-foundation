import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
  FaUserCircle,
} from "react-icons/fa";

function Sidebar({ collapsed }) {
  const admin = JSON.parse(localStorage.getItem("admin")) || {};

  const menus = [
    { heading: "MAIN MENU" },

    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      title: "Applications",
      icon: <FaFileAlt />,
      path: "/admin/applications",
    },

    { heading: "MANAGEMENT" },

    { title: "Admins", icon: <FaUsers />, path: "/admin/admins" },
    {
      title: "Scholarship Cycles",
      icon: <FaCalendarAlt />,
      path: "/admin/cycles",
    },
    { title: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { title: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#143D6B] text-white shadow-2xl transition-all duration-300 z-50 flex flex-col ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="border-b border-blue-800 p-6">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
              <FaGraduationCap className="text-xl" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center shadow">
              <FaGraduationCap className="text-2xl" />
            </div>
            <div>
              <h2 className="font-bold tracking-wide">VIDYA JYOTHI</h2>
              <p className="text-blue-200 text-sm">Scholarship Admin</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3">
        {menus.map((menu, index) => {
          /* Section Heading */
          if (menu.heading) {
            return !collapsed ? (
              <div key={index} className="mt-6 mb-2 px-3">
                <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold">
                  {menu.heading}
                </p>
              </div>
            ) : null;
          }

          /* Plain menu link */
          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition mb-1 ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold shadow"
                    : "hover:bg-blue-700"
                }`
              }
            >
              <span className="text-lg">{menu.icon}</span>
              {!collapsed && <span className="font-medium">{menu.title}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="border-t border-blue-800 p-4">
          <div className="bg-blue-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-5xl text-yellow-400" />
              <div className="min-w-0">
                <h3 className="font-semibold truncate">
                  {admin.fullName || "Administrator"}
                </h3>
                <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs bg-yellow-500 text-black font-semibold">
                  {admin.role || "ADMIN"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-600 hover:bg-red-700 py-3 transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;