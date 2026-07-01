import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes, FaHeart } from "react-icons/fa";
import Logo from "./Logo";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
  name: "Scholarships",
  path: "/scholarship",
},
    { name: "Transparency", path: "/transparency" },
    { name: "Volunteer", path: "/volunteer" },
    { name: "Contact", path: "/contact" },
  ];

  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
      : "text-slate-700 hover:text-yellow-500 transition";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
        <Link
  to="/"
  className="flex items-center gap-3"
>
            <Logo />
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={navLinkStyles}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Donate Button */}
          <Link to="/donate">
            <button
              className="
                hidden
                lg:flex
                items-center
                gap-2
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-300
                hover:scale-105
              "
            >
              <FaHeart />
              Donate
            </button>
          </Link>

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

              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  className="
                    w-full
                    mt-4
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    transition-all
                    duration-300
                  "
                >
                  <div className="flex justify-center items-center gap-2">
                    <FaHeart />
                    Donate
                  </div>
                </button>
              </Link>

            </div>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;