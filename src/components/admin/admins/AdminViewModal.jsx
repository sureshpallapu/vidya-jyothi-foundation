import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaUserShield,
  FaCalendarAlt,
} from "react-icons/fa";

function AdminViewModal({

  open,

  onClose,

  admin,

}) {

  if (!open || !admin) {

    return null;

  }

  return (

    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-blue-600 text-white px-8 py-5">

          <h2 className="text-2xl font-bold">

            Administrator Details

          </h2>

          <p className="text-blue-100 mt-1">

            View administrator profile.

          </p>

        </div>

        {/* Body */}

        <div className="p-8">

          <div className="flex flex-col items-center">

            <FaUserCircle
              className="text-7xl text-blue-600"
            />

            <h2 className="mt-4 text-2xl font-bold">

              {admin.full_name}

            </h2>

            <p className="text-gray-500">

              @{admin.username}

            </p>

          </div>
          <div className="flex flex-col items-center">

  <FaUserCircle
    className="text-7xl text-blue-600"
  />

  <h2 className="mt-4 text-2xl font-bold">

    {admin.full_name}

  </h2>

  <p className="text-gray-500">

    @{admin.username}

  </p>

</div>
          {/* Role & Status */}

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">

              <FaUserShield className="inline mr-2" />

              {admin.role.replaceAll("_", " ")}

            </span>

            {admin.status === "ACTIVE" ? (

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">

                🟢 Active

              </span>

            ) : (

              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">

                🔴 Inactive

              </span>

            )}

          </div>

          {/* Information */}

          <div className="mt-8 grid md:grid-cols-2 gap-6">

            <div className="bg-gray-50 rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaEnvelope className="text-blue-600" />

                <div>

                  <p className="text-sm text-gray-500">

                    Email

                  </p>

                  <p className="font-semibold">

                    {admin.email || "-"}

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-gray-50 rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaPhoneAlt className="text-green-600" />

                <div>

                  <p className="text-sm text-gray-500">

                    Mobile

                  </p>

                  <p className="font-semibold">

                    {admin.mobile || "-"}

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">

              <div className="flex items-center gap-3">

                <FaCalendarAlt className="text-orange-600" />

                <div>

                  <p className="text-sm text-gray-500">

                    Created On

                  </p>

                  <p className="font-semibold">

                    {new Date(
                      admin.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t px-8 py-5 flex justify-end">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}

export default AdminViewModal;