import { useState } from "react";
import { saveVolunteer } from "../utils/storage";
import {
  FaUserFriends,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaBullhorn,
} from "react-icons/fa";

function Volunteer() {
  const roles = [
    {
      icon: <FaUserFriends />,
      title: "Student Verification",
      description:
        "Assist in verifying scholarship applications and supporting documents.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Mentorship",
      description:
        "Guide students with academics, careers, and higher education opportunities.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Technology Support",
      description:
        "Help with website development, graphic design, software, and technical initiatives.",
    },
    {
      icon: <FaBullhorn />,
      title: "Awareness & Outreach",
      description:
        "Spread awareness about our mission, scholarship programs, and community initiatives.",
    },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    interest: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    saveVolunteer(formData);

    setSuccessMessage(
      "Thank you for showing interest in volunteering. Our team has received your request and will contact you soon via phone or email."
    );

    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      city: "",
      interest: "",
      message: "",
    });

    setTimeout(() => {
      setSuccessMessage("");
    }, 6000);
  };

  return (
    <div className="bg-slate-50">

      {/* Hero */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <span className="inline-block bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">
            Join Our Mission
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">
            Become a Volunteer
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-9">
            Every great movement begins with people willing to contribute
            their time, knowledge, and compassion. Join Vidya Jyothi
            Foundation in creating educational opportunities for deserving
            students and building a brighter future together.
          </p>

        </div>

      </section>

      {/* Why Volunteer */}

      <section className="py-24 bg-white">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-bold text-slate-900">
            Why Volunteer With Us?
          </h2>

          <p className="mt-8 text-lg text-slate-600 leading-8">
            Every volunteer plays an important role in helping students
            continue their education. Whether you mentor students,
            support technology, verify applications, or spread awareness,
            your contribution helps transform lives.
          </p>

        </div>

      </section>

      {/* Volunteer Opportunities */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {roles.map((role, index) => (

              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-slate-200
                  shadow-sm
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                "
              >

                <div className="text-yellow-500 text-5xl">
                  {role.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {role.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                  {role.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Volunteer Interest Form */}

      <section className="bg-white py-24">

        <div className="max-w-3xl mx-auto px-6">

          <div className="bg-slate-50 rounded-3xl border border-slate-200 shadow-lg p-10">

            <div className="text-center">

              <h2 className="text-4xl font-bold text-slate-900">
                Volunteer Interest Form
              </h2>

              <p className="mt-5 text-slate-600 leading-8">
                Fill in your basic details below. Our team will review
                your request and get in touch with you to discuss
                suitable volunteer opportunities.
              </p>

            </div>

            {successMessage && (
              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">

                <h3 className="text-xl font-bold text-green-700">
                  ✅ Registration Successful!
                </h3>

                <p className="mt-2 text-green-700 leading-7">
                  {successMessage}
                </p>

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name *"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number *"
                required
                pattern="[6-9]{1}[0-9]{9}"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City / District"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />

              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              >
                <option value="">
                  Select Area of Interest
                </option>

                <option value="Student Verification">
                  Student Verification
                </option>

                <option value="Mentorship">
                  Mentorship
                </option>

                <option value="Technology Support">
                  Technology Support
                </option>

                <option value="Awareness & Outreach">
                  Awareness & Outreach
                </option>

                <option value="General Volunteering">
                  General Volunteering
                </option>
              </select>

              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Why would you like to volunteer?"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-4
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-slate-900
                  font-bold
                  py-4
                  rounded-xl
                  transition-all
                  duration-300
                  hover:shadow-lg
                  hover:-translate-y-1
                "
              >
                Submit Interest
              </button>

            </form>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Volunteer;