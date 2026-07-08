import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1E3A5F] text-white">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold">
          VJ Foundation
        </h1>

        <p className="text-sm text-gray-300">
          Admin Panel
        </p>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className="block px-4 py-3 rounded hover:bg-blue-700"
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;