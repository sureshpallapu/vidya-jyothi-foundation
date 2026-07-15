import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { foundation } from "../data/foundation";
import { useSettings } from "../context/SettingsContext";


function Footer() {
  const { settings, loading } = useSettings();
  return (
    <footer className="bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Foundation */}

          <div>

            <h2 className="text-3xl font-bold text-white">
              {
  loading
    ? foundation.name
    : settings?.trust_name ||
      foundation.name
}
            </h2>

            <p className="mt-6 text-slate-400 leading-8">
              {foundation.mission}
            </p>

            <p className="mt-5 text-slate-400 leading-7">
              Empowering deserving students through scholarships,
              educational support, mentorship, and community service.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">

              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/scholarships"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Scholarships
                </Link>
              </li>

              <li>
                <Link
                  to="/donate"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Donate
                </Link>
              </li>

              <li>
                <Link
                  to="/volunteer"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Volunteer
                </Link>
              </li>

              <li>
                <Link
                  to="/transparency"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Transparency
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-yellow-400 transition"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold text-white">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              <a
                href={`mailto:${
settings?.trust_email ||
foundation.email
}`}
                className="flex items-start gap-3 text-slate-400 hover:text-yellow-400 transition"
              >
                <FaEnvelope className="mt-1" />

<span>

{
settings?.trust_email ||
foundation.email
}

</span>
              </a>

              <a
                href={`tel:${settings?.trust_phone || foundation.phone}`}
                className="flex items-start gap-3 text-slate-400 hover:text-yellow-400 transition"
              >
                <FaPhoneAlt className="mt-1" />

                <span>{settings?.trust_phone ||
foundation.phone}</span>

              </a>

              <div className="flex items-start gap-3 text-slate-400">

                <FaMapMarkerAlt className="mt-1" />

                <span>
                  {foundation.district},
                  <br />
                  {foundation.state}
                </span>

              </div>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="text-xl font-semibold text-white">
              Connect With Us
            </h3>

            <p className="mt-6 text-slate-400 leading-7">
              Stay connected with our latest initiatives,
              scholarship announcements, and community activities.
            </p>

            <div className="flex gap-4 mt-8">

              <a
                href={foundation.facebook}
                target="_blank"
                rel="noreferrer"
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-800
                  flex
                  items-center
                  justify-center
                  hover:bg-yellow-500
                  hover:text-slate-900
                  transition-all
                "
              >
                <FaFacebookF />
              </a>

              <a
                href={foundation.instagram}
                target="_blank"
                rel="noreferrer"
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-800
                  flex
                  items-center
                  justify-center
                  hover:bg-yellow-500
                  hover:text-slate-900
                  transition-all
                "
              >
                <FaInstagram />
              </a>

              <a
                href={foundation.linkedin}
                target="_blank"
                rel="noreferrer"
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-800
                  flex
                  items-center
                  justify-center
                  hover:bg-yellow-500
                  hover:text-slate-900
                  transition-all
                "
              >
                <FaLinkedinIn />
              </a>

              <a
                href={foundation.youtube}
                target="_blank"
                rel="noreferrer"
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-800
                  flex
                  items-center
                  justify-center
                  hover:bg-yellow-500
                  hover:text-slate-900
                  transition-all
                "
              >
                <FaYoutube />
              </a>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-slate-800 mt-16 pt-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <p className="text-slate-500 text-center lg:text-left">
              © 2026 {

loading
  ? foundation.name
  : settings?.trust_name ||
    foundation.name

}. All Rights Reserved.
            </p>

            <div className="flex gap-6 text-sm">

              <Link
                to="/privacy-policy"
                className="text-slate-500 hover:text-yellow-400 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="text-slate-500 hover:text-yellow-400 transition"
              >
                Terms & Conditions
              </Link>

            </div>

            <p className="flex items-center gap-2 text-slate-500 text-center">

              Designed & Developed with

              <FaHeart className="text-red-500" />

              by <span className="font-semibold text-yellow-400">
                Suresh (Founder)
              </span>

            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;