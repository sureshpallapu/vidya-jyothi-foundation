import SectionCard from "../SectionCard";
import DocumentItem from "./DocumentItem";

function DocumentsCard({ documents }) {
  return (

    <SectionCard title="Uploaded Documents">

      <div className="space-y-5">

        <DocumentItem
          title="Student Photo"
          document={documents.photo}
        />

        <DocumentItem
          title="Aadhaar Card"
          document={documents.aadhaar}
        />

        <DocumentItem
          title="Previous Marks Memo"
          document={documents.marksMemo}
        />

        <DocumentItem
          title="Bank Passbook"
          document={documents.passbook}
        />

      </div>

    </SectionCard>

  );
}

export default DocumentsCard;