function ReportSummary({ reports }) {

  const totalApplications =
    reports.length;

  const approved =
    reports.filter(
      (item) =>
        item.status === "Approved"
    ).length;

  const released =
    reports.filter(
      (item) =>
        item.status ===
        "Scholarship Released"
    ).length;

  const totalAmount =
    reports.reduce(
      (sum, item) =>
        sum +
        Number(
          item.sanctioned_amount || 0
        ),
      0
    );

  const cards = [

    {
      title: "Applications",
      value: totalApplications,
    },

    {
      title: "Approved",
      value: approved,
    },

    {
      title: "Released",
      value: released,
    },

    {
      title: "Sanctioned Amount",
      value:
        "₹" +
        totalAmount.toLocaleString(
          "en-IN"
        ),
    },

  ];

  return (

    <div className="grid md:grid-cols-4 gap-5">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-6"
        >

          <p className="text-gray-500">

            {card.title}

          </p>

          <h2 className="mt-3 text-3xl font-bold">

            {card.value}

          </h2>

        </div>

      ))}

    </div>

  );

}

export default ReportSummary;