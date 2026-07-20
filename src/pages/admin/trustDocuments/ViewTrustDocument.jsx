import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaEdit,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaHashtag,
  FaTag,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";

import {
  getDocument,
  downloadDocument,
  previewDocument,
} from "../../../api/trustDocumentApi";

function ViewTrustDocument() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Renamed from "document" to avoid conflict with browser document object
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    loadDocument();
  }, []);

  /* ==========================================================
      Load Document
  ========================================================== */

  const loadDocument = async () => {
    try {
      setLoading(true);

      const response = await getDocument(id);

      setDoc(response.data.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Document Not Found",
        text: "Unable to load the selected document.",
      });

      navigate("/admin/trust-documents");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
      Download
  ========================================================== */

const handleDownload = () => {
  alert("NEW DOWNLOAD FUNCTION");

  window.open(
    `http://localhost:5000/api/trust-documents/${id}/download`,
    "_blank"
  );
};

  /* ==========================================================
      Format Date
  ========================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
  };

  /* ==========================================================
      Format File Size
  ========================================================== */

  const formatFileSize = (bytes) => {
    if (!bytes) return "-";

    if (bytes < 1024) {
      return `${bytes} Bytes`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  /* ==========================================================
      File Icon
  ========================================================== */

  const getFileIcon = () => {
    const ext = doc?.file_extension?.toLowerCase();

    switch (ext) {
      case ".pdf":
        return (
          <FaFilePdf className="text-red-600 text-2xl" />
        );

      case ".doc":
      case ".docx":
        return (
          <FaFileWord className="text-blue-600 text-2xl" />
        );

      case ".xls":
      case ".xlsx":
        return (
          <FaFileExcel className="text-green-600 text-2xl" />
        );

      case ".jpg":
      case ".jpeg":
      case ".png":
        return (
          <FaFileImage className="text-pink-600 text-2xl" />
        );

      default:
        return (
          <FaFileAlt className="text-gray-600 text-2xl" />
        );
    }
  };

  /* ==========================================================
      Loading
  ========================================================== */

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500 text-lg">
        Loading document...
      </div>
    );
  }

  if (!doc) return null;

  /* ==========================================================
      PART 2 STARTS HERE
  ========================================================== */

  return (

        <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            View Trust Document
          </h1>

          <p className="text-slate-500 mt-1">
            Document details and file information.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/admin/trust-documents")}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl transition"
          >
            <FaArrowLeft />
            Back
          </button>

          <button
            onClick={() =>
              navigate(`/admin/trust-documents/${id}/edit`)
            }
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl transition"
          >
            <FaEdit />
            Edit
          </button>

          <button
            onClick={() =>
              window.open(
                previewDocument(id),
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            <FaEye />
            Preview
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
          >
            <FaDownload />
            Download
          </button>

        </div>

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-2xl shadow border p-8">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left */}

          <div>

            <div className="flex items-center gap-4 mb-8">

              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                {getFileIcon()}
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  {doc.document_name}
                </h2>

                <p className="text-gray-500">
                  {doc.document_code}
                </p>

              </div>

            </div>

            <div className="space-y-5">

              <Info
                icon={<FaTag />}
                label="Category"
                value={doc.category_name}
              />

              <Info
                icon={<FaHashtag />}
                label="Document Number"
                value={doc.document_number}
              />

              <Info
                icon={<FaBuilding />}
                label="Issuing Authority"
                value={doc.issuing_authority}
              />

              <Info
                icon={<FaCalendarAlt />}
                label="Issue Date"
                value={formatDate(doc.issue_date)}
              />

              <Info
                icon={<FaCalendarAlt />}
                label="Expiry Date"
                value={
                  doc.is_permanent
                    ? "Permanent"
                    : formatDate(doc.expiry_date)
                }
              />

            </div>

          </div>

          {/* Right */}

          <div className="space-y-5">

            <Info
              label="Version"
              value={`v${doc.version}`}
            />

            <div>

              <p className="text-sm text-gray-500 mb-2">
                Status
              </p>

              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  doc.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.status}
              </span>

            </div>

            <Info
              label="Original File"
              value={doc.original_file_name}
            />

            <Info
              label="Stored File"
              value={doc.stored_file_name}
            />

            <Info
              label="File Type"
              value={doc.file_extension}
            />

            <Info
              label="Mime Type"
              value={doc.mime_type}
            />

            <Info
              label="File Size"
              value={formatFileSize(doc.file_size)}
            />

            <Info
              label="Created On"
              value={formatDate(doc.created_at)}
            />

            <Info
              label="Last Updated"
              value={formatDate(doc.updated_at)}
            />

            <div>

              <p className="text-sm text-gray-500 mb-2">
                Description
              </p>

              <div className="border rounded-xl bg-gray-50 p-4 text-gray-700 min-h-[100px] whitespace-pre-wrap">
                {doc.description || "-"}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
  function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-100 pb-4">

      {icon && (
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">

        <p className="text-sm font-medium text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-slate-800 font-semibold break-words">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}


export default ViewTrustDocument;