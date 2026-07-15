import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DistrictDistributionChart({
  data,
}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">

        District Wise Applications

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={data}
          layout="vertical"
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
          />

          <YAxis
            dataKey="district"
            type="category"
            width={120}
          />

          <Tooltip />

          <Bar
            dataKey="total"
            radius={[0, 6, 6, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default DistrictDistributionChart;