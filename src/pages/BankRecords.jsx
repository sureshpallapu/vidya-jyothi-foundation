import { useEffect, useMemo, useState } from "react";
import {
  FaUniversity,
  FaFilePdf,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";
import Swal from "sweetalert2";

import BankRecordAccordion from "../components/bank/BankRecordAccordion";
import {
  getPublicBankRecords,
  downloadDocument,
  previewDocument,
} from "../api/trustDocumentApi";

function BankRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     Load Real-Time Bank Records
  ========================================================= */

  const loadBankRecords = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getPublicBankRecords();

      if (response.data?.success) {
        setRecords(response.data.data || []);
      } else {
        setRecords([]);
        setError(
          response.data?.message ||
            "Unable to load bank records."
        );
      }
    } catch (err) {
      console.error(
        "Failed to load bank records:",
        err
      );

      setRecords([]);

      setError(
        err.response?.data?.message ||
          "Unable to connect to the financial records service."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBankRecords();
  }, []);

  /* =========================================================
     Helpers
  ========================================================= */

  const getRecordDate = (record) => {
    return (
      record.issue_date ||
      record.created_at ||
      record.updated_at ||
      null
    );
  };

  const getYear = (record) => {
    const date = getRecordDate(record);

    if (!date) {
      return "Other";
    }

    const year = new Date(date).getFullYear();

    return Number.isNaN(year)
      ? "Other"
      : year;
  };

  const getMonth = (record) => {
    const date = getRecordDate(record);

    if (!date) {
      return "Other";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Other";
    }

    return parsedDate.toLocaleString("en-IN", {
      month: "long",
    });
  };

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

  /* =========================================================
     Group API Data By Year
  ========================================================= */

  const groupedRecords = useMemo(() => {
    const groups = {};

    records.forEach((record) => {
      const year = getYear(record);

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(record);
    });

    return groups;
  }, [records]);

  const sortedYears = useMemo(() => {
    return Object.keys(groupedRecords).sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [groupedRecords]);

  /* =========================================================
     Convert API Data To Existing Accordion Structure
  ========================================================= */

  const accordionData = useMemo(() => {
    return sortedYears.map((year) => {
      const yearRecords =
        groupedRecords[year] || [];

      const sortedRecords = [...yearRecords].sort(
        (a, b) => {
          const dateA = new Date(
            getRecordDate(a) || 0
          ).getTime();

          const dateB = new Date(
            getRecordDate(b) || 0
          ).getTime();

          return dateB - dateA;
        }
      );

      return {
        year,
        records: sortedRecords,
      };
    });
  }, [sortedYears, groupedRecords]);

  /* =========================================================
     Statistics
  ========================================================= */

  const totalRecords = records.length;

  const totalYears = sortedYears.length;

  const latestRecord = useMemo(() => {
    if (!records.length) {
      return null;
    }

    return [...records].sort((a, b) => {
      const dateA = new Date(
        getRecordDate(a) || 0
      ).getTime();

      const dateB = new Date(
        getRecordDate(b) || 0
      ).getTime();

      return dateB - dateA;
    })[0];
  }, [records]);

  /* =========================================================
     View PDF
  ========================================================= */

  const handleView = (record) => {
    if (!record?.id) {
      return;
    }

    const previewUrl =
      previewDocument(record.id);

    window.open(
      previewUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     Download PDF
  ========================================================= */

  const handleDownload = async (record) => {
    if (!record?.id) {
      return;
    }

    try {
      Swal.fire({
        title: "Preparing document...",
        text: "Please wait while the PDF is downloaded.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response =
        await downloadDocument(record.id);

      const blob = new Blob(
        [response.data],
        {
          type:
            response.headers?.["content-type"] ||
            "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        record.original_file_name ||
        `${record.document_name || "bank-record"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      Swal.close();
    } catch (err) {
      console.error(
        "Bank record download failed:",
        err
      );

      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text:
          err.response?.data?.message ||
          "Unable to download this PDF.",
      });
    }
  };

  /* =========================================================
     Convert Existing Accordion Records
     
     We preserve the existing BankRecordAccordion
     instead of replacing it.
  ========================================================= */

  const getAccordionRecord = (record) => {
    return {
      ...record,

      id: record.id,

      title:
        record.document_name ||
        record.original_file_name ||
        "Bank Record",

      name:
        record.document_name ||
        "Bank Record",

      documentName:
        record.document_name ||
        "Bank Record",

      fileName:
        record.original_file_name ||
        "Document.pdf",

      documentNumber:
        record.document_number || "",

      issuingAuthority:
        record.issuing_authority || "",

      issueDate:
        record.issue_date ||
        record.created_at ||
        null,

      date:
        record.issue_date ||
        record.created_at ||
        null,

      description:
        record.description || "",

      fileSize:
        record.file_size || 0,

      version:
        record.version || 1,

      status:
        record.status || "ACTIVE",

      category:
        record.category_name || "Banking",

      onView: () =>
        handleView(record),

      onDownload: () =>
        handleDownload(record),
    };
  };

  /* =========================================================
     Loading
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        {/* Hero Skeleton */}

        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 py-24 text-white">
          <div className="mx-auto max-w-6xl px-6 text-center">

            <div className="mx-auto h-9 w-64 animate-pulse rounded-full bg-white/10" />

            <div className="mx-auto mt-8 h-14 w-80 animate-pulse rounded-xl bg-white/10" />

            <div className="mx-auto mt-8 h-5 max-w-2xl animate-pulse rounded bg-white/10" />

            <div className="mx-auto mt-3 h-5 max-w-xl animate-pulse rounded bg-white/10" />

          </div>
        </section>

        {/* Content Skeleton */}

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">

            <div className="grid gap-4 md:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}

            </div>

            <div className="mt-10 space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}

            </div>

          </div>
        </section>
      </div>
    );
  }

  /* =========================================================
     Error
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">

        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 py-24 text-white">

          <div className="mx-auto max-w-6xl px-6 text-center">

            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-yellow-500 px-5 py-2 font-semibold text-slate-900">
              <FaUniversity />
              Financial Transparency
            </div>

            <h1 className="mt-8 text-5xl font-extrabold lg:text-6xl">
              Bank Records
            </h1>

          </div>

        </section>

        <section className="px-6 py-20">

          <div className="mx-auto max-w-2xl">

            <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <FaExclamationTriangle className="text-2xl" />
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
                Unable to load bank records
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => loadBankRecords(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                <FaSyncAlt
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Try Again
              </button>

            </div>

          </div>

        </section>

      </div>
    );
  }

  /* =========================================================
     Main UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          Hero
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-24 text-white">

        {/* Background decorations */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-400 px-5 py-2 font-bold text-slate-900 shadow-lg shadow-yellow-500/10">
            <FaUniversity />
            Financial Transparency
          </div>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight lg:text-6xl">
            Bank Records
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            We are committed to transparency,
            accountability, and responsible financial
            management. Verified financial documents
            are published here for public reference.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur">
              <FaShieldAlt className="text-emerald-400" />
              Publicly Available
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur">
              <FaFilePdf className="text-red-400" />
              PDF Documents
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur">
              <FaCheckCircle className="text-emerald-400" />
              Verified Records
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          Intro
      ===================================================== */}

      <section className="px-6 py-14">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-7 md:p-9">

            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-xl text-white shadow-lg shadow-blue-700/20">
                <FaShieldAlt />
              </div>

              <div className="flex-1">

                <h2 className="text-xl font-extrabold text-slate-900">
                  Transparent financial records
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
                  These documents are published from the
                  Foundation's verified Trust Documents
                  system. Records are made available for
                  public reference after approval.
                </p>

              </div>

              <button
                type="button"
                onClick={() => loadBankRecords(true)}
                disabled={refreshing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Records"}
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          Statistics
      ===================================================== */}

      {records.length > 0 && (
        <section className="px-6 pb-12">

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">

            {/* Total Records */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Published Records
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {totalRecords}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <FaFileAlt />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Active Banking documents
              </p>

            </div>

            {/* Years */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Years Covered
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {totalYears}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <FaCalendarAlt />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Financial records available
              </p>

            </div>

            {/* Latest */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Latest Record
                  </p>

                  <p
                    className="mt-2 truncate text-lg font-extrabold text-slate-900"
                    title={
                      latestRecord?.document_name ||
                      ""
                    }
                  >
                    {latestRecord?.document_name ||
                      "Not available"}
                  </p>

                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <FaClock />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                {formatDate(
                  getRecordDate(latestRecord)
                )}
              </p>

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          Empty State
      ===================================================== */}

      {records.length === 0 && (
        <section className="px-6 pb-24">

          <div className="mx-auto max-w-3xl">

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                <FaUniversity className="text-3xl" />
              </div>

              <h2 className="mt-7 text-2xl font-extrabold text-slate-900">
                No bank records available
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                The Foundation has not published any
                active Banking documents yet. Please
                check back later for verified financial
                records.
              </p>

              <button
                type="button"
                onClick={() => loadBankRecords(true)}
                disabled={refreshing}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:opacity-60"
              >
                <FaSyncAlt
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          Records
      ===================================================== */}

      {records.length > 0 && (
        <section className="pb-24">

          <div className="mx-auto max-w-6xl px-6">

            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Financial Archive
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 md:text-3xl">
                  Published Bank Documents
                </h2>

              </div>

              <p className="text-sm text-slate-400">
                {totalRecords}{" "}
                {totalRecords === 1
                  ? "record"
                  : "records"}{" "}
                available
              </p>

            </div>

            <div className="space-y-5">

              {accordionData.map((item) => {

                const normalizedRecords =
                  item.records.map(
                    getAccordionRecord
                  );

                return (
                  <div
                    key={item.year}
                    className="overflow-hidden rounded-3xl"
                  >

                    <BankRecordAccordion
                      year={item.year}
                      records={normalizedRecords}
                    />

                  </div>
                );
              })}

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          Footer Trust Message
      ===================================================== */}

      <section className="border-t border-slate-200 bg-white px-6 py-12">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FaCheckCircle />
          </div>

          <h3 className="mt-4 text-lg font-extrabold text-slate-900">
            Transparency & Accountability
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Vidya Jyothi Foundation is committed to
            responsible financial practices and transparent
            reporting. Published records are provided for
            public reference.
          </p>

        </div>

      </section>

    </div>
  );
}

export default BankRecords;