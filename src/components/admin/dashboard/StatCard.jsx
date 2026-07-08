import { Link } from "react-router-dom";

function StatCard({
  title,
  value,
  color,
  icon,
  link,
}) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border-l-4"
      style={{
        borderColor: color,
      }}
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl"
          style={{
            background: color,
          }}
        >
          {icon}
        </div>

      </div>

      <div className="mt-5 text-sm text-blue-600 font-medium">

        View Details →

      </div>

    </Link>
  );
}

export default StatCard;