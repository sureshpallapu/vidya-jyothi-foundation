import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import DocumentForm from "../../../components/admin/trustDocuments/DocumentForm";

import {
  createDocument,
  getDocumentCategories,
} from "../../../api/trustDocumentApi";

function AddTrustDocument() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    category_id: "",
    document_name: "",
    document_number: "",
    issuing_authority: "",
    issue_date: "",
    expiry_date: "",
    is_permanent: false,
    description: "",
  });

  /* ===========================================
      Load Categories
  =========================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getDocumentCategories();

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to load document categories.",
      });
    }
  };

  /* ===========================================
      Submit
  =========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Document Required",
        text: "Please select a PDF document.",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "category_id",
        formData.category_id
      );

      data.append(
        "document_name",
        formData.document_name
      );

      data.append(
        "document_number",
        formData.document_number
      );

      data.append(
        "issuing_authority",
        formData.issuing_authority
      );

      data.append(
        "issue_date",
        formData.issue_date
      );

      data.append(
        "expiry_date",
        formData.expiry_date
      );

      data.append(
        "is_permanent",
        formData.is_permanent ? 1 : 0
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "document",
        selectedFile
      );

      await createDocument(data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Document uploaded successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/trust-documents");

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error.response?.data?.message ||
          "Failed to upload document.",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Upload Trust Document
        </h1>

        <p className="text-slate-500 mt-1">
          Add a new legal or statutory document.
        </p>

      </div>

      <DocumentForm
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        loading={loading}
        onSubmit={handleSubmit}
        submitText="Upload Document"
      />

    </div>
  );
}

export default AddTrustDocument;