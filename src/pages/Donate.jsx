import {
  FaBook,
  FaGraduationCap,
  FaLaptop,
  FaHeart,
} from "react-icons/fa";

function Donate() {
  const donationPlans = [
    {
      amount: "₹500",
      title: "Books & Stationery",
      description:
        "Help provide notebooks, textbooks, and essential study materials for deserving students.",
      icon: <FaBook />,
    },
    {
      amount: "₹2,000",
      title: "Exam Fee Support",
      description:
        "Support students in paying examination fees so they can continue their education.",
      icon: <FaGraduationCap />,
    },
    {
      amount: "₹5,000",
      title: "Semester Assistance",
      description:
        "Contribute towards tuition fees and academic expenses for one semester.",
      icon: <FaLaptop />,
    },
    {
      amount: "₹10,000+",
      title: "Sponsor A Student",
      description:
        "Completely support a deserving student's educational journey and future.",
      icon: <FaHeart />,
    },
  ];

  return (
    <div className="bg-slate-50">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-28">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <span className="inline-block bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">
            ❤️ Support Education
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold leading-tight">
            Every Donation
            <br />
            Creates A Better Future
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-9 max-w-3xl mx-auto">
            Your contribution helps deserving students continue their
            education, achieve their dreams, and build a brighter future.
            Every donation, regardless of size, creates meaningful impact.
          </p>

          <a
            href="#bank-details"
            className="
              inline-block
              mt-10
              bg-yellow-500
              hover:bg-yellow-400
              text-slate-900
              px-8
              py-4
              rounded-xl
              font-bold
              transition-all
            "
          >
            Donate Now
          </a>

        </div>

      </section>

      {/* Why Donate */}

      <section className="py-24 bg-white">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Why Your Donation Matters
            </h2>

            <p className="mt-6 text-lg text-slate-600 leading-8 max-w-4xl mx-auto">
              Education has the power to transform lives. Your support
              enables us to provide scholarships, educational resources,
              mentorship, and opportunities to deserving students from
              financially challenged backgrounds.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

            <div className="bg-slate-50 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">

              <div className="text-5xl">📚</div>

              <h3 className="mt-6 text-2xl font-bold">
                Books
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                Essential textbooks and learning materials.
              </p>

            </div>

            <div className="bg-slate-50 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">

              <div className="text-5xl">🎓</div>

              <h3 className="mt-6 text-2xl font-bold">
                Scholarships
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                Financial assistance for deserving students.
              </p>

            </div>

            <div className="bg-slate-50 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">

              <div className="text-5xl">💻</div>

              <h3 className="mt-6 text-2xl font-bold">
                Digital Learning
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                Technology and online learning support.
              </p>

            </div>

            <div className="bg-slate-50 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">

              <div className="text-5xl">❤️</div>

              <h3 className="mt-6 text-2xl font-bold">
                Student Welfare
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                Helping students achieve their educational goals.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Donation Plans */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Your Contribution Makes A Difference
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              Choose an amount or contribute any amount of your choice.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

            {donationPlans.map((plan, index) => (

              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-lg
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                "
              >

                <div className="text-5xl text-yellow-500">

                  {plan.icon}

                </div>

                <h3 className="mt-6 text-4xl font-bold text-blue-700">

                  {plan.amount}

                </h3>

                <h4 className="mt-4 text-2xl font-semibold">

                  {plan.title}

                </h4>

                <p className="mt-5 text-slate-600 leading-7">

                  {plan.description}

                </p>

                <a
                  href="#bank-details"
                  className="
                    block
                    mt-8
                    text-center
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-slate-900
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Donate
                </a>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* Bank Details */}

      <section
        id="bank-details"
        className="bg-white py-24"
      >

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Official Bank Details
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              You can contribute directly to the Trust using the
              following bank account details.
            </p>

          </div>

          <div className="mt-14 bg-slate-900 rounded-3xl p-10 shadow-xl">

            <div className="grid md:grid-cols-2 gap-8">

              <div>

                <p className="text-slate-400 text-sm">
                  Account Name
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  Vidya Jyothi Foundation
                </h3>

              </div>

              <div>

                <p className="text-slate-400 text-sm">
                  Account Number
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  XXXXXXXXXXXXXXXX
                </h3>

              </div>

              <div>

                <p className="text-slate-400 text-sm">
                  Bank Name
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  State Bank of India
                </h3>

              </div>

              <div>

                <p className="text-slate-400 text-sm">
                  IFSC Code
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  SBIN0000000
                </h3>

              </div>

              <div className="md:col-span-2">

                <p className="text-slate-400 text-sm">
                  Branch
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  Guntur Branch
                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* UPI Section */}

      <section className="py-24">

        <div className="max-w-4xl mx-auto px-6">

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <h2 className="text-4xl font-bold text-slate-900">
              Donate Using UPI
            </h2>

            <p className="mt-5 text-slate-600">
              Scan the QR Code below using any UPI App.
            </p>

            {/* Replace this div with your QR Image */}

            <div className="mt-10 w-72 h-72 mx-auto rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">

              <div>

                <p className="text-7xl">
                  📱
                </p>

                <p className="mt-4 text-slate-500">
                  QR Code Here
                </p>

              </div>

            </div>

            <div className="mt-8">

              <h3 className="text-2xl font-bold text-blue-700">
                vidyajyothi@upi
              </h3>

              <p className="mt-2 text-slate-500">
                UPI ID
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Transparency */}

      <section className="bg-white py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Our Transparency Promise
            </h2>

            <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
              Every contribution entrusted to us is handled with
              complete responsibility and accountability.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ Every donation is properly recorded.
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ Funds are used only for Trust initiatives.
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ Scholarship beneficiaries will be documented.
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ Annual reports will be published.
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ Donor information is kept confidential.
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              ✅ We are committed to 100% transparency.
            </div>

          </div>

        </div>

      </section>

            {/* FAQ */}

      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              Common questions about donating to Vidya Jyothi Foundation.
            </p>

          </div>

          <div className="mt-14 space-y-6">

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h3 className="text-xl font-semibold">
                Will I receive a donation acknowledgement?
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Yes. Every donor will receive an acknowledgement from the
                Foundation after the donation is received and verified.
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h3 className="text-xl font-semibold">
                How will my donation be used?
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                Donations are utilized only for scholarships, educational
                support, student welfare, and other approved initiatives of
                the Foundation.
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h3 className="text-xl font-semibold">
                Can I sponsor a specific student?
              </h3>

              <p className="mt-3 text-slate-600 leading-7">
                This feature will be available in the future. Currently,
                donations support the Foundation's educational programs.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Contact */}

      <section className="bg-slate-900 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-white">
              Need Assistance?
            </h2>

            <p className="mt-6 text-lg text-slate-300">
              We're happy to help with any donation or sponsorship queries.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">

            {/* Call */}

            <a
              href="tel:+91XXXXXXXXXX"
              className="
                bg-white
                rounded-3xl
                p-8
                text-center
                shadow-lg
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
              "
            >

              <div className="text-5xl">
                📞
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Call Us
              </h3>

              <p className="mt-3 text-slate-600">
                +91 XXXXX XXXXX
              </p>

            </a>

            {/* WhatsApp */}

            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="
                bg-white
                rounded-3xl
                p-8
                text-center
                shadow-lg
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
              "
            >

              <div className="text-5xl">
                💬
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                WhatsApp
              </h3>

              <p className="mt-3 text-slate-600">
                Chat with our team
              </p>

            </a>

            {/* Email */}

            <a
              href="mailto:info@vidyajyothi.org"
              className="
                bg-white
                rounded-3xl
                p-8
                text-center
                shadow-lg
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
              "
            >

              <div className="text-5xl">
                ✉️
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Email Us
              </h3>

              <p className="mt-3 text-slate-600 break-all">
                info@vidyajyothi.org
              </p>

            </a>

          </div>

        </div>

      </section>

      {/* Final CTA */}

      <section className="bg-yellow-500 py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-extrabold text-slate-900">
            Together We Can Transform Lives ❤️
          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-800">

            Every donation is more than financial support—it is an
            investment in a student's future. Your generosity helps
            deserving students continue their education and achieve
            their dreams.

          </p>

          <a
            href="#bank-details"
            className="
              inline-block
              mt-10
              bg-slate-900
              text-white
              px-8
              py-4
              rounded-xl
              font-semibold
              hover:bg-slate-800
              transition
            "
          >
            Donate Today
          </a>

        </div>

      </section>

    </div>
  );
}

export default Donate;