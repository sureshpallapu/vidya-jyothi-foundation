import { useState } from "react";

import { Outlet } from "react-router-dom";
import SessionProvider from "../SessionProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
function AdminLayout() {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <div className="min-h-screen bg-gray-100">
  <SessionProvider />
      <Sidebar
        collapsed={collapsed}
      />

      <div
        className={`transition-all duration-300 ${
          collapsed
            ? "ml-20"
            : "ml-72"
        }`}
      >

        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="p-8">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default AdminLayout;