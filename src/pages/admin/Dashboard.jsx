import { useEffect, useState } from "react";

import DashboardCard from "../../components/admin/DashboardCard";

import {
  getDashboardStatistics,
} from "../../api/adminApi";

function Dashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    submitted: 0,
    documentsVerified: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    scholarshipReleased: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response =
        await getDashboardStatistics();

      setStats(response.data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Scholarship Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Applications"
          value={stats.totalApplications}
          color="#2563eb"
        />

        <DashboardCard
          title="Submitted"
          value={stats.submitted}
          color="#f59e0b"
        />

        <DashboardCard
          title="Documents Verified"
          value={stats.documentsVerified}
          color="#10b981"
        />

        <DashboardCard
          title="Under Review"
          value={stats.underReview}
          color="#6366f1"
        />

        <DashboardCard
          title="Approved"
          value={stats.approved}
          color="#16a34a"
        />

        <DashboardCard
          title="Rejected"
          value={stats.rejected}
          color="#dc2626"
        />

        <DashboardCard
          title="Scholarship Released"
          value={stats.scholarshipReleased}
          color="#7c3aed"
        />

      </div>

    </div>
  );
}

export default Dashboard;