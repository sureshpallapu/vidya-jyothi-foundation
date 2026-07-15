import {
  FaUser,
  FaUserFriends,
  FaBirthdayCake,
  FaVenusMars,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

function PersonalCard({ application, documents }) {

  const maskAadhaar = (aadhaar) => {

    if (!aadhaar) return "-";

    return `XXXX XXXX ${aadhaar.slice(-4)}`;

  };

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  };

  return (

    <SectionCard title="Personal Information">

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">

        <InfoItem
          icon={<FaUser className="text-blue-600" />}
          label="Student Name"
          value={application.student_name}
        />

        <InfoItem
          icon={<FaUserFriends className="text-green-600" />}
          label="Father Name"
          value={application.father_name}
        />

        <InfoItem
          icon={<FaUserFriends className="text-pink-600" />}
          label="Mother Name"
          value={application.mother_name}
        />

        <InfoItem
          icon={<FaBirthdayCake className="text-orange-600" />}
          label="Date of Birth"
          value={formatDate(application.dob)}
        />

        <InfoItem
          icon={<FaVenusMars className="text-purple-600" />}
          label="Gender"
          value={application.gender}
        />

        <InfoItem
          icon={<FaPhoneAlt className="text-emerald-600" />}
          label="Mobile Number"
          value={application.mobile}
        />

        <InfoItem
          icon={<FaEnvelope className="text-red-600" />}
          label="Email Address"
          value={application.email}
        />

        <InfoItem
          icon={<FaIdCard className="text-indigo-600" />}
          label="Aadhaar Number"
          value={maskAadhaar(application.aadhaar)}
        />

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

        <p className="mt-1 font-semibold text-gray-900">

          {value || "-"}

        </p>

      </div>

    </div>

  );

}

export default PersonalCard;