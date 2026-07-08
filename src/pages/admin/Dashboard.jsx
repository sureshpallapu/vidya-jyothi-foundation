import { useEffect, useState } from "react";
import axios from "axios";

import DashboardCards from "../../components/admin/dashboard/DashboardCards";
import RecentApplications from "../../components/admin/dashboard/RecentApplications";
import QuickActions from "../../components/admin/dashboard/QuickActions";

function Dashboard() {

  const admin =
    JSON.parse(localStorage.getItem("admin")) || {};

  const [stats, setStats] = useState({
    totalApplications: 0,
    submitted: 0,
    documentsVerified: 0,
    underReview: 0,
    approved: 0,
    scholarshipReleased: 0,
    rejected: 0,
  });

  const [applications, setApplications] =
    useState([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      const dashboard =
        await axios.get(
          "http://localhost:5000/api/admin/dashboard"
        );

      const apps =
        await axios.get(
          "http://localhost:5000/api/admin/applications"
        );

      setStats(
        dashboard.data.data
      );

      setApplications(
        apps.data.data
      );

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">

          Welcome,

          {" "}

          {admin.fullName}

        </h1>

        <p className="text-gray-500 mt-2">

          Scholarship Management Dashboard

        </p>

      </div>

      <DashboardCards
        stats={stats}
      />

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">

          <RecentApplications
            applications={applications}
          />

        </div>

        <QuickActions />

      </div>

    </div>

  );

}

export default Dashboard;