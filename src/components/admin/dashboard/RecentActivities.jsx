function RecentActivities({
  activities,
}) {

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-6">

        Recent Workflow Activities

      </h2>

      <div className="space-y-4">

        {activities.length === 0 ? (

          <p className="text-gray-500">

            No recent activities.

          </p>

        ) : (

          activities.map((activity) => (

            <div
              key={`${activity.application_id}-${activity.changed_at}`}
              className="border-b pb-3"
            >

              <p className="font-medium">

                {activity.application_id}

              </p>

              <p className="text-sm text-gray-600">

                {activity.previous_status}

                {" → "}

                {activity.current_status}

              </p>

              <p className="text-xs text-gray-500 mt-1">

                By {activity.full_name}

              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default RecentActivities;