import {
  FaIdCard,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUniversity,
  FaWallet,
  FaRupeeSign,
  FaFingerprint,
} from "react-icons/fa";

function ApplicationSummaryCards({

  application,

}) {

  const cards = [

  {
    title: "Application No",
    value: application.application_id,
    icon: <FaIdCard />,
    bg: "bg-blue-600",
  },

  {
    title: "Mobile",
    value: application.mobile,
    icon: <FaPhoneAlt />,
    bg: "bg-green-600",
  },

  {
    title: "Aadhaar",
    value: application.aadhaar,
    icon: <FaFingerprint />,
    bg: "bg-purple-600",
  },

  {
    title: "District",
    value: application.district,
    icon: <FaMapMarkerAlt />,
    bg: "bg-red-600",
  },

  {
    title: "Course",
    value: application.course,
    icon: <FaGraduationCap />,
    bg: "bg-yellow-600",
  },

  {
    title: "College",
    value: application.college_name,
    icon: <FaUniversity />,
    bg: "bg-indigo-600",
  },

  {
    title: "Family Income",
    value: application.annual_family_income
      ? `₹ ${Number(application.annual_family_income).toLocaleString("en-IN")}`
      : "-",
    icon: <FaWallet />,
    bg: "bg-emerald-600",
  },

  {
    title: "Sanctioned",
    value: application.sanctioned_amount
      ? `₹ ${Number(application.sanctioned_amount).toLocaleString("en-IN")}`
      : "-",
    icon: <FaRupeeSign />,
    bg: "bg-cyan-600",
  },

];

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-white rounded-xl shadow-md border p-5"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                {card.title}

              </p>

              <h3 className="mt-2 font-bold text-lg break-all">

                {card.value}

              </h3>

            </div>

            <div
           className={`

  w-12
  h-12
  rounded-xl
  flex
  items-center
  justify-center
  text-white
  ${card.bg}

`}
            >

              {card.icon}

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default ApplicationSummaryCards;