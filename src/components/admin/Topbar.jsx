function Topbar() {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-[#1E3A5F]">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-600">
          Welcome, Admin
        </span>

        <button className="bg-[#D4A017] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;