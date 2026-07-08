import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/layout/Sidebar";
import Header from "../components/admin/layout/Header";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;