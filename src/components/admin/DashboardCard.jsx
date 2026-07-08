function DashboardCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-md
        border-l-4
        p-6
        hover:shadow-lg
        transition
      "
      style={{
        borderColor: color,
      }}
    >
      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p
        className="text-4xl font-bold mt-3"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

export default DashboardCard;