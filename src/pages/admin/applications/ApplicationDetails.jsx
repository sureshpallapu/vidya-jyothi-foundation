import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getApplicationDetails } from "../../../api/applicationDetailsApi";
import { getHistory } from "../../../api/historyApi";
import { updateWorkflow } from "../../../api/workflowApi";

import PersonalCard from "../../../components/admin/applications/details/PersonalCard";
import AddressCard from "../../../components/admin/applications/details/AddressCard";
import EducationCard from "../../../components/admin/applications/details/EducationCard";
import BankCard from "../../../components/admin/applications/details/BankCard";
import DocumentsCard from "../../../components/admin/applications/details/DocumentsCard";
import StatusCard from "../../../components/admin/applications/details/StatusCard";
import HistoryCard from "../../../components/admin/applications/details/HistoryCard";
import TimelineCard from "../../../components/admin/applications/details/TimelineCard";
//import StatusBadge from "../../../components/admin/applications/StatusBadge";
import ApplicationPrint from "../../../components/admin/applications/print/ApplicationPrint";
import ApplicationHero from "../../../components/admin/applications/details/ApplicationHero";
import ApplicationSummaryCards from "../../../components/admin/applications/details/ApplicationSummaryCards";

import pdfGenerator from "../../../utils/pdfGenerator";
function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workflowLoading, setWorkflowLoading] = useState(false);

  const printRef = useRef(null);

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

      const response = await getApplicationDetails(id);
      setApplication(response.data.data.application);
      setDocuments(response.data.data.documents);
      console.log(response.data.data.documents);

      const historyResponse = await getHistory(id);
      setHistory(historyResponse.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Workflow
  |--------------------------------------------------------------------------
  */
  const handleWorkflowSave = async (data) => {
    // Safe fallback: an empty/null admin session shouldn't crash the save,
    // it should surface a clear message instead.
    const admin = JSON.parse(localStorage.getItem("admin")) || {};

    if (!admin.id) {
      alert("Your session has expired. Please log in again.");
      navigate("/admin/login");
      return;
    }

    try {
      setWorkflowLoading(true);

      await updateWorkflow(id, {
        ...data,
        adminId: admin.id,
      });

      await loadApplication();
      alert("Workflow updated successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to update workflow."
      );
    } finally {
      setWorkflowLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Print Application
  |--------------------------------------------------------------------------
  */


  const handlePrint = async () => {

 await pdfGenerator(
  application,
  documents
);

};

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!application) {
    return <div className="p-10">Application not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
    <ApplicationHero
  application={application}
  documents={documents}
  onBack={() => navigate("/admin/applications")}
  onPrint={handlePrint}
/>

      

      <ApplicationSummaryCards application={application} />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
        <PersonalCard
    application={application}
    documents={documents}
/>
          <AddressCard application={application} />
          <EducationCard application={application} />
          <BankCard application={application} />
        </div>

        {/* Right */}
        <div className="space-y-8">
          <StatusCard
            application={application}
            loading={workflowLoading}
            onSave={handleWorkflowSave}
          />

          <HistoryCard history={history} />

          <TimelineCard
            currentStatus={application.status}
            history={history}
          />
        </div>
      </div>

      {/* Documents */}
      <DocumentsCard documents={documents} />

      {/* Hidden print layout — never shown on screen, only read via
          printRef.current.innerHTML when "Print Application" is clicked */}
      <div
  style={{
    position: "absolute",
    left: "-9999px",
    top: 0,
    width: "210mm",
    background: "#fff",
  }}
>
  <div ref={printRef}>
    <ApplicationPrint application={application} />
  </div>
</div>
    </div>
  );
}

export default ApplicationDetails;