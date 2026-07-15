import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#F59E0B",
  "#8B5CF6",
  "#10B981",
  "#EF4444",
  "#059669",
];

function StatusDistributionChart({
  data,
}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">

        Application Status

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="total"
            nameKey="status"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default StatusDistributionChart;