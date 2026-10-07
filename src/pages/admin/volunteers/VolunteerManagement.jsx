import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaBan,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaUserShield,
  FaUserClock,
  FaUserSlash,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhone,
  FaCopy,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTimes,
  FaEllipsisV,
  FaExternalLinkAlt,
  FaIdCard,
  FaCheck,
  FaCircle,
} from "react-icons/fa";

/* =========================================================================
   CONFIGURATION
========================================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const VOLUNTEER_API = `${API_BASE_URL}/volunteers`;

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: FaClock,
    badge:
      "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },

  APPROVED: {
    label: "Approved",
    icon: FaCheckCircle,
    badge:
      "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },

  ACTIVE: {
    label: "Active",
    icon: FaUserCheck,
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },

  INACTIVE: {
    label: "Inactive",
    icon: FaUserSlash,
    badge:
      "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-500",
  },

  SUSPENDED: {
    label: "Suspended",
    icon: FaBan,
    badge:
      "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },

  REJECTED: {
    label: "Rejected",
    icon: FaTimesCircle,
    badge:
      "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

/* =========================================================================
   HELPERS
========================================================================= */

const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin")) || {};
  } catch {
    return {};
  }
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const maskEmail = (email) => {
  if (!email) return "Not available";

  if (
    email.includes("*") ||
    email.startsWith("v****") ||
    email.startsWith("m****")
  ) {
    return email;
  }

  const [name, domain] = email.split("@");

  if (!name || !domain) return "••••••";

  if (name.length <= 2) {
    return `${name[0] || "*"}***@${domain}`;
  }

  return `${name[0]}${"*".repeat(
    Math.min(Math.max(name.length - 2, 3), 10)
  )}${name[name.length - 1]}@${domain}`;
};

const maskMobile = (mobile) => {
  if (!mobile) return "Not available";

  if (mobile.includes("*")) {
    return mobile;
  }

  const value = String(mobile);

  if (value.length <= 4) {
    return "******";
  }

  return `${"*".repeat(
    Math.max(value.length - 4, 6)
  )}${value.slice(-4)}`;
};

const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return "Not available";

  const value = String(aadhaar).replace(/\s/g, "");

  if (value.includes("X")) {
    return value;
  }

  if (value.length < 4) {
    return "XXXX XXXX XXXX";
  }

  return `XXXX XXXX ${value.slice(-4)}`;
};

const isComplete = (volunteer) =>
  Number(volunteer?.profile_completion_percent || 0) >= 100;

const canShowFullContact = (volunteer) =>
  volunteer?.status === "ACTIVE" &&
  isComplete(volunteer) &&
  Boolean(volunteer?.email) &&
  Boolean(volunteer?.mobile);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCompletionLabel = (percent) => {
  const value = Number(percent || 0);

  if (value >= 100) return "Complete";
  if (value >= 80) return "Almost Complete";
  if (value >= 50) return "In Progress";
  return "Incomplete";
};

const getCompletionClasses = (percent) => {
  const value = Number(percent || 0);

  if (value >= 100) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      background: "bg-emerald-50",
    };
  }

  if (value >= 80) {
    return {
      bar: "bg-blue-500",
      text: "text-blue-700",
      background: "bg-blue-50",
    };
  }

  if (value >= 50) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-700",
      background: "bg-amber-50",
    };
  }

  return {
    bar: "bg-red-500",
    text: "text-red-700",
    background: "bg-red-50",
  };
};

const copyText = async (value, label) => {
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${label} copied`,
      showConfirmButton: false,
      timer: 1800,
    });
  } catch {
    Swal.fire({
      icon: "error",
      title: "Copy failed",
      text: `Unable to copy ${label.toLowerCase()}.`,
    });
  }
};

/* =========================================================================
   STATUS BADGE
========================================================================= */

function StatusBadge({ status }) {
  const normalized = String(status || "PENDING").toUpperCase();

  const config =
    STATUS_CONFIG[normalized] ||
    STATUS_CONFIG.PENDING;

  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5
        rounded-full
        border
        text-xs
        font-bold
        uppercase
        tracking-wide
        ${config.badge}
      `}
    >
      <Icon className="text-[11px]" />
      {config.label}
    </span>
  );
}

/* =========================================================================
   COMPLETION BAR
========================================================================= */

function CompletionBar({ value }) {
  const percent = Math.min(
    Math.max(Number(value || 0), 0),
    100
  );

  const classes = getCompletionClasses(percent);

  return (
    <div className="min-w-[150px]">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-bold ${classes.text}`}
        >
          {getCompletionLabel(percent)}
        </span>

        <span
          className={`text-xs font-bold ${classes.text}`}
        >
          {percent}%
        </span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${classes.bar}`}
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================================
   STAT CARD
========================================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left
        w-full
        bg-white
        rounded-2xl
        border
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        ${
          active
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-slate-200"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-black text-slate-900 mt-1">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`
            w-12 h-12 rounded-xl
            flex items-center justify-center
            ${iconClass}
          `}
        >
          <Icon className="text-lg" />
        </div>
      </div>
    </button>
  );
}

/* =========================================================================
   VOLUNTEER MANAGEMENT
========================================================================= */

export default function VolunteerManagement() {
  const admin = getAdmin();

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [interestFilter, setInterestFilter] =
    useState("ALL");

  const [completionFilter, setCompletionFilter] =
    useState("ALL");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedVolunteer, setSelectedVolunteer] =
    useState(null);

  const [showFilters, setShowFilters] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  /* =======================================================================
     FETCH
  ======================================================================= */

  const fetchVolunteers = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (statusFilter !== "ALL") {
          params.append(
            "status",
            statusFilter
          );
        }

        const response = await fetch(
          `${VOLUNTEER_API}/admin?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to fetch volunteers."
          );
        }

        const payload = result.data || {};

        setVolunteers(
          Array.isArray(payload.data)
            ? payload.data
            : []
        );

        setTotal(
          Number(payload.pagination?.total || 0)
        );

        setTotalPages(
          Number(
            payload.pagination?.totalPages || 1
          )
        );
      } catch (error) {
        console.error(
          "Volunteer list error:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Unable to load volunteers",
          text:
            error.message ||
            "Something went wrong while loading volunteers.",
          confirmButtonColor: "#143D6B",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, statusFilter]
  );

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  /* =======================================================================
     FILTER OPTIONS
  ======================================================================= */

  const volunteerTypes = useMemo(() => {
    return [
      ...new Set(
        volunteers
          .map((item) => item.volunteer_type)
          .filter(Boolean)
      ),
    ];
  }, [volunteers]);

  const interests = useMemo(() => {
    return [
      ...new Set(
        volunteers
          .map((item) => item.area_of_interest)
          .filter(Boolean)
      ),
    ];
  }, [volunteers]);

  /* =======================================================================
     LOCAL FILTER
  ======================================================================= */

  const filteredVolunteers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return volunteers.filter((volunteer) => {
      const matchesSearch =
        !query ||
        String(
          volunteer.full_name || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          volunteer.volunteer_code || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          volunteer.city || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          volunteer.area_of_interest || ""
        )
          .toLowerCase()
          .includes(query);

      const matchesType =
        typeFilter === "ALL" ||
        volunteer.volunteer_type ===
          typeFilter;

      const matchesInterest =
        interestFilter === "ALL" ||
        volunteer.area_of_interest ===
          interestFilter;

      const percent = Number(
        volunteer.profile_completion_percent || 0
      );

      const matchesCompletion =
        completionFilter === "ALL" ||
        (completionFilter === "COMPLETE" &&
          percent >= 100) ||
        (completionFilter === "INCOMPLETE" &&
          percent < 100);

      return (
        matchesSearch &&
        matchesType &&
        matchesInterest &&
        matchesCompletion
      );
    });
  }, [
    volunteers,
    search,
    typeFilter,
    interestFilter,
    completionFilter,
  ]);

  /* =======================================================================
     STATISTICS
  ======================================================================= */

  const stats = useMemo(() => {
    const count = (status) =>
      volunteers.filter(
        (item) =>
          String(item.status).toUpperCase() ===
          status
      ).length;

    const complete = volunteers.filter(
      (item) =>
        Number(
          item.profile_completion_percent || 0
        ) >= 100
    ).length;

    return {
      total,
      pending: count("PENDING"),
      approved: count("APPROVED"),
      active: count("ACTIVE"),
      inactive: count("INACTIVE"),
      suspended: count("SUSPENDED"),
      rejected: count("REJECTED"),
      complete,
    };
  }, [volunteers, total]);

  /* =======================================================================
     ACTION
  ======================================================================= */

  const performAction = async (
    volunteer,
    action
  ) => {
    const code = volunteer.volunteer_code;

    const actionMap = {
      approve: {
        endpoint: `/admin/${code}/approve`,
        method: "PUT",
        title: "Approve Volunteer",
        message:
          "Approve this volunteer application?",
        success:
          "Volunteer approved successfully.",
      },

      reject: {
        endpoint: `/admin/${code}/reject`,
        method: "PUT",
        title: "Reject Volunteer",
        message:
          "Reject this volunteer application?",
        success:
          "Volunteer rejected successfully.",
      },

      activate: {
        endpoint: `/admin/${code}/activate`,
        method: "PUT",
        title: "Activate Volunteer",
        message:
          "Activate this volunteer?",
        success:
          "Volunteer activated successfully.",
      },

      deactivate: {
        endpoint: `/admin/${code}/deactivate`,
        method: "PUT",
        title: "Deactivate Volunteer",
        message:
          "Deactivate this volunteer?",
        success:
          "Volunteer deactivated successfully.",
      },

      suspend: {
        endpoint: `/admin/${code}/suspend`,
        method: "PUT",
        title: "Suspend Volunteer",
        message:
          "Suspend this volunteer?",
        success:
          "Volunteer suspended successfully.",
      },
    };

    const config = actionMap[action];

    if (!config) return;

    const confirmation =
      await Swal.fire({
        title: config.title,
        text: config.message,
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#143D6B",
      });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setActionLoading(
        `${action}-${code}`
      );

      const response = await fetch(
        `${VOLUNTEER_API}${config.endpoint}`,
        {
          method: config.method,
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to ${action} volunteer.`
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: config.success,
        confirmButtonColor: "#143D6B",
      });

      setSelectedVolunteer(null);

      await fetchVolunteers(true);
    } catch (error) {
      console.error(
        `Volunteer ${action} error:`,
        error
      );

      Swal.fire({
        icon: "error",
        title: "Action failed",
        text:
          error.message ||
          `Unable to ${action} volunteer.`,
        confirmButtonColor: "#143D6B",
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* =======================================================================
     CONTACT
  ======================================================================= */

  const renderContact = (volunteer) => {
    const full =
      canShowFullContact(volunteer);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FaEnvelope />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400">
              Email
            </p>

            <p className="font-semibold text-slate-800 truncate">
              {full
                ? volunteer.email
                : maskEmail(
                    volunteer.email
                  )}
            </p>
          </div>

          {full && (
            <button
              type="button"
              onClick={() =>
                copyText(
                  volunteer.email,
                  "Email"
                )
              }
              className="p-2 rounded-lg hover:bg-slate-100"
              title="Copy email"
            >
              <FaCopy />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FaPhone />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400">
              Mobile
            </p>

            <p className="font-semibold text-slate-800">
              {full
                ? volunteer.mobile
                : maskMobile(
                    volunteer.mobile
                  )}
            </p>
          </div>

          {full && (
            <button
              type="button"
              onClick={() =>
                copyText(
                  volunteer.mobile,
                  "Mobile number"
                )
              }
              className="p-2 rounded-lg hover:bg-slate-100"
              title="Copy mobile"
            >
              <FaCopy />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FaIdCard />
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Aadhaar
            </p>

            <p className="font-semibold text-slate-800">
              {maskAadhaar(
                volunteer.aadhaar
              )}
            </p>
          </div>
        </div>

        {!full && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700 font-medium">
              Contact information is protected.
              Full email and mobile are available
              only for an ACTIVE volunteer with a
              100% completed profile.
            </p>
          </div>
        )}

        {full && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <FaCheckCircle />
              <span className="text-xs font-bold">
                Authorized active-volunteer
                contact information
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* =======================================================================
     QUICK ACTIONS
  ======================================================================= */

  const renderQuickActions = (
    volunteer
  ) => {
    const status = String(
      volunteer.status || "PENDING"
    ).toUpperCase();

    const complete =
      isComplete(volunteer);

    const actionButton = (
      action,
      label,
      Icon,
      classes
    ) => {
      const key = `${action}-${volunteer.volunteer_code}`;

      return (
        <button
          key={action}
          type="button"
          disabled={
            actionLoading === key
          }
          onClick={() =>
            performAction(
              volunteer,
              action
            )
          }
          className={`
            inline-flex items-center gap-2
            px-3 py-2
            rounded-lg
            text-xs
            font-bold
            transition
            disabled:opacity-50
            ${classes}
          `}
        >
          <Icon />
          {actionLoading === key
            ? "Processing..."
            : label}
        </button>
      );
    };

    if (status === "PENDING") {
      if (!complete) {
        return (
          <NavLink
            to={`/admin/volunteers/${volunteer.volunteer_code}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            <FaEye />
            Review Profile
          </NavLink>
        );
      }

      return (
        <div className="flex flex-wrap gap-2">
          {actionButton(
            "approve",
            "Approve",
            FaCheckCircle,
            "bg-emerald-600 text-white hover:bg-emerald-700"
          )}

          {actionButton(
            "reject",
            "Reject",
            FaTimesCircle,
            "bg-red-50 text-red-700 hover:bg-red-100"
          )}
        </div>
      );
    }

    if (status === "APPROVED") {
      return actionButton(
        "activate",
        "Activate",
        FaPlay,
        "bg-emerald-600 text-white hover:bg-emerald-700"
      );
    }

    if (status === "ACTIVE") {
      return (
        <div className="flex flex-wrap gap-2">
          {actionButton(
            "suspend",
            "Suspend",
            FaBan,
            "bg-orange-50 text-orange-700 hover:bg-orange-100"
          )}

          {actionButton(
            "deactivate",
            "Deactivate",
            FaPause,
            "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        </div>
      );
    }

    if (status === "INACTIVE") {
      return actionButton(
        "activate",
        "Activate",
        FaPlay,
        "bg-emerald-600 text-white hover:bg-emerald-700"
      );
    }

    if (status === "SUSPENDED") {
      return actionButton(
        "deactivate",
        "Deactivate",
        FaPause,
        "bg-slate-100 text-slate-700 hover:bg-slate-200"
      );
    }

    return null;
  };

  /* =======================================================================
     RENDER
  ======================================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">

        {/* ===============================================================
            HEADER
        =============================================================== */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-[#143D6B] text-white flex items-center justify-center shadow-lg">
                <FaUsers />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  Volunteer Management
                </h1>

                <p className="text-sm text-slate-500">
                  Review, approve and manage
                  volunteers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                fetchVolunteers(true)
              }
              disabled={refreshing}
              className="
                inline-flex items-center gap-2
                px-4 py-3
                bg-white
                border border-slate-200
                rounded-xl
                text-sm font-bold
                text-slate-700
                shadow-sm
                hover:bg-slate-50
                disabled:opacity-50
              "
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

        {/* ===============================================================
            STATISTICS
        =============================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-7">
          <StatCard
            title="Total"
            value={stats.total}
            subtitle="All volunteers"
            icon={FaUsers}
            iconClass="bg-blue-50 text-blue-600"
            active={
              statusFilter === "ALL"
            }
            onClick={() => {
              setStatusFilter("ALL");
              setPage(1);
            }}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Needs review"
            icon={FaClock}
            iconClass="bg-amber-50 text-amber-600"
            active={
              statusFilter === "PENDING"
            }
            onClick={() => {
              setStatusFilter("PENDING");
              setPage(1);
            }}
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            subtitle="Ready to activate"
            icon={FaCheckCircle}
            iconClass="bg-blue-50 text-blue-600"
            active={
              statusFilter === "APPROVED"
            }
            onClick={() => {
              setStatusFilter("APPROVED");
              setPage(1);
            }}
          />

          <StatCard
            title="Active"
            value={stats.active}
            subtitle="Currently active"
            icon={FaUserCheck}
            iconClass="bg-emerald-50 text-emerald-600"
            active={
              statusFilter === "ACTIVE"
            }
            onClick={() => {
              setStatusFilter("ACTIVE");
              setPage(1);
            }}
          />

          <StatCard
            title="Inactive"
            value={stats.inactive}
            subtitle="Can be activated"
            icon={FaUserSlash}
            iconClass="bg-slate-100 text-slate-600"
            active={
              statusFilter === "INACTIVE"
            }
            onClick={() => {
              setStatusFilter("INACTIVE");
              setPage(1);
            }}
          />

          <StatCard
            title="Suspended"
            value={stats.suspended}
            subtitle="Needs attention"
            icon={FaBan}
            iconClass="bg-orange-50 text-orange-600"
            active={
              statusFilter === "SUSPENDED"
            }
            onClick={() => {
              setStatusFilter("SUSPENDED");
              setPage(1);
            }}
          />

          <StatCard
            title="Complete"
            value={stats.complete}
            subtitle="100% profiles"
            icon={FaUserShield}
            iconClass="bg-purple-50 text-purple-600"
            onClick={() =>
              setCompletionFilter(
                "COMPLETE"
              )
            }
          />
        </div>

        {/* ===============================================================
            NEEDS ATTENTION
        =============================================================== */}

        {(stats.pending > 0 ||
          stats.suspended > 0) && (
          <div className="bg-gradient-to-r from-[#143D6B] to-[#1d528d] rounded-2xl p-5 text-white mb-7 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaExclamationTriangle className="text-yellow-300" />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    Needs Attention
                  </h2>

                  <p className="text-blue-100 text-sm">
                    {stats.pending} pending review
                    {stats.pending !== 1
                      ? "s"
                      : ""}

                    {stats.suspended > 0 &&
                      ` • ${stats.suspended} suspended`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter(
                    stats.pending > 0
                      ? "PENDING"
                      : "SUSPENDED"
                  );
                  setPage(1);
                }}
                className="px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-900 text-sm font-bold hover:bg-yellow-300"
              >
                Review Now
              </button>
            </div>
          </div>
        )}

        {/* ===============================================================
            SEARCH / FILTERS
        =============================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 mb-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                  setPage(1);
                }}
                placeholder="Search by name, volunteer ID, city or interest..."
                className="
                  w-full
                  pl-11 pr-4
                  py-3
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  text-sm
                "
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              className={`
                inline-flex items-center justify-center gap-2
                px-5 py-3
                rounded-xl
                border
                text-sm
                font-bold
                ${
                  showFilters
                    ? "bg-[#143D6B] text-white border-[#143D6B]"
                    : "bg-white text-slate-700 border-slate-200"
                }
              `}
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* STATUS TABS */}

          <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
            {[
              "ALL",
              "PENDING",
              "APPROVED",
              "ACTIVE",
              "INACTIVE",
              "SUSPENDED",
              "REJECTED",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(
                    status
                  );
                  setPage(1);
                }}
                className={`
                  whitespace-nowrap
                  px-4 py-2
                  rounded-full
                  text-xs
                  font-bold
                  border
                  transition
                  ${
                    statusFilter === status
                      ? "bg-[#143D6B] text-white border-[#143D6B]"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                {status === "ALL"
                  ? "All"
                  : statusConfigLabel(
                      status
                    )}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
              <FilterSelect
                label="Volunteer Type"
                value={typeFilter}
                onChange={(value) => {
                  setTypeFilter(value);
                  setPage(1);
                }}
                options={volunteerTypes}
              />

              <FilterSelect
                label="Area of Interest"
                value={interestFilter}
                onChange={(value) => {
                  setInterestFilter(
                    value
                  );
                  setPage(1);
                }}
                options={interests}
              />

              <FilterSelect
                label="Profile Completion"
                value={completionFilter}
                onChange={(value) => {
                  setCompletionFilter(
                    value
                  );
                  setPage(1);
                }}
                options={[
                  {
                    value: "COMPLETE",
                    label: "100% Complete",
                  },
                  {
                    value: "INCOMPLETE",
                    label: "Below 100%",
                  },
                ]}
              />

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setInterestFilter("ALL");
                  setCompletionFilter(
                    "ALL"
                  );
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                className="md:col-span-3 justify-self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200"
              >
                <FaTimes />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ===============================================================
            TABLE
        =============================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Volunteers
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Showing{" "}
                {filteredVolunteers.length}{" "}
                of {total}
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Page {page} of{" "}
              {Math.max(totalPages, 1)}
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredVolunteers.length ===
            0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Volunteer
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Profile
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredVolunteers.map(
                    (volunteer) => {
                      const fullContact =
                        canShowFullContact(
                          volunteer
                        );

                      return (
                        <tr
                          key={
                            volunteer.id ||
                            volunteer.volunteer_code
                          }
                          className="hover:bg-slate-50/80 transition"
                        >
                          {/* VOLUNTEER */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#143D6B] to-blue-500 text-white flex items-center justify-center font-black">
                                {String(
                                  volunteer.full_name ||
                                    "V"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {
                                    volunteer.full_name
                                  }
                                </p>

                                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                                  {
                                    volunteer.volunteer_code
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {volunteer.volunteer_type ||
                                    "REGULAR"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}

                          <td className="px-5 py-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <FaEnvelope className="text-slate-400 text-xs" />

                                <span
                                  className={
                                    fullContact
                                      ? "font-semibold text-slate-800"
                                      : "text-slate-500"
                                  }
                                >
                                  {fullContact
                                    ? volunteer.email
                                    : maskEmail(
                                        volunteer.email
                                      )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm">
                                <FaPhone className="text-slate-400 text-xs" />

                                <span
                                  className={
                                    fullContact
                                      ? "font-semibold text-slate-800"
                                      : "text-slate-500"
                                  }
                                >
                                  {fullContact
                                    ? volunteer.mobile
                                    : maskMobile(
                                        volunteer.mobile
                                      )}
                                </span>
                              </div>

                              {fullContact && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                                  <FaCheckCircle />
                                  CONTACT AVAILABLE
                                </span>
                              )}
                            </div>
                          </td>

                          {/* PROFILE */}

                          <td className="px-5 py-5">
                            <CompletionBar
                              value={
                                volunteer.profile_completion_percent
                              }
                            />
                          </td>

                          {/* LOCATION */}

                          <td className="px-5 py-5">
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="text-slate-400 mt-1 text-xs" />

                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  {volunteer.city ||
                                    "—"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {volunteer.district ||
                                    ""}

                                  {volunteer.state
                                    ? `, ${volunteer.state}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">
                            <StatusBadge
                              status={
                                volunteer.status
                              }
                            />
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-5">
                            <div className="flex flex-wrap items-center gap-2">
                              <NavLink
                                to={`/admin/volunteers/${volunteer.volunteer_code}`}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#143D6B] text-white text-xs font-bold hover:bg-[#0e2e53]"
                              >
                                <FaEye />
                                View
                              </NavLink>

                              {renderQuickActions(
                                volunteer
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* =============================================================
              PAGINATION
          ============================================================= */}

          {!loading &&
            filteredVolunteers.length >
              0 && (
              <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Page {page} of{" "}
                  {Math.max(
                    totalPages,
                    1
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.max(
                            value - 1,
                            1
                          )
                      )
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                  >
                    <FaChevronLeft />
                  </button>

                  <span className="px-3 text-sm font-bold text-slate-700">
                    {page}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.min(
                            value + 1,
                            totalPages
                          )
                      )
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ===============================================================
          DETAIL DRAWER
      =============================================================== */}

      {selectedVolunteer && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close"
            onClick={() =>
              setSelectedVolunteer(null)
            }
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Volunteer Details
                  </p>

                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {
                      selectedVolunteer.full_name
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedVolunteer(
                      null
                    )
                  }
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#143D6B] to-blue-600 text-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-blue-100 text-xs">
                      Volunteer ID
                    </p>

                    <p className="font-bold mt-1">
                      {
                        selectedVolunteer.volunteer_code
                      }
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      selectedVolunteer.status
                    }
                  />
                </div>

                <div className="mt-5">
                  <CompletionBar
                    value={
                      selectedVolunteer.profile_completion_percent
                    }
                  />
                </div>
              </div>

              {/* CONTACT */}

              <section>
                <h3 className="font-bold text-slate-900 mb-3">
                  Contact Information
                </h3>

                {renderContact(
                  selectedVolunteer
                )}
              </section>

              {/* LOCATION */}

              <section>
                <h3 className="font-bold text-slate-900 mb-3">
                  Location
                </h3>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-blue-600 mt-1" />

                    <div>
                      <p className="font-semibold text-slate-800">
                        {
                          selectedVolunteer.city
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          selectedVolunteer.district
                        }
                        {selectedVolunteer.state
                          ? `, ${selectedVolunteer.state}`
                          : ""}
                      </p>

                      {selectedVolunteer.pincode && (
                        <p className="text-xs text-slate-400 mt-1">
                          {
                            selectedVolunteer.pincode
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* PROFESSIONAL */}

              <section>
                <h3 className="font-bold text-slate-900 mb-3">
                  Volunteer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoBox
                    icon={FaGraduationCap}
                    label="Qualification"
                    value={
                      selectedVolunteer.highest_qualification
                    }
                  />

                  <InfoBox
                    icon={FaBriefcase}
                    label="Profession"
                    value={
                      selectedVolunteer.profession
                    }
                  />

                  <InfoBox
                    icon={FaCalendarAlt}
                    label="Joined"
                    value={formatDate(
                      selectedVolunteer.created_at
                    )}
                  />

                  <InfoBox
                    icon={FaSyncAlt}
                    label="Last Updated"
                    value={formatDateTime(
                      selectedVolunteer.updated_at
                    )}
                  />
                </div>
              </section>

              {/* ACTIONS */}

              <section>
                <h3 className="font-bold text-slate-900 mb-3">
                  Quick Actions
                </h3>

                <div className="flex flex-wrap gap-2">
                  {renderQuickActions(
                    selectedVolunteer
                  )}
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   FILTER SELECT
========================================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-500 mb-2">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          px-4 py-3
          rounded-xl
          border border-slate-200
          bg-white
          text-sm
          font-medium
          outline-none
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      >
        <option value="ALL">
          All
        </option>

        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;

          return (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

/* =========================================================================
   INFO BOX
========================================================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <Icon className="text-sm" />

        <span className="text-xs font-semibold">
          {label}
        </span>
      </div>

      <p className="font-semibold text-slate-800 text-sm">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* =========================================================================
   STATUS LABEL
========================================================================= */

function statusConfigLabel(status) {
  return (
    STATUS_CONFIG[status]?.label ||
    status
  );
}

/* =========================================================================
   LOADING
========================================================================= */

function LoadingState() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl bg-slate-100 animate-pulse"
          />
        )
      )}
    </div>
  );
}

/* =========================================================================
   EMPTY
========================================================================= */

function EmptyState() {
  return (
    <div className="py-20 px-6 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <FaUsers className="text-2xl" />
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        No volunteers found
      </h3>

      <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
        No volunteers match the current
        search and filter criteria.
      </p>
    </div>
  );
}