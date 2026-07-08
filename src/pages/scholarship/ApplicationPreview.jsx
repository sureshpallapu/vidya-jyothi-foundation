import FormSection from "../../components/common/FormSection";

function ApplicationPreview({ formData }) {
  return (
    <div>

      <h2 className="text-3xl font-bold text-center mb-8">
        Scholarship Application Preview
      </h2>

      <FormSection title="Personal Details">

        <div className="grid md:grid-cols-2 gap-4">

          <p><strong>Student Name:</strong> {formData.studentName}</p>

          <p><strong>Father Name:</strong> {formData.fatherName}</p>

          <p><strong>Mother Name:</strong> {formData.motherName}</p>

          <p><strong>Date of Birth:</strong> {formData.dob}</p>

          <p><strong>Gender:</strong> {formData.gender}</p>

          <p><strong>Mobile:</strong> {formData.mobile}</p>

          <p><strong>Email:</strong> {formData.email}</p>

          <p><strong>Aadhaar:</strong> {formData.aadhaar}</p>

        </div>

      </FormSection>

      <FormSection title="Address Details">

        <div className="grid md:grid-cols-2 gap-4">

          <p><strong>Address:</strong> {formData.address}</p>

          <p><strong>District:</strong> {formData.district}</p>

          <p><strong>State:</strong> {formData.state}</p>

          <p><strong>Pincode:</strong> {formData.pincode}</p>

        </div>

      </FormSection>

      <FormSection title="Education Details">

        <div className="grid md:grid-cols-2 gap-4">

          <p><strong>College:</strong> {formData.collegeName}</p>

          <p><strong>Course:</strong> {formData.course}</p>

          <p><strong>Study Year:</strong> {formData.studyYear}</p>

          <p><strong>Qualification:</strong> {formData.previousQualification}</p>

          <p><strong>Percentage:</strong> {formData.previousPercentage}%</p>

        </div>

      </FormSection>

      <FormSection title="Bank Details">

        <div className="grid md:grid-cols-2 gap-4">

          <p><strong>Bank:</strong> {formData.bankName}</p>

          <p>
            <strong>Account:</strong>{" "}
            {"*".repeat(
              Math.max(0, formData.accountNumber.length - 4)
            ) + formData.accountNumber.slice(-4)}
          </p>

          <p><strong>IFSC:</strong> {formData.ifscCode}</p>

        </div>

      </FormSection>

      <FormSection title="Uploaded Documents">

        <ul className="space-y-2">

          <li>📷 {formData.documents.photo?.name}</li>

          <li>🪪 {formData.documents.aadhaar?.name}</li>

          <li>🎓 {formData.documents.marksMemo?.name}</li>

          <li>🏦 {formData.documents.passbook?.name}</li>

        </ul>

      </FormSection>

      <FormSection title="Declaration">

        <p>

          <strong>Accepted:</strong>{" "}

          {formData.declarationAccepted
            ? "Yes"
            : "No"}

        </p>

      </FormSection>

    </div>
  );
}

export default ApplicationPreview;