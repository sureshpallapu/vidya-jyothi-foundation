import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function MonthlyApplicationsChart({
  data,
}) {

  const monthNames = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",

  ];

  const chartData = monthNames.map(
    (name, index) => {

      const month =
        data.find(
          (item) =>
            item.month === index + 1
        );

      return {

        month: name,

        applications:
          month?.total || 0,

      };

    }
  );

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">

        Applications by Month

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={chartData}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="applications"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default MonthlyApplicationsChart;