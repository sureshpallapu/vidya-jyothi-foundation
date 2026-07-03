import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaChevronDown,
  FaUsers,
  FaUniversity,
  FaImages,
  FaCalendarAlt,
  FaNewspaper,
  FaVideo,
} from "react-icons/fa";
import Logo from "./Logo";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const donateRef = useRef(null);
  const galleryRef = useRef(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Scholarships", path: "/scholarship" },
    { name: "Transparency", path: "/transparency" },
    { name: "Volunteer", path: "/volunteer" },
    { name: "Contact", path: "/contact" },
  ];

  const galleryLinks = [
    { name: "Photo Gallery", path: "/gallery/photo-gallery", icon: FaImages, color: "purple" },
    { name: "Events & Visits", path: "/gallery/events-visits", icon: FaCalendarAlt, color: "orange" },
    { name: "Media Coverage", path: "/gallery/media-coverage", icon: FaNewspaper, color: "sky" },
    { name: "Video Gallery", path: "/gallery/video-gallery", icon: FaVideo, color: "rose" },
  ];

  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
      : "text-slate-700 hover:text-yellow-500 transition";

  // Close dropdowns when clicking outside of them
  useEffect(() => {
    function handleClickOutside(event) {
      if (donateRef.current && !donateRef.current.contains(event.target)) {
        setDonateOpen(false);
      }
      if (galleryRef.current && !galleryRef.current.contains(event.target)) {
        setGalleryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Icon badge color map (Tailwind needs full class names, not dynamic strings)
  const badgeColors = {
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
    sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          {/* Desktop Navigation (single nav, Gallery dropdown inserted after Transparency) */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <div key={link.path} className="flex items-center gap-8">
                <NavLink to={link.path} className={navLinkStyles}>
                  {link.name}
                </NavLink>

                {link.name === "Transparency" && (
                  <div
                    ref={galleryRef}
                    className="relative"
                    onMouseEnter={() => setGalleryOpen(true)}
                    onMouseLeave={() => setGalleryOpen(false)}
                  >
                    <button
                      className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-yellow-500 transition"
                      onClick={() => setGalleryOpen((prev) => !prev)}
                      aria-expanded={galleryOpen}
                    >
                      Gallery
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          galleryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* top-full + pt-3 keeps the hoverable area continuous, no dead gap */}
                    <div
                      className={`
                        absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64 z-50
                        transition-all duration-150
                        ${galleryOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-1 pointer-events-none"}
                      `}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {galleryLinks.map(({ name, path, icon: Icon, color }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setGalleryOpen(false)}
                            className="flex items-center gap-3 px-4 py-3.5 hover:bg-yellow-50 transition group"
                          >
                            <span
                              className={`flex items-center justify-center w-9 h-9 rounded-lg transition ${badgeColors[color]}`}
                            >
                              <Icon />
                            </span>
                            <span className="font-medium text-slate-700 group-hover:text-slate-900">
                              {name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Donate Dropdown */}
          <div
            ref={donateRef}
            className="relative hidden lg:block"
            onMouseEnter={() => setDonateOpen(true)}
            onMouseLeave={() => setDonateOpen(false)}
          >
            <button
              className="
                flex items-center gap-2
                bg-yellow-500 hover:bg-yellow-600
                text-white font-semibold
                px-5 py-2.5 rounded-xl
                shadow-sm hover:shadow-md
                transition-all duration-200
                hover:scale-[1.03]
              "
              onClick={() => setDonateOpen((prev) => !prev)}
              aria-expanded={donateOpen}
            >
              <FaHeart className="text-sm" />
              Donate
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  donateOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* top-full + pt-3 removes the dead gap between button and panel */}
            <div
              className={`
                absolute top-full right-0 pt-3 w-60 z-50
                transition-all duration-150
                ${donateOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"}
              `}
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                <Link
                  to="/donate"
                  onClick={() => setDonateOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-yellow-50 transition group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 transition">
                    <FaHeart />
                  </span>
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">
                    Donate Now
                  </span>
                </Link>

                <Link
                  to="/donors"
                  onClick={() => setDonateOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-yellow-50 transition group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition">
                    <FaUsers />
                  </span>
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">
                    Donors List
                  </span>
                </Link>

                <Link
                  to="/bank-records"
                  onClick={() => setDonateOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-yellow-50 transition group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition">
                    <FaUniversity />
                  </span>
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">
                    Bank Records
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-slate-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-6">
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={navLinkStyles}
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Gallery links */}
              <div className="pl-2 border-l-2 border-slate-200">
                <p className="font-semibold text-slate-700 mb-2 px-2">Gallery</p>
                <div className="flex flex-col gap-1">
                  {galleryLinks.map(({ name, path, icon: Icon, color }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-2 text-slate-600 hover:text-yellow-500 transition"
                    >
                      <Icon className={`text-${color}-500`} />
                      {name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/donate" onClick={() => setMenuOpen(false)}>
                <button
                  className="
                    w-full mt-2 bg-yellow-500 hover:bg-yellow-600
                    text-white py-3 rounded-xl font-semibold
                    transition-all duration-300
                  "
                >
                  <div className="flex justify-center items-center gap-2">
                    <FaHeart />
                    Donate
                  </div>
                </button>
              </Link>

              {/* Donate sub-links */}
              <div className="flex flex-col gap-3 pl-2 border-l-2 border-yellow-200">
                <Link
                  to="/donors"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-700 hover:text-yellow-500 transition"
                >
                  <FaUsers className="text-blue-600" />
                  Donors List
                </Link>
                <Link
                  to="/bank-records"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-slate-700 hover:text-yellow-500 transition"
                >
                  <FaUniversity className="text-green-600" />
                  Bank Records
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;