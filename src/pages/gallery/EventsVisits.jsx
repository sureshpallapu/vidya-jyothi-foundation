import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
  FaSearch,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaTimes,
  FaThumbtack,
  FaHeart,
  FaExclamationTriangle,
} from "react-icons/fa";

/*
|==============================================================================|
| EventsVisits — the public "noticeboard".                                    |
|                                                                              |
| Restyled to share the same visual language as the Volunteer page: a deep    |
| slate/blue gradient hero with a yellow accent, react-icons/fa iconography,  |
| and rounded-3xl white cards with a soft border that lifts on hover. Status  |
| is communicated with plain, functionally distinct color pills instead of a  |
| separate stamp motif, so the whole public site now reads as one system.     |
|==============================================================================|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ACTIVITY_TYPES = [
  "ALL",
  "EVENT",
  "PROGRAM",
  "CAMP",
  "DRIVE",
  "WORKSHOP",
  "MEETING",
  "AWARENESS",
  "DISTRIBUTION",
  "VOLUNTEER_ACTIVITY",
  "FUNDRAISING",
  "OTHER",
];

const STATUS_STYLES = {
  ONGOING: { badge: "border-purple-200 bg-purple-50 text-purple-700", dot: "bg-purple-500" },
  REGISTRATION_OPEN: { badge: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  SCHEDULED: { badge: "border-blue-200 bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  REGISTRATION_CLOSED: { badge: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  POSTPONED: { badge: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  CANCELLED: { badge: "border-red-200 bg-red-50 text-red-700", dot: "bg-red-500" },
  COMPLETED: { badge: "border-slate-200 bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

/* ---------------------------------------------------------------------------
   HELPERS
--------------------------------------------------------------------------- */
function formatActivityType(type = "") {
  return String(type)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Date not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";

  const parts = String(value).split(":");
  if (parts.length < 2) return value;

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getDateTime(activity) {
  if (!activity?.start_date) return null;

  const date = new Date(activity.start_date);
  if (Number.isNaN(date.getTime())) return null;

  if (activity.start_time) {
    const [hours, minutes] = String(activity.start_time).split(":").map(Number);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      date.setHours(hours, minutes, 0, 0);
    }
  }

  return date;
}

function getStatusLabel(status) {
  switch (status) {
    case "ONGOING":
      return "Happening Now";
    case "REGISTRATION_OPEN":
      return "Registration Open";
    case "SCHEDULED":
      return "Upcoming";
    case "REGISTRATION_CLOSED":
      return "Registration Closed";
    case "COMPLETED":
      return "Completed";
    case "POSTPONED":
      return "Postponed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return formatActivityType(status);
  }
}

/* ---------------------------------------------------------------------------
   SHARED VISUAL PRIMITIVES
--------------------------------------------------------------------------- */
function StatusPill({ status, size = "md" }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.COMPLETED;
  const compact = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${style.badge} ${
        compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {getStatusLabel(status)}
    </span>
  );
}

function FeaturedPin() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-extrabold text-slate-950 shadow-sm">
      <FaThumbtack size={11} />
      Featured
    </span>
  );
}

function ArrowLink({ children }) {
  return (
    <span className="group/link inline-flex items-center gap-2 text-sm font-bold text-blue-700">
      {children}
      <FaArrowRight size={13} className="transition group-hover/link:translate-x-1" />
    </span>
  );
}

/* ---------------------------------------------------------------------------
   DETAILS MODAL
--------------------------------------------------------------------------- */
function ActivityDetailsModal({ activity, onClose }) {
  if (!activity) return null;

  const location = [
    activity.venue_name,
    activity.address_line1,
    activity.address_line2,
    activity.city,
    activity.district,
    activity.state,
    activity.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition hover:text-slate-900"
        >
          <FaTimes size={17} />
        </button>

        {activity.cover_image ? (
          <div className="h-64 overflow-hidden sm:h-80">
            <img src={activity.cover_image} alt={activity.title} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 sm:h-80">
            <FaCalendarCheck className="text-yellow-400/80" size={64} />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusPill status={activity.status} />

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
              {formatActivityType(activity.activity_type)}
            </span>

            {Number(activity.featured) === 1 && <FeaturedPin />}
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
            {activity.activity_code}
          </p>

          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            {activity.title}
          </h2>

          {activity.short_description && (
            <p className="mt-4 text-base leading-7 text-slate-600">{activity.short_description}</p>
          )}

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <FaCalendarAlt size={16} />
                <span className="text-xs font-bold uppercase tracking-wide">Date</span>
              </div>
              <p className="font-semibold text-slate-800">{formatDate(activity.start_date)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <FaClock size={16} />
                <span className="text-xs font-bold uppercase tracking-wide">Time</span>
              </div>
              <p className="font-semibold text-slate-800">
                {activity.is_all_day
                  ? "All Day"
                  : `${formatTime(activity.start_time)}${activity.end_time ? ` – ${formatTime(activity.end_time)}` : ""}`}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <FaMapMarkerAlt size={16} />
                <span className="text-xs font-bold uppercase tracking-wide">Venue</span>
              </div>
              <p className="font-semibold leading-6 text-slate-800">
                {location || "Location will be announced"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <FaUsers size={16} />
                <span className="text-xs font-bold uppercase tracking-wide">Capacity</span>
              </div>
              <p className="font-semibold text-slate-800">
                {activity.max_participants ? `${activity.max_participants} participants` : "Open participation"}
              </p>
            </div>
          </div>

          {activity.description && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900">About this activity</h3>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {activity.description}
              </p>
            </div>
          )}

          {activity.objective && (
            <div className="mt-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <h3 className="font-bold text-yellow-700">Objective</h3>
              <p className="mt-2 text-sm leading-6 text-yellow-900">{activity.objective}</p>
            </div>
          )}

          {activity.online_event && activity.meeting_url && (
            <div className="mt-7">
              <a
                href={activity.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-400"
              >
                Join Online Event
                <FaExternalLinkAlt size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ACTIVITY CARD
--------------------------------------------------------------------------- */
function ActivityCard({ activity, onView }) {
  const location = [activity.venue_name, activity.city, activity.district].filter(Boolean).join(", ");

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-yellow-300 hover:shadow-2xl">
      <div className="relative h-52 overflow-hidden">
        {activity.cover_image ? (
          <img
            src={activity.cover_image}
            alt={activity.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
            <FaCalendarCheck className="text-yellow-400/80" size={52} />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <StatusPill status={activity.status} size="sm" />
          {Number(activity.featured) === 1 && <FeaturedPin />}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-600">
            {formatActivityType(activity.activity_type)}
          </span>
          {activity.category && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-400">{activity.category}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-slate-900">
          {activity.title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
          {activity.short_description || activity.description || "Join us for this activity organized by Vidya Jyothi Foundation."}
        </p>

        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <FaCalendarAlt size={14} className="mt-1 shrink-0 text-blue-600" />
            <span className="font-medium">{formatDate(activity.start_date)}</span>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-600">
            <FaClock size={14} className="mt-1 shrink-0 text-blue-600" />
            <span className="font-medium">
              {activity.is_all_day
                ? "All Day"
                : `${formatTime(activity.start_time)}${activity.end_time ? ` – ${formatTime(activity.end_time)}` : ""}`}
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-600">
            <FaMapMarkerAlt size={14} className="mt-1 shrink-0 text-emerald-600" />
            <span className="line-clamp-2 font-medium">{location || "Location will be announced"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(activity)}
          className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 text-left"
        >
          <ArrowLink>View activity details</ArrowLink>
        </button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------------------- */
export default function EventsVisits() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const loadActivities = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "100");

      /*
       * We intentionally request public activities.
       * The backend should return only activities where:
       *   public_display = 1
       *   visibility = PUBLIC
       * and exclude DRAFT / ARCHIVED / CANCELLED as appropriate.
       */
      params.set("public_display", "1");
      params.set("visibility", "PUBLIC");

      const response = await fetch(`${API_BASE_URL}/activities?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Unable to load activities. Server returned ${response.status}.`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(result?.message || "Unable to load activities.");
      }

      const rows = Array.isArray(result.data) ? result.data : [];

      /*
       * Safety filtering on the frontend as well, so a private activity is
       * never shown even if the backend ever returns more than it should.
       */
      const publicActivities = rows.filter(
        (activity) => Number(activity.public_display) === 1 && activity.visibility === "PUBLIC"
      );

      setActivities(publicActivities);
    } catch (err) {
      console.error("PUBLIC ACTIVITIES ERROR:", err);
      setError(err?.message || "Unable to load events and activities right now.");
      setActivities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return activities
      .filter((activity) => {
        if (typeFilter !== "ALL" && activity.activity_type !== typeFilter) return false;
        if (!normalizedSearch) return true;

        const searchableText = [
          activity.title,
          activity.activity_code,
          activity.category,
          activity.description,
          activity.short_description,
          activity.city,
          activity.district,
          activity.venue_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (Number(b.featured) !== Number(a.featured)) {
          return Number(b.featured) - Number(a.featured);
        }
        const dateA = getDateTime(a)?.getTime() || 0;
        const dateB = getDateTime(b)?.getTime() || 0;
        return dateA - dateB;
      });
  }, [activities, search, typeFilter]);

  const featuredActivity = useMemo(
    () => activities.find((activity) => Number(activity.featured) === 1),
    [activities]
  );

  const stats = useMemo(() => {
    const now = Date.now();
    const upcoming = activities.filter((activity) => {
      const dateTime = getDateTime(activity);
      return dateTime && dateTime.getTime() >= now && activity.status !== "CANCELLED";
    }).length;
    const ongoing = activities.filter((activity) => activity.status === "ONGOING").length;

    return [
      { label: "Public Activities", value: activities.length },
      { label: "Upcoming", value: upcoming },
      { label: "Happening Now", value: ongoing },
    ];
  }, [activities]);

  return (
    <div className="bg-slate-50">
      {/* ================================================================
          HERO
      ================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-sm font-bold text-yellow-300">
            <FaCalendarCheck />
            EVENTS &amp; ACTIVITIES
          </span>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight lg:text-6xl">
            Together, We Create Meaningful Change
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 lg:text-xl">
            Every program, camp and awareness drive Vidya Jyothi Foundation runs in Guntur is
            recorded here as it happens — see what's open for registration, what's underway,
            and what's ahead.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300"
              >
                <span className="text-base font-extrabold text-yellow-400">{stat.value}</span>
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          MAIN
      ================================================================= */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        {/* CONTROLS */}
        <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FaSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, programs, locations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 p-1">
                {ACTIVITY_TYPES.map((type) => {
                  const active = typeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                        active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {type === "ALL" ? "All" : formatActivityType(type)}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => loadActivities(true)}
                disabled={refreshing}
                title="Refresh activities"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
              >
                <FaSyncAlt size={14} className={refreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED */}
        {!loading && !search && typeFilter === "ALL" && featuredActivity && (
          <section className="mb-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[300px]">
                {featuredActivity.cover_image ? (
                  <img
                    src={featuredActivity.cover_image}
                    alt={featuredActivity.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                    <FaCalendarCheck className="text-yellow-400/80" size={64} />
                  </div>
                )}
                <div className="absolute left-5 top-5">
                  <FeaturedPin />
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
                  {formatActivityType(featuredActivity.activity_type)} · {featuredActivity.activity_code}
                </p>

                <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                  {featuredActivity.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                  {featuredActivity.short_description || featuredActivity.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <FaCalendarAlt size={14} className="text-blue-600" />
                  {formatDate(featuredActivity.start_date)}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedActivity(featuredActivity)}
                  className="group mt-7 inline-flex w-fit items-center gap-3 rounded-2xl bg-yellow-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-yellow-200 transition-all hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-xl"
                >
                  Explore Activity
                  <FaArrowRight className="transition group-hover:translate-x-1" size={13} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-52 animate-pulse bg-slate-100" />
                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />
                  <div className="h-16 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FaExclamationTriangle size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-red-800">Unable to load activities</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => loadActivities()}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Try Again
              <FaSyncAlt size={13} />
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredActivities.length === 0 && (
          <div className="rounded-3xl border border-dashed border-yellow-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
              <FaCalendarAlt size={24} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">No activities found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no public activities matching your search or selected category.
            </p>
            {(search || typeFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* GRID */}
        {!loading && !error && filteredActivities.length > 0 && (
          <>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">
                  Our Activities
                </span>
                <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Upcoming Events &amp; Programs</h2>
              </div>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:inline-flex">
                {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onView={setSelectedActivity} />
              ))}
            </div>
          </>
        )}

        {/* STAY CONNECTED */}
        {!loading && !error && activities.length > 0 && (
          <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950">
            <div className="flex flex-col gap-6 p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                  <FaHeart size={12} />
                  Stay Connected
                </span>
                <h2 className="mt-3 text-2xl font-extrabold">Be Part of Our Next Initiative</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Follow our activities and community programs to discover opportunities to
                  participate, volunteer and contribute.
                </p>
              </div>

              <a
                href="/volunteer"
                className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-yellow-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-400"
              >
                Become a Volunteer
                <FaArrowRight className="transition group-hover:translate-x-1" size={13} />
              </a>
            </div>
          </section>
        )}
      </main>

      {selectedActivity && (
        <ActivityDetailsModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}