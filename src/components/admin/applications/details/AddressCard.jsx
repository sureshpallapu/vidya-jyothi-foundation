import {
  FaMapMarkerAlt,
  FaGlobeAsia,
  FaMailBulk,
  FaHome,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

function AddressCard({ application }) {

  return (

    <SectionCard title="Address Information">

      <div className="space-y-8">

        {/* Full Address */}

        <div className="rounded-xl border bg-gray-50 p-5">

          <div className="flex items-center gap-3 mb-3">

            <FaHome className="text-blue-600 text-lg" />

            <h3 className="font-semibold text-gray-800">

              Full Address

            </h3>

          </div>

          <p className="text-gray-700 leading-7 whitespace-pre-line">

            {application.address || "-"}

          </p>

        </div>

        {/* Location Details */}

        <div className="grid md:grid-cols-3 gap-6">

          <InfoItem
            icon={<FaMapMarkerAlt className="text-red-600" />}
            label="District"
            value={application.district}
          />

          <InfoItem
            icon={<FaGlobeAsia className="text-green-600" />}
            label="State"
            value={application.state}
          />

          <InfoItem
            icon={<FaMailBulk className="text-purple-600" />}
            label="Pincode"
            value={application.pincode}
          />

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

        <p className="mt-1 font-semibold text-gray-900">

          {value || "-"}

        </p>

      </div>

    </div>

  );

}

export default AddressCard;