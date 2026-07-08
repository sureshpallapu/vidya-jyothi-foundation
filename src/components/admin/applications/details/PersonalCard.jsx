import SectionCard from "../SectionCard";

function PersonalCard({ application }) {
  return (
    <SectionCard title="Personal Information">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Student Photo */}

        <div className="flex justify-center">
          <div className="w-48 h-56 border rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">

            {application.photo_url ? (
              <img
                src={`http://localhost:5000/${application.photo_url}`}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center text-sm px-3">
                No Photo Available
              </div>
            )}

          </div>
        </div>

        {/* Personal Information */}

        <div className="lg:col-span-3">

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">

            <InfoItem
              label="Application ID"
              value={application.application_id}
            />

            <InfoItem
              label="Student Name"
              value={application.student_name}
            />

            <InfoItem
              label="Father Name"
              value={application.father_name}
            />

            <InfoItem
              label="Mother Name"
              value={application.mother_name}
            />

            <InfoItem
              label="Date of Birth"
              value={application.dob}
            />

            <InfoItem
              label="Gender"
              value={application.gender}
            />

            <InfoItem
              label="Mobile Number"
              value={application.mobile}
            />

            <InfoItem
              label="Email Address"
              value={application.email}
            />

            <InfoItem
              label="Aadhaar Number"
              value={application.aadhaar}
            />

            <InfoItem
              label="Current Status"
              value={application.status}
            />

          </div>

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

      <p className="font-semibold text-gray-900 mt-1">
        {value || "-"}
      </p>

    </div>
  );
}

export default PersonalCard;