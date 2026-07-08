import { FaBell, FaUserCircle } from "react-icons/fa";

function Topbar() {
  const admin =
    JSON.parse(localStorage.getItem("admin")) || {};

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-20 bg-white border-b shadow-sm flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          {today}
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative">

          <FaBell
            size={22}
            className="text-gray-600"
          />

          <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center">

            0

          </span>

        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={38}
            className="text-blue-700"
          />

          <div>

            <h3 className="font-semibold">

              {admin.fullName || "Administrator"}

            </h3>

            <p className="text-sm text-gray-500">

              {admin.role || "SUPER_ADMIN"}

            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;