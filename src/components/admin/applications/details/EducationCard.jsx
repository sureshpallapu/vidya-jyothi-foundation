import {
  FaUniversity,
  FaGraduationCap,
  FaBook,
  FaAward,
  FaChartLine,
  FaWallet,
  FaHandHoldingHeart,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

function EducationCard({ application }) {

  return (

    <SectionCard title="Academic & Scholarship Information">

      <div className="space-y-8">

        {/* ====================================================== */}
        {/* Academic Information */}
        {/* ====================================================== */}

        <div>

          <h3 className="text-lg font-semibold text-blue-700 mb-5">

            Academic Information

          </h3>

          <div className="grid md:grid-cols-2 gap-8">

            <InfoItem
              icon={<FaUniversity className="text-indigo-600" />}
              label="College Name"
              value={application.college_name}
            />

            <InfoItem
              icon={<FaGraduationCap className="text-green-600" />}
              label="Course"
              value={application.course}
            />

            <InfoItem
              icon={<FaBook className="text-orange-600" />}
              label="Study Year"
              value={application.study_year}
            />

            <InfoItem
              icon={<FaAward className="text-purple-600" />}
              label="Previous Qualification"
              value={application.previous_qualification}
            />

            <InfoItem
              icon={<FaChartLine className="text-blue-600" />}
              label="Previous Percentage"
              value={
                application.previous_percentage
                  ? `${application.previous_percentage}%`
                  : "-"
              }
            />

          </div>

        </div>

        {/* ====================================================== */}
        {/* Scholarship Information */}
        {/* ====================================================== */}

        <div className="border-t pt-8">

          <h3 className="text-lg font-semibold text-emerald-700 mb-5">

            Scholarship Information

          </h3>

          <div className="grid md:grid-cols-2 gap-8">

            <InfoItem
              icon={<FaWallet className="text-emerald-600" />}
              label="Annual Family Income"
              value={
                application.annual_family_income
                  ? `₹ ${Number(
                      application.annual_family_income
                    ).toLocaleString("en-IN")}`
                  : "-"
              }
            />

            <InfoItem
              icon={<FaHandHoldingHeart className="text-pink-600" />}
              label="Scholarship Purpose"
              value={application.scholarship_purpose}
            />

          </div>

        </div>

      </div>

    </SectionCard>

  );

}

function InfoItem({

  icon,

  label,

  value,

}) {

  return (

    <div className="flex items-start gap-4">

      <div className="mt-1 text-xl">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-500">

          {label}

        </p>

        <p className="mt-1 font-semibold text-gray-900 whitespace-pre-line">

          {value || "-"}

        </p>

      </div>

    </div>

  );

}

export default EducationCard;