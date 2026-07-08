import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getApplicationDetails,
} from "../../../api/applicationDetailsApi";

import {
  getHistory,
} from "../../../api/historyApi";

import {
  updateWorkflow,
} from "../../../api/workflowApi";

import PersonalCard from "../../../components/admin/applications/details/PersonalCard";
import AddressCard from "../../../components/admin/applications/details/AddressCard";
import EducationCard from "../../../components/admin/applications/details/EducationCard";
import BankCard from "../../../components/admin/applications/details/BankCard";
import DocumentsCard from "../../../components/admin/applications/details/DocumentsCard";
import StatusCard from "../../../components/admin/applications/details/StatusCard";
import HistoryCard from "../../../components/admin/applications/details/HistoryCard";
import TimelineCard from "../../../components/admin/applications/details/TimelineCard";
import StatusBadge from "../../../components/admin/applications/StatusBadge";

function ApplicationDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  const [documents, setDocuments] = useState({});

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [workflowLoading, setWorkflowLoading] =
    useState(false);

  useEffect(() => {

    loadApplication();

  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Load Application
  |--------------------------------------------------------------------------
  */

  const loadApplication = async () => {

    try {

      setLoading(true);

      const response =
        await getApplicationDetails(id);

      setApplication(
        response.data.data.application
      );

      setDocuments(
        response.data.data.documents
      );

      const historyResponse =
        await getHistory(id);

      setHistory(
        historyResponse.data.data
      );

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Save Workflow
  |--------------------------------------------------------------------------
  */

  const handleWorkflowSave = async (data) => {

    try {

      setWorkflowLoading(true);

      const admin = JSON.parse(
        localStorage.getItem("admin")
      );

      await updateWorkflow(id, {

        ...data,

        adminId: admin.id,

      });

      await loadApplication();

      alert("Workflow updated successfully.");

    }

    catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update workflow."
      );

    }

    finally {

      setWorkflowLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );

  }

  if (!application) {

    return (
      <div className="p-10">
        Application not found.
      </div>
    );

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center">

        <div>

          <button
            onClick={() =>
              navigate("/admin/applications")
            }
            className="text-blue-600 hover:underline mb-2"
          >
            ← Back to Applications
          </button>

          <h1 className="text-3xl font-bold">

            {application.applicationId}

          </h1>

          <p className="text-gray-500 mt-1">

            Scholarship Application Review

          </p>

        </div>

        <StatusBadge
          status={application.status}
        />

      </div>

      {/* Main Grid */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          <PersonalCard
            application={application}
          />

          <AddressCard
            application={application}
          />

          <EducationCard
            application={application}
          />

          <BankCard
            application={application}
          />

        </div>

        {/* Right */}

        <div className="space-y-6">

          <StatusCard
            application={application}
            loading={workflowLoading}
            onSave={handleWorkflowSave}
          />

          <HistoryCard
            history={history}
          />

          <TimelineCard
            currentStatus={
              application.status
            }
            history={history}
          />

        </div>

      </div>

      {/* Documents */}

      <DocumentsCard
        documents={documents}
      />

    </div>

  );

}

export default ApplicationDetails;