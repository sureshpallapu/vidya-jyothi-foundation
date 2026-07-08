import { useEffect, useState } from "react";

import {
  FaSyncAlt,
} from "react-icons/fa";

import {
  getApplications,
} from "../../../api/applicationApi";

import ApplicationTable from "../../../components/admin/applications/ApplicationTable";

function Applications() {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadApplications();

  }, []);

  const loadApplications = async () => {

    try {

      setLoading(true);

      const response =
        await getApplications();

      setApplications(
        response.data.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            Scholarship Applications

          </h1>

          <p className="text-gray-500 mt-2">

            Manage scholarship applications submitted by students.

          </p>

        </div>

        <button
          onClick={loadApplications}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          <FaSyncAlt />

          Refresh

        </button>

      </div>

      <ApplicationTable
        applications={applications}
        loading={loading}
      />

    </div>

  );

}

export default Applications;