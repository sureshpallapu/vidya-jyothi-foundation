import { useEffect, useState } from "react";

import {
  getDashboardAnalytics,
} from "../../api/dashboardApi";

import RecentActivities from "../../components/admin/dashboard/RecentActivities";
import DistrictDistributionChart from "../../components/admin/dashboard/charts/DistrictDistributionChart";

import GenderDistributionChart from "../../components/admin/dashboard/charts/GenderDistributionChart";
import StatusDistributionChart from "../../components/admin/dashboard/charts/StatusDistributionChart";
import MonthlyApplicationsChart from "../../components/admin/dashboard/charts/MonthlyApplicationsChart";
import DashboardCards from "../../components/admin/dashboard/DashboardCards";
import RecentApplications from "../../components/admin/dashboard/RecentApplications";
import QuickActions from "../../components/admin/dashboard/QuickActions";

function Dashboard() {

  const admin =
    JSON.parse(localStorage.getItem("admin")) || {};

const [stats, setStats] = useState({

  totalApplications: 0,

  submitted: 0,

  verified: 0,

  underReview: 0,

  approved: 0,

  rejected: 0,

  released: 0,

  sanctionedAmount: 0,

  releasedAmount: 0,

  totalAdmins: 0,

});

  const [applications, setApplications] =
    useState([]);

    const [monthlyApplications, setMonthlyApplications] =
  useState([]);

const [statusDistribution, setStatusDistribution] =
  useState([]);

const [districtDistribution, setDistrictDistribution] =
  useState([]);

const [genderDistribution, setGenderDistribution] =
  useState([]);

const [recentActivities, setRecentActivities] =
  useState([]);

useEffect(() => {

  loadDashboard();

  const interval = setInterval(() => {

    loadDashboard();

  }, 30000);

  return () => clearInterval(interval);

}, []);

  const loadDashboard = async () => {

    try {

     const dashboard =
  await getDashboardAnalytics();



const analytics =
  dashboard.data.data;

setStats(
  analytics.statistics
);

setMonthlyApplications(
  analytics.monthlyApplications
);

setStatusDistribution(
  analytics.statusDistribution
);

setDistrictDistribution(
  analytics.districtDistribution
);

setGenderDistribution(
  analytics.genderDistribution
);

setApplications(
  analytics.recentApplications
);

setRecentActivities(
  analytics.recentActivities
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

<div className="grid lg:grid-cols-2 gap-6">

  <MonthlyApplicationsChart
    data={monthlyApplications}
  />
  <StatusDistributionChart
    data={statusDistribution}
  />


  <DistrictDistributionChart
    data={districtDistribution}
  />

  <GenderDistributionChart
    data={genderDistribution}
  />

</div>
<div className="grid lg:grid-cols-3 gap-6">

  <div className="space-y-6 lg:col-span-2">

    <RecentApplications
      applications={applications}
    />

    <RecentActivities
      activities={recentActivities}
    />

  </div>

  <QuickActions />

</div>


    </div>

  );

}

export default Dashboard;