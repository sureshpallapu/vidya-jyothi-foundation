import SectionCard from "../SectionCard";

function EducationCard({ application }) {
  return (
    <SectionCard title="Education & Scholarship Details">

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

        <InfoItem
          label="College Name"
          value={application.college_name}
        />

        <InfoItem
          label="Course"
          value={application.course}
        />

        <InfoItem
          label="Study Year"
          value={application.study_year}
        />

        <InfoItem
          label="Previous Qualification"
          value={application.previous_qualification}
        />

        <InfoItem
          label="Previous Percentage"
          value={
            application.previous_percentage
              ? `${application.previous_percentage}%`
              : "-"
          }
        />

        <InfoItem
          label="Annual Family Income"
          value={
            application.annual_family_income
              ? `₹ ${Number(
                  application.annual_family_income
                ).toLocaleString("en-IN")}`
              : "-"
          }
        />

        <div className="md:col-span-2">
          <InfoItem
            label="Scholarship Purpose"
            value={application.scholarship_purpose}
          />
        </div>

      </div>

    </SectionCard>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900 whitespace-pre-line">
        {value || "-"}
      </p>

    </div>
  );
}

export default EducationCard;