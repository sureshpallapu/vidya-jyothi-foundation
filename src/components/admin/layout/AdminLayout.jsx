import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AdminLayout() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="ml-64">

        <Topbar />

        <main className="p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;