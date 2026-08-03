import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

export default function ReceiptDonorCard({ receipt }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">

        <h2 className="text-white font-semibold text-lg">
          Donor Information
        </h2>

      </div>

      {/* Body */}

      <div className="p-6">

        {/* Avatar */}

        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">

            <FaUser
              size={34}
              className="text-indigo-600"
            />

          </div>

        </div>

        {/* Name */}

        <div className="text-center mb-6">

          <h3 className="text-xl font-bold">

            {receipt?.donor_name || "-"}

          </h3>

          <p className="text-gray-500">

            {receipt?.donor_code}

          </p>

        </div>

        {/* Information */}

        <div className="space-y-5">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">

              <FaPhone className="text-blue-600" />

            </div>

            <div>

              <p className="text-xs text-gray-500">

                Mobile Number

              </p>

              <p className="font-medium">

                {receipt?.mobile_number || "-"}

              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">

              <FaEnvelope className="text-red-600" />

            </div>

            <div>

              <p className="text-xs text-gray-500">

                Email Address

              </p>

              <p className="font-medium">

                {receipt?.email || "-"}

              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">

              <FaUsers className="text-green-600" />

            </div>

            <div>

              <p className="text-xs text-gray-500">

                Donor Type

              </p>

              <p className="font-medium">

                {receipt?.donor_type || "-"}

              </p>

            </div>

          </div>

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">

              <FaMapMarkerAlt className="text-yellow-600" />

            </div>

            <div>

              <p className="text-xs text-gray-500">

                Address

              </p>

              <p className="font-medium">

                {receipt?.address || "-"}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}