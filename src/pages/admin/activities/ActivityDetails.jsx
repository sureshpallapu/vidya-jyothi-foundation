import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Users,
  AlertCircle,
  ClipboardCheck,
  ListTodo,
  History,
  Globe2,
  Flag,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ============================================================
   HELPERS
============================================================ */

function formatStatus(status = "") {
  return String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatActivityType(type = "") {
  return String(type)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";

  const parts = String(value).split(":");

  if (parts.length < 2) {
    return value;
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getStatusClass(status) {
  switch (status) {
    case "DRAFT":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "SCHEDULED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "REGISTRATION_OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "REGISTRATION_CLOSED":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ONGOING":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";

    case "POSTPONED":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "ARCHIVED":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION
============================================================ */

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={18} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

        <div className="h-56 animate-pulse rounded-3xl bg-white" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="h-[500px] animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

/* ============================================================
   ERROR
============================================================ */

function ErrorState({ message, onBack, onRetry }) {
  return (
    <div className="min-h-screen bg-[#f6f8fc] p-6">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to Load Activity
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {message || "Activity could not be loaded."}
          </p>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Back
              </span>
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={16} />
                Try Again
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ActivityDetails() {
  const { activityCode } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================
     FETCH ACTIVITY
  ========================================================== */

  const fetchActivity = useCallback(
    async (showLoader = true) => {
      if (!activityCode) {
        setError("Activity code is missing.");
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await fetch(
          `${API_BASE_URL}/activities/${encodeURIComponent(
            activityCode
          )}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Activity not found."
          );
        }

        const activityData =
          result.data?.activity ||
          result.data ||
          null;

        if (!activityData) {
          throw new Error("Activity not found.");
        }

        setActivity(activityData);
      } catch (err) {
        console.error("ACTIVITY DETAILS ERROR:", err);

        setActivity(null);

        setError(
          err.message || "Unable to load activity."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activityCode]
  );

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  /* ==========================================================
     LOCATION
  ========================================================== */

  const location = useMemo(() => {
    if (!activity) return "Location not specified";

    return [
      activity.venue_name,
      activity.address,
      activity.city,
      activity.district,
      activity.state,
    ]
      .filter(Boolean)
      .join(", ") || "Location not specified";
  }, [activity]);

  /* ==========================================================
     TIME
  ========================================================== */

  const activityTime = useMemo(() => {
    if (!activity) return "—";

    if (
      activity.is_all_day === true ||
      Number(activity.is_all_day) === 1
    ) {
      return "All Day";
    }

    const start = formatTime(activity.start_time);
    const end = formatTime(activity.end_time);

    if (start && end) {
      return `${start} – ${end}`;
    }

    return start || end || "Time not specified";
  }, [activity]);

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleBack = () => {
    navigate("/admin/activities");
  };

  const handleEdit = () => {
    if (!activityCode) return;

    navigate(
      `/admin/activities/${encodeURIComponent(
        activityCode
      )}/edit`
    );
  };

  const handleQuickAction = (action) => {
    const code =
      activity?.activity_code ||
      activityCode;

    if (!code) return;

    switch (action) {
      case "participants":
        navigate(
          `/admin/activities/${encodeURIComponent(
            code
          )}/participants`
        );
        break;

      case "attendance":
        navigate(
          `/admin/activities/${encodeURIComponent(
            code
          )}/attendance`
        );
        break;

      case "tasks":
        navigate(
          `/admin/activities/${encodeURIComponent(
            code
          )}/tasks`
        );
        break;

      case "timeline":
        navigate(
          `/admin/activities/${encodeURIComponent(
            code
          )}/timeline`
        );
        break;

      case "media":
        navigate(
          `/admin/activities/${encodeURIComponent(
            code
          )}/media`
        );
        break;

      default:
        break;
    }
  };

  /* ==========================================================
     STATES
  ========================================================== */

  if (loading) {
    return <LoadingState />;
  }

  if (error || !activity) {
    return (
      <ErrorState
        message={error}
        onBack={handleBack}
        onRetry={() => fetchActivity()}
      />
    );
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="mx-auto max-w-[1550px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-start gap-4">

              <button
                type="button"
                onClick={handleBack}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                title="Back to activities"
              >
                <ArrowLeft size={19} />
              </button>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                    Activity Details
                  </span>

                  <span className="text-xs text-slate-400">
                    /
                  </span>

                  <span className="font-mono text-xs text-slate-500">
                    {activity.activity_code}
                  </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {activity.title || "Untitled Activity"}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {activity.short_description ||
                    activity.description ||
                    "No description available."}
                </p>

              </div>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => fetchActivity(false)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

             <button
  type="button"
  onClick={() =>
    navigate(
      `/admin/activities/${encodeURIComponent(
        activityCode
      )}/edit`
    )
  }
>
  Edit Activity
</button>

            </div>

          </div>
        </div>

        {/* ======================================================
            STATUS HERO
        ====================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50 shadow-sm">

          <div className="p-6 sm:p-8">

            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Activity size={25} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Current Status
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
                        activity.status
                      )}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {formatStatus(activity.status)}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {formatActivityType(
                        activity.activity_type
                      )}
                    </span>

                    {activity.category && (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {activity.category}
                      </span>
                    )}

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <InfoCard
                  icon={CalendarDays}
                  label="Start Date"
                  value={formatDate(
                    activity.start_date
                  )}
                />

                <InfoCard
                  icon={Clock3}
                  label="Time"
                  value={activityTime}
                />

                <InfoCard
                  icon={Users}
                  label="Capacity"
                  value={
                    activity.max_participants
                      ? `${activity.max_participants} people`
                      : "Unlimited"
                  }
                />

                <InfoCard
                  icon={Flag}
                  label="Priority"
                  value={
                    formatStatus(
                      activity.priority ||
                        "NORMAL"
                    )
                  }
                />

              </div>

            </div>
          </div>
        </div>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">

            <Section
              icon={Activity}
              title="Activity Overview"
              description="Complete information about this foundation activity."
            >

              <div className="space-y-6">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Short Description
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {activity.short_description ||
                      "No short description provided."}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Full Description
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {activity.description ||
                      "No detailed description provided."}
                  </p>
                </div>

                {activity.objective && (
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Objective
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {activity.objective}
                    </p>
                  </div>
                )}

              </div>

            </Section>

            <Section
              icon={CalendarDays}
              title="Schedule & Location"
              description="When and where this activity takes place."
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <InfoCard
                  icon={CalendarDays}
                  label="Start Date"
                  value={formatDate(
                    activity.start_date
                  )}
                />

                <InfoCard
                  icon={CalendarDays}
                  label="End Date"
                  value={
                    activity.end_date
                      ? formatDate(
                          activity.end_date
                        )
                      : "Same day"
                  }
                />

                <InfoCard
                  icon={Clock3}
                  label="Activity Time"
                  value={activityTime}
                />

                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={location}
                />

              </div>

            </Section>

            <Section
              icon={Globe2}
              title="Publishing Information"
              description="How this activity is displayed and managed."
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <InfoCard
                  icon={Globe2}
                  label="Visibility"
                  value={
                    formatStatus(
                      activity.visibility ||
                        "PUBLIC"
                    )
                  }
                />

                <InfoCard
                  icon={Eye}
                  label="Featured"
                  value={
                    Number(activity.featured) === 1
                      ? "Featured Activity"
                      : "Not Featured"
                  }
                />

                <InfoCard
                  icon={CheckCircle2}
                  label="Created"
                  value={formatDateTime(
                    activity.created_at
                  )}
                />

                <InfoCard
                  icon={RefreshCw}
                  label="Last Updated"
                  value={formatDateTime(
                    activity.updated_at
                  )}
                />

              </div>

            </Section>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <Section
              icon={Users}
              title="Participation"
              description="Manage people involved in this activity."
            >

              <div className="space-y-3">

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      "participants"
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <span className="flex items-center gap-3">
                    <Users
                      size={18}
                      className="text-indigo-600"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Participants
                      </span>

                      <span className="block text-xs text-slate-500">
                        Manage registered participants
                      </span>
                    </span>
                  </span>

                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      "attendance"
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <span className="flex items-center gap-3">
                    <ClipboardCheck
                      size={18}
                      className="text-emerald-600"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Attendance
                      </span>

                      <span className="block text-xs text-slate-500">
                        Record and monitor attendance
                      </span>
                    </span>
                  </span>

                  <span>→</span>
                </button>

              </div>

            </Section>

            <Section
              icon={ListTodo}
              title="Activity Management"
              description="Operational tools for this activity."
            >

              <div className="space-y-3">

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction("tasks")
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                >
                  <ListTodo size={18} />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Tasks
                    </p>

                    <p className="text-xs text-slate-500">
                      Activity tasks and assignments
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      "timeline"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                >
                  <History size={18} />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Timeline
                    </p>

                    <p className="text-xs text-slate-500">
                      Activity history and changes
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction("media")
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                >
                  <ImageIcon size={18} />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Media
                    </p>

                    <p className="text-xs text-slate-500">
                      Photos, videos and documents
                    </p>
                  </div>
                </button>

              </div>

            </Section>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                  <Activity size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    Activity Code
                  </h3>

                  <p className="mt-1 break-all font-mono text-xs text-indigo-700">
                    {activity.activity_code}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}