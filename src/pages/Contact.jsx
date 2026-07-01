import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    subject: "",
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

    const contacts =
      JSON.parse(localStorage.getItem("contacts")) || [];

    contacts.push({
      ...formData,
      submittedAt: new Date().toLocaleString(),
      status: "Pending",
    });

    localStorage.setItem(
      "contacts",
      JSON.stringify(contacts)
    );

    setSuccessMessage(
      "Thank you for contacting Vidya Jyothi Foundation. Our team has received your message and will get back to you within 24 hours."
    );

    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      subject: "",
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

        <div className="max-w-6xl mx-auto px-6 text-center">

          <span className="inline-block bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">
            We'd Love To Hear From You
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold">
            Contact Us
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-9 max-w-3xl mx-auto">
            Whether you have questions about scholarships,
            volunteering, donations, or partnerships, we're here
            to help. Feel free to reach out to us anytime.
          </p>

        </div>

      </section>

      {/* Contact Section */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Details */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10">

              <h2 className="text-3xl font-bold text-slate-900">
                Get In Touch
              </h2>

              <p className="mt-4 text-slate-600 leading-7">
                We'd be happy to answer your questions and guide you.
                Our team usually responds within one business day.
              </p>

              <div className="mt-10 space-y-8">

                <div className="flex gap-5">

                  <div className="bg-yellow-100 p-4 rounded-xl">

                    <FaEnvelope className="text-yellow-600 text-2xl" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Email Address
                    </h3>

                    <a
                      href="mailto:info@vidyajyothi.org"
                      className="text-blue-700 hover:underline"
                    >
                      info@vidyajyothi.org
                    </a>

                  </div>

                </div>

                <div className="flex gap-5">

                  <div className="bg-green-100 p-4 rounded-xl">

                    <FaPhone className="text-green-600 text-2xl" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Phone Number
                    </h3>

                    <a
                      href="tel:+919999999999"
                      className="text-blue-700 hover:underline"
                    >
                      +91 XXXXX XXXXX
                    </a>

                  </div>

                </div>

                <div className="flex gap-5">

                  <div className="bg-emerald-100 p-4 rounded-xl">

                    <FaWhatsapp className="text-green-600 text-2xl" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      WhatsApp
                    </h3>

                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      Chat With Us
                    </a>

                  </div>

                </div>

                <div className="flex gap-5">

                  <div className="bg-red-100 p-4 rounded-xl">

                    <FaMapMarkerAlt className="text-red-500 text-2xl" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Office Address
                    </h3>

                    <p className="text-slate-600">
                      Guntur,
                      Andhra Pradesh,
                      India
                    </p>

                  </div>

                </div>

                <div className="flex gap-5">

                  <div className="bg-blue-100 p-4 rounded-xl">

                    <FaClock className="text-blue-600 text-2xl" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Office Hours
                    </h3>

                    <p className="text-slate-600">
                      Monday – Saturday
                    </p>

                    <p className="text-slate-600">
                      9:00 AM – 6:00 PM
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Contact Form */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10">

              <div className="text-center">

                <h2 className="text-3xl font-bold">
                  Send Us a Message
                </h2>

                <p className="mt-4 text-slate-600">
                  Fill out the form below and we'll get back to you soon.
                </p>

              </div>

              {successMessage && (

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">

                  <h3 className="text-xl font-bold text-green-700">
                    ✅ Message Sent Successfully!
                  </h3>

                  <p className="mt-2 text-green-700 leading-7">
                    {successMessage}
                  </p>

                </div>

              )}

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >                <input
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
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject *"
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

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message *"
                  required
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
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

      {/* Quick Contact */}

      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-slate-900 rounded-3xl p-10 text-center">

            <h2 className="text-4xl font-bold text-white">
              Need Immediate Assistance?
            </h2>

            <p className="mt-4 text-slate-300 text-lg">
              You can also reach us directly through phone,
              WhatsApp, or email.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-5">

              <a
                href="tel:+919999999999"
                className="
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-slate-900
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  transition-all
                "
              >
                📞 Call Us
              </a>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  transition-all
                "
              >
                💬 WhatsApp
              </a>

              <a
                href="mailto:info@vidyajyothi.org"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  transition-all
                "
              >
                📧 Email Us
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* Google Map Placeholder */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div
            className="
              h-96
              rounded-3xl
              border-2
              border-dashed
              border-slate-300
              bg-white
              flex
              flex-col
              justify-center
              items-center
              text-center
            "
          >

            <div className="text-6xl">
              📍
            </div>

            <h3 className="mt-6 text-3xl font-bold text-slate-900">
              Google Map
            </h3>

            <p className="mt-4 text-slate-600">
              Our office location map will be embedded here.
            </p>

            <p className="mt-2 text-slate-500">
              Coming Soon
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;