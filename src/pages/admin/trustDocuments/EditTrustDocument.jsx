import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import DocumentForm from "../../../components/admin/trustDocuments/DocumentForm";

import {
  getDocument,
  updateDocument,
  getDocumentCategories,
} from "../../../api/trustDocumentApi";

function EditTrustDocument() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

  useEffect(() => {
    loadCategories();
    loadDocument();
  }, []);

  /* ===========================================
      Categories
  =========================================== */

  const loadCategories = async () => {
    try {
      const response = await getDocumentCategories();

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* ===========================================
      Load Document
  =========================================== */

  const loadDocument = async () => {
    try {
      const response = await getDocument(id);

      const doc = response.data.data;

      setFormData({
        category_id: doc.category_id || "",
        document_name: doc.document_name || "",
        document_number: doc.document_number || "",
        issuing_authority: doc.issuing_authority || "",
        issue_date: doc.issue_date
          ? doc.issue_date.substring(0, 10)
          : "",
        expiry_date: doc.expiry_date
          ? doc.expiry_date.substring(0, 10)
          : "",
        is_permanent: Number(doc.is_permanent) === 1,
        description: doc.description || "",
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Document Not Found",
      });

      navigate("/admin/trust-documents");

    } finally {

      setPageLoading(false);

    }
  };

  /* ===========================================
      Submit
  =========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const data = new FormData();

      data.append("category_id", formData.category_id);
      data.append("document_name", formData.document_name);
      data.append("document_number", formData.document_number);
      data.append("issuing_authority", formData.issuing_authority);
      data.append("issue_date", formData.issue_date);
      data.append("expiry_date", formData.expiry_date);
      data.append(
        "is_permanent",
        formData.is_permanent ? 1 : 0
      );
      data.append("description", formData.description);

      if (selectedFile) {
        data.append("document", selectedFile);
      }

      await updateDocument(id, data);

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/trust-documents");

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Unable to update document.",
      });

    } finally {

      setLoading(false);

    }
  };

  if (pageLoading) {
    return (
      <div className="py-24 text-center text-gray-500">
        Loading document...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Edit Trust Document
        </h1>

        <p className="text-slate-500 mt-1">
          Update document information.
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
        submitText="Update Document"
      />

    </div>
  );
}

export default EditTrustDocument;