import {
  FaFileAlt,
  FaClock,
  FaSearch,
  FaUserCheck,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import StatCard from "./StatCard";

function DashboardCards({ stats }) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Applications"
        value={stats.totalApplications}
        color="#1D4ED8"
        icon={<FaFileAlt />}
        link="/admin/applications"
      />

      <StatCard
        title="Submitted"
        value={stats.submitted}
        color="#F59E0B"
        icon={<FaClock />}
        link="/admin/applications?status=Submitted"
      />

      <StatCard
        title="Verified"
        value={stats.documentsVerified}
        color="#3B82F6"
        icon={<FaSearch />}
        link="/admin/applications?status=Documents Verified"
      />

      <StatCard
        title="Under Review"
        value={stats.underReview}
        color="#8B5CF6"
        icon={<FaUserCheck />}
        link="/admin/applications?status=Under Review"
      />

      <StatCard
        title="Approved"
        value={stats.approved}
        color="#10B981"
        icon={<FaCheckCircle />}
        link="/admin/applications?status=Approved"
      />

      <StatCard
        title="Released"
        value={stats.scholarshipReleased}
        color="#059669"
        icon={<FaMoneyCheckAlt />}
        link="/admin/applications?status=Scholarship Released"
      />

      <StatCard
        title="Rejected"
        value={stats.rejected}
        color="#EF4444"
        icon={<FaTimesCircle />}
        link="/admin/applications?status=Rejected"
      />


<StatCard
  title="Scholarship Cycles"
  value={stats.activeCycles}
  color="#0F766E"
  icon={<FaCalendarAlt />}
  link="/admin/cycles"
/>



    </div>

  );

}

export default DashboardCards;