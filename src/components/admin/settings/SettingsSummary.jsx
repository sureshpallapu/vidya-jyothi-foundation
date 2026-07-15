import {
  FaBuilding,
  FaUserTie,
  FaGraduationCap,
  FaClock,
} from "react-icons/fa";

function SettingsSummary({ settings }) {

  const cards = [

    {
      title: "Organization",
      value: settings.trust_name || "-",
      color: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: <FaBuilding />,
    },

    {
      title: "Founder",
      value: settings.founder_name || "Not Configured",
      color: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: <FaUserTie />,
    },

    {
      title: "Application Prefix",
      value: settings.application_prefix || "VJF",
      color: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <FaGraduationCap />,
    },

    {
      title: "Session Timeout",
      value: `${settings.session_timeout || 5} Minutes`,
      color: "border-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-700",
      icon: <FaClock />,
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`bg-white rounded-2xl shadow-sm border ${card.color} p-6`}
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 text-sm">

                {card.title}

              </p>

              <h2 className={`text-xl font-bold mt-2 ${card.text}`}>

                {card.value}

              </h2>

            </div>

            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${card.bg} ${card.text}`}
            >

              {card.icon}

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default SettingsSummary;