import {
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

function Header({

  collapsed,

  setCollapsed,

}) {

  const admin =
    JSON.parse(
      localStorage.getItem("admin")
    );

  return (

    <header className="bg-white h-20 shadow flex items-center justify-between px-8 sticky top-0 z-40">

      {/* Left */}

      <div className="flex items-center gap-5">

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="text-2xl text-gray-600 hover:text-blue-700"
        >

          <FaBars />

        </button>

        <div>

          <h1 className="text-2xl font-bold">

            Dashboard

          </h1>

          <p className="text-gray-500 text-sm">

            Welcome back 👋

          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative">

          <FaBell className="text-2xl text-gray-600" />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">

            0

          </span>

        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-4xl text-blue-700" />

          <div>

            <h3 className="font-semibold">

              {admin?.fullName}

            </h3>

            <p className="text-sm text-gray-500">

              {admin?.role}

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}

export default Header;