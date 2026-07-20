import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaPlus,
  FaSyncAlt,
  FaSearch,
  FaEye,
  FaEdit,
  FaArchive,
  FaUndo,
  FaDownload,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaInfinity,
} from "react-icons/fa";

import {
  getDocuments,
  archiveDocument,
  downloadDocument,
  previewDocument,
} from "../../../api/trustDocumentApi";

function TrustDocuments() {
  const navigate = useNavigate();

  /* ==========================================================
      State
  ========================================================== */

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  /* ==========================================================
      Load Documents
  ========================================================== */

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const response =
        await getDocuments();

      setDocuments(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Documents",
        text:
          error.response?.data?.message ||
          "Failed to load documents.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  /* ==========================================================
      Helpers
  ========================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "-";

    if (bytes < 1024)
      return `${bytes} B`;

    if (bytes < 1024 * 1024)
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`;
  };

  const getFileIcon = (extension) => {
    switch (
      (extension || "").toLowerCase()
    ) {
      case "pdf":
        return {
          Icon: FaFilePdf,
          color: "text-red-500",
        };

      case "jpg":
      case "jpeg":
      case "png":
      case "webp":
        return {
          Icon: FaFileImage,
          color: "text-blue-500",
        };

      case "doc":
      case "docx":
        return {
          Icon: FaFileWord,
          color: "text-blue-700",
        };

      default:
        return {
          Icon: FaFileAlt,
          color: "text-gray-500",
        };
    }
  };

  const getEffectiveStatus = (
    document
  ) => {
    if (
      document.status ===
      "ARCHIVED"
    ) {
      return "ARCHIVED";
    }

    if (
      !document.is_permanent &&
      document.expiry_date
    ) {
      const expired =
        new Date(
          document.expiry_date
        ) < new Date();

      if (expired) {
        return "EXPIRED";
      }
    }

    return "ACTIVE";
  };

  const STATUS_CLASSES = {
    ACTIVE:
      "bg-green-100 text-green-700",

    ARCHIVED:
      "bg-gray-200 text-gray-700",

    EXPIRED:
      "bg-red-100 text-red-700",
  };

  /* ==========================================================
      Statistics
  ========================================================== */

  const statistics = useMemo(() => {
    const today = new Date();

    return {
      total: documents.length,

      active: documents.filter(
        (doc) =>
          getEffectiveStatus(doc) ===
          "ACTIVE"
      ).length,

      archived:
        documents.filter(
          (doc) =>
            doc.status ===
            "ARCHIVED"
        ).length,

      expiringSoon:
        documents.filter((doc) => {
          if (
            doc.is_permanent ||
            !doc.expiry_date
          )
            return false;

          const diff =
            (new Date(
              doc.expiry_date
            ) -
              today) /
            86400000;

          return (
            diff >= 0 &&
            diff <= 30
          );
        }).length,
    };
  }, [documents]);

  /* ==========================================================
      Categories
  ========================================================== */

  const categories = useMemo(() => {
    return [
      ...new Set(
        documents
          .map(
            (d) =>
              d.category_name
          )
          .filter(Boolean)
      ),
    ];
  }, [documents]);

  /* ==========================================================
      Filter Documents
  ========================================================== */

  const filteredDocuments =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return documents.filter(
        (doc) => {
          const matchesSearch =
            !keyword ||
            doc.document_name
              ?.toLowerCase()
              .includes(keyword) ||
            doc.document_code
              ?.toLowerCase()
              .includes(keyword) ||
            doc.category_name
              ?.toLowerCase()
              .includes(keyword);

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            doc.category_name ===
              categoryFilter;

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (statusFilter ===
              "ACTIVE" &&
              getEffectiveStatus(
                doc
              ) ===
                "ACTIVE") ||
            (statusFilter ===
              "ARCHIVED" &&
              doc.status ===
                "ARCHIVED");

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        }
      );
    }, [
      documents,
      search,
      categoryFilter,
      statusFilter,
    ]);

  /* ==========================================================
      Preview
  ========================================================== */

  const handlePreview = (
    document
  ) => {
    window.open(
      previewDocument(document.id),
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==========================================================
      Download
  ========================================================== */

  const handleDownload = async (doc) => {
  try {
    setActionLoading(`download-${doc.id}`);

    const response = await downloadDocument(doc.id);

    const url = window.URL.createObjectURL(response.data);

    const link = window.document.createElement("a");

    link.href = url;
    link.download = doc.original_file_name || "document.pdf";

    window.document.body.appendChild(link);

    link.click();

    window.document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Download Failed",
      text: error.message,
    });
  } finally {
    setActionLoading(null);
  }
};

  /* ==========================================================
      Archive / Restore
  ========================================================== */

  const handleArchive =
    async (document) => {
      const restoring =
        document.status ===
        "ARCHIVED";

      const result =
        await Swal.fire({
          icon: "question",

          title: restoring
            ? "Restore Document?"
            : "Archive Document?",

          text: restoring
            ? "This document will become active again."
            : "This document will be archived.",

          showCancelButton: true,

          confirmButtonText:
            restoring
              ? "Restore"
              : "Archive",

          confirmButtonColor:
            restoring
              ? "#16a34a"
              : "#dc2626",
        });

      if (!result.isConfirmed)
        return;

      try {
        setActionLoading(
          document.id
        );

        await archiveDocument(
          document.id
        );

        await loadDocuments();

        Swal.fire({
          icon: "success",

          title: restoring
            ? "Restored"
            : "Archived",

          timer: 1500,

          showConfirmButton:
            false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",

          title:
            "Operation Failed",

          text:
            error.response?.data
              ?.message ||
            "Unable to update document.",
        });
      } finally {
        setActionLoading(null);
      }
    };

  /* ==========================================================
      PART 2 STARTS HERE
  ========================================================== */
    return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* ==========================================================
          Header
      ========================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Trust Documents
          </h1>

          <p className="text-slate-500 mt-1">
            Manage trust deeds, registrations, certificates and statutory
            documents.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={loadDocuments}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            onClick={() =>
              navigate("/admin/trust-documents/add")
            }
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition"
          >
            <FaPlus />
            Upload Document
          </button>

        </div>

      </div>

      {/* ==========================================================
          Statistics Cards
      ========================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Total */}

        <div className="bg-white rounded-2xl border shadow-sm p-5">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-slate-500">
                Total Documents
              </p>

              <h2 className="text-3xl font-bold mt-2 text-slate-800">
                {statistics.total}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">

              <FaFileAlt />

            </div>

          </div>

        </div>

        {/* Active */}

        <div className="bg-green-50 border border-green-200 rounded-2xl shadow-sm p-5">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-green-700">
                Active
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-700">
                {statistics.active}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">

              <FaCheckCircle />

            </div>

          </div>

        </div>

        {/* Expiring */}

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-sm p-5">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-yellow-700">
                Expiring Soon
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-700">
                {statistics.expiringSoon}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">

              <FaClock />

            </div>

          </div>

        </div>

        {/* Archived */}

        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-5">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-red-700">
                Archived
              </p>

              <h2 className="text-3xl font-bold mt-2 text-red-700">
                {statistics.archived}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">

              <FaArchive />

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================================
          Search & Filters
      ========================================================== */}

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <div className="grid lg:grid-cols-[1fr_240px_220px] gap-4">

          {/* Search */}

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              placeholder="Search document name, code or category..."
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="ALL">
              All Categories
            </option>

            {categories.map((category) => (

              <option
                key={category}
                value={category}
              >
                {category}
              </option>

            ))}

          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="ARCHIVED">
              Archived
            </option>

          </select>

        </div>

      </div>

      {/* ==========================================================
          Part 2B Starts Here
      ========================================================== */}

            {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border shadow-sm p-5 animate-pulse"
            >
              <div className="h-12 w-12 rounded-xl bg-gray-200 mb-4"></div>

              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (

        /* ==========================================================
            Empty State
        ========================================================== */

        <div className="bg-white border rounded-2xl p-16 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-4xl mb-5">

            <FaFolderOpen />

          </div>

          <h2 className="text-xl font-semibold text-slate-700">
            No Documents Found
          </h2>

          <p className="text-slate-500 mt-2">
            Try changing your search criteria or upload a new document.
          </p>

        </div>

      ) : (

        /* ==========================================================
            Document Cards
        ========================================================== */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredDocuments.map((doc) => {

            const { Icon, color } =
              getFileIcon(doc.file_extension);

            const effectiveStatus =
              getEffectiveStatus(doc);

            const isArchived =
              doc.status === "ARCHIVED";

            return (

              <div
                key={doc.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
              >

                {/* ================= Header ================= */}

                <div className="p-5">

                  <div className="flex justify-between items-start gap-4">

                    <div className="flex gap-3 min-w-0">

                      <div
                        className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl ${color}`}
                      >
                        <Icon />
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-semibold text-slate-800 truncate">
                          {doc.document_name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {doc.document_code}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASSES[effectiveStatus]}`}
                    >
                      {effectiveStatus}
                    </span>

                  </div>

                  {/* ================= Details ================= */}

                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Category
                      </span>

                      <span className="font-medium text-slate-700">
                        {doc.category_name || "-"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Issued
                      </span>

                      <span className="font-medium text-slate-700">
                        {formatDate(doc.issue_date)}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Expiry
                      </span>

                      <span className="font-medium text-slate-700 flex items-center gap-1">

                        {doc.is_permanent ? (
                          <>
                            <FaInfinity className="text-xs" />
                            Permanent
                          </>
                        ) : (
                          formatDate(doc.expiry_date)
                        )}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Version
                      </span>

                      <span className="font-medium text-slate-700">
                        v{doc.version || 1}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        File Size
                      </span>

                      <span className="font-medium text-slate-700">
                        {formatFileSize(doc.file_size)}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ================= Footer ================= */}

                <div className="border-t bg-gray-50 px-5 py-3 flex justify-end gap-2">

                  {/* Preview */}

                  <button
                    onClick={() => handlePreview(doc)}
                    title="Preview"
                    className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
                  >
                    <FaEye />
                  </button>

                  {/* Download */}

                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={
                      actionLoading ===
                      `download-${doc.id}`
                    }
                    title="Download"
                    className="w-10 h-10 rounded-lg bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white flex items-center justify-center transition"
                  >
                    <FaDownload />
                  </button>

                  {/* Edit */}

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/trust-documents/${doc.id}/edit`
                      )
                    }
                    title="Edit"
                    className="w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition"
                  >
                    <FaEdit />
                  </button>

                  {/* Archive / Restore */}

                  <button
                    onClick={() =>
                      handleArchive(doc)
                    }
                    disabled={
                      actionLoading === doc.id
                    }
                    title={
                      isArchived
                        ? "Restore"
                        : "Archive"
                    }
                    className={`w-10 h-10 rounded-lg text-white flex items-center justify-center transition disabled:opacity-50 ${
                      isArchived
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isArchived ? (
                      <FaUndo />
                    ) : (
                      <FaArchive />
                    )}
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}

export default TrustDocuments;