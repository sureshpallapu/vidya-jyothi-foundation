import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFilePdf,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";

function BankRecordAccordion({ year, records = [] }) {
  const [open, setOpen] = useState(
    Number(year) === new Date().getFullYear()
  );

  /* =========================================================
     Helpers
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getMonthName = (record) => {
    const date =
      record.issueDate ||
      record.issue_date ||
      record.date ||
      record.created_at;

    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        month: "long",
      }
    );
  };

  const formatFileSize = (bytes) => {
    const size = Number(bytes);

    if (!size) {
      return "Size unavailable";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(
      size /
      (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
  };

  const getDocumentName = (record) => {
    return (
      record.document_name ||
      record.documentName ||
      record.title ||
      record.name ||
      record.original_file_name ||
      record.fileName ||
      "Bank Record"
    );
  };

  const getFileName = (record) => {
    return (
      record.original_file_name ||
      record.fileName ||
      "Bank_Record.pdf"
    );
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

      {/* =====================================================
          YEAR HEADER
      ===================================================== */}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="
          group
          relative
          flex
          w-full
          items-center
          justify-between
          overflow-hidden
          bg-gradient-to-r
          from-slate-950
          via-blue-950
          to-slate-900
          px-6
          py-6
          text-left
          text-white
          transition-all
          duration-300
          hover:from-slate-900
          hover:via-blue-900
          hover:to-slate-800
          md:px-8
        "
      >

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl transition duration-500 group-hover:bg-blue-400/20" />

        <div className="relative flex min-w-0 items-center gap-4">

          {/* Chevron */}

          <div className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-white/10
            text-yellow-300
            backdrop-blur
            transition-transform
            duration-300
          ">

            {open ? (
              <FaChevronDown />
            ) : (
              <FaChevronRight />
            )}

          </div>

          {/* Year */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                {year}
              </h2>

              <span className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-300/20
                bg-emerald-400/10
                px-2.5
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-emerald-300
              ">

                <FaShieldAlt />

                Public Records

              </span>

            </div>

            <p className="mt-1 text-sm text-slate-300">
              Verified financial documents
            </p>

          </div>

        </div>

        {/* Count */}

        <div className="
          relative
          ml-4
          flex
          shrink-0
          items-center
          gap-2
          rounded-2xl
          border
          border-yellow-300/10
          bg-yellow-400/10
          px-4
          py-2.5
        ">

          <FaFileAlt className="text-yellow-300" />

          <span className="text-sm font-bold text-yellow-200">
            {records.length}
          </span>

          <span className="hidden text-sm font-medium text-yellow-100/70 sm:inline">
            {records.length === 1
              ? "File"
              : "Files"}
          </span>

        </div>

      </button>

      {/* =====================================================
          BODY
      ===================================================== */}

      {open && (

        <div className="bg-gradient-to-b from-slate-50/80 to-white p-5 md:p-8">

          {/* Empty */}

          {records.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FaFileAlt className="text-xl" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-600">
                No bank records available for {year}.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {records.map((record, index) => {

                const documentName =
                  getDocumentName(record);

                const fileName =
                  getFileName(record);

                const month =
                  getMonthName(record);

                const issueDate =
                  record.issueDate ||
                  record.issue_date ||
                  record.date ||
                  record.created_at;

                const fileSize =
                  record.fileSize ||
                  record.file_size;

                const authority =
                  record.issuingAuthority ||
                  record.issuing_authority;

                const status =
                  record.status || "ACTIVE";

                return (
                  <div
                    key={
                      record.id ||
                      `${year}-${index}`
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-blue-200
                      hover:shadow-lg
                    "
                  >

                    <div className="p-5 md:p-6">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* =================================================
                            Document Information
                        ================================================= */}

                        <div className="flex min-w-0 items-start gap-4">

                          {/* PDF Icon */}

                          <div className="
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-50
                            text-red-600
                            ring-1
                            ring-red-100
                            transition
                            duration-300
                            group-hover:scale-105
                          ">

                            <FaFilePdf className="text-2xl" />

                          </div>

                          {/* Details */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3
                                className="
                                  truncate
                                  text-lg
                                  font-extrabold
                                  text-slate-900
                                  md:text-xl
                                "
                                title={documentName}
                              >
                                {documentName}
                              </h3>

                              {/* Status */}

                              {status === "ACTIVE" && (

                                <span className="
                                  inline-flex
                                  shrink-0
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  bg-emerald-50
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-emerald-700
                                ">

                                  <FaCheckCircle />

                                  Verified

                                </span>

                              )}

                            </div>

                            {/* Filename */}

                            <p
                              className="
                                mt-1
                                truncate
                                text-sm
                                text-slate-500
                              "
                              title={fileName}
                            >
                              {fileName}
                            </p>

                            {/* Metadata */}

                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                              {month && (

                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                  <FaCalendarAlt className="text-blue-500" />

                                  <span>
                                    {month}
                                    {issueDate
                                      ? ` • ${formatDate(
                                          issueDate
                                        )}`
                                      : ""}
                                  </span>

                                </div>

                              )}

                              {fileSize && (

                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                  <FaFilePdf className="text-red-400" />

                                  <span>
                                    PDF •{" "}
                                    {formatFileSize(
                                      fileSize
                                    )}
                                  </span>

                                </div>

                              )}

                              {record.version && (

                                <div className="flex items-center gap-2 text-xs text-slate-500">

                                  <FaClock className="text-indigo-500" />

                                  <span>
                                    Version{" "}
                                    {record.version}
                                  </span>

                                </div>

                              )}

                            </div>

                            {/* Issuing Authority */}

                            {authority && (

                              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">

                                <FaBuilding />

                                <span>
                                  Issuing Authority:
                                </span>

                                <span className="font-semibold text-slate-600">
                                  {authority}
                                </span>

                              </div>

                            )}

                          </div>

                        </div>

                        {/* =================================================
                            Actions
                        ================================================= */}

                        <div className="
                          flex
                          w-full
                          shrink-0
                          flex-col
                          gap-2
                          sm:flex-row
                          lg:w-auto
                        ">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              record.onView
                                ? record.onView()
                                : undefined
                            }
                            className="
                              inline-flex
                              flex-1
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-blue-200
                              bg-blue-50
                              px-5
                              py-3
                              text-sm
                              font-bold
                              text-blue-700
                              transition-all
                              duration-200
                              hover:border-blue-300
                              hover:bg-blue-100
                              active:scale-[0.98]
                              sm:flex-none
                            "
                          >

                            <FaEye />

                            View PDF

                          </button>

                          {/* Download */}

                          <button
                            type="button"
                            onClick={() =>
                              record.onDownload
                                ? record.onDownload()
                                : undefined
                            }
                            className="
                              inline-flex
                              flex-1
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-gradient-to-r
                              from-yellow-500
                              to-amber-500
                              px-5
                              py-3
                              text-sm
                              font-bold
                              text-slate-950
                              shadow-sm
                              transition-all
                              duration-200
                              hover:from-yellow-400
                              hover:to-amber-400
                              hover:shadow-md
                              active:scale-[0.98]
                              sm:flex-none
                            "
                          >

                            <FaDownload />

                            Download

                          </button>

                        </div>

                      </div>

                    </div>

                    {/* Bottom accent */}

                    <div className="
                      h-1
                      w-full
                      bg-gradient-to-r
                      from-blue-600
                      via-indigo-500
                      to-yellow-400
                      opacity-0
                      transition
                      duration-300
                      group-hover:opacity-100
                    " />

                  </div>
                );
              })}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default BankRecordAccordion;