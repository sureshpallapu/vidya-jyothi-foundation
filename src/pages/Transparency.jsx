import {
  FaMoneyBillWave,
  FaUserGraduate,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import PageTitle from "../components/PageTitle";
function Transparency() {
  const principles = [
    {
      icon: <FaMoneyBillWave />,
      title: "Responsible Donations",
      color: "text-green-600",
      description:
        "Every contribution received will be properly recorded and utilized responsibly for approved educational initiatives.",
    },
    {
      icon: <FaUserGraduate />,
      title: "Fair Scholarship Selection",
      color: "text-yellow-500",
      description:
        "Scholarships will be awarded through a transparent, merit-based and need-based evaluation process.",
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Financial Reporting",
      color: "text-blue-600",
      description:
        "Annual financial statements, scholarship reports, and foundation activities will be published as they become available.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Ethical Governance",
      color: "text-red-500",
      description:
        "Integrity, accountability, and transparency guide every decision and every initiative undertaken by the foundation.",
    },
  ];

  const timeline = [
    "Donation Received",
    "Recorded & Verified",
    "Allocated to Educational Programs",
    "Student Selection Process",
    "Scholarship Distribution",
    "Annual Public Reporting",
  ];

  return (
    <div className="bg-slate-50">
<PageTitle title="Transparency" />
      {/* Hero */}

      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <span className="inline-block bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-semibold">
            100% Transparency Commitment
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold leading-tight">
            Transparency &
            <br />
            Accountability
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-9">
            At Vidya Jyothi Foundation, transparency is not just a
            policy—it is our promise. Every contribution will be
            responsibly managed, properly documented, and utilized
            solely to support our educational mission.
          </p>

        </div>

      </section>

      {/* Principles */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              Our Commitment
            </h2>

            <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
              We are committed to maintaining complete transparency,
              responsible governance, and ethical management in every
              activity undertaken by the foundation.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

            {principles.map((item, index) => (

              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-8
                  border
                  border-slate-200
                  shadow-sm
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                  duration-300
                "
              >

                <div className={`text-5xl ${item.color}`}>
                  {item.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-5 text-slate-600 leading-8">
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Timeline */}

      <section className="bg-white py-24">

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center">

            <h2 className="text-5xl font-bold text-slate-900">
              How Every Donation Is Managed
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              Every contribution follows a transparent and accountable
              process before reaching its intended purpose.
            </p>

          </div>

          <div className="mt-16 space-y-6">

            {timeline.map((step, index) => (

              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-5
                  bg-slate-50
                  rounded-2xl
                  p-6
                  border
                  border-slate-200
                "
              >

                <div className="text-green-600 text-2xl">

                  <FaCheckCircle />

                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Reports */}

      <section className="py-24">

        <div className="max-w-4xl mx-auto px-6">

          <div
            className="
              bg-white
              rounded-3xl
              shadow-lg
              border
              border-slate-200
              p-12
              text-center
            "
          >

            <h2 className="text-4xl font-bold text-slate-900">
              Future Reports & Documents
            </h2>

            <p className="mt-6 text-lg text-slate-600 leading-8">
              As Vidya Jyothi Foundation grows, we will publish annual
              financial reports, scholarship beneficiary reports,
              impact reports, and other important documents on this
              page to ensure complete public transparency.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-12">

              <div className="bg-slate-100 rounded-2xl p-5 font-semibold">
                📄 Annual Financial Report
                <p className="text-sm text-slate-500 mt-2">
                  Available Soon
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-5 font-semibold">
                🎓 Scholarship Report
                <p className="text-sm text-slate-500 mt-2">
                  Available Soon
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-5 font-semibold">
                📊 Impact Report
                <p className="text-sm text-slate-500 mt-2">
                  Available Soon
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-5 font-semibold">
                📑 Audit Report
                <p className="text-sm text-slate-500 mt-2">
                  Available Soon
                </p>
              </div>

            </div>

            <p className="mt-10 text-slate-600 italic">
              "Trust is earned through openness, honesty, and
              accountability. We are committed to upholding these
              principles in every step of our journey."
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Transparency;