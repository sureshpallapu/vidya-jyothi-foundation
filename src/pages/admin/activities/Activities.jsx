import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Edit3,
    Eye,
    Filter,
    History,
    Image as ImageIcon,
    ListTodo,
    MapPin,
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    UserPlus,
    Users,
    X,
    ClipboardCheck,
    XCircle,
    Inbox,
} from "lucide-react";

/* ==========================================================================
   API
============================================================================ */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ==========================================================================
   CONSTANTS
============================================================================ */
const ACTIVITY_TYPES = [
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

const STATUS_OPTIONS = [
    "DRAFT",
    "SCHEDULED",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
    "POSTPONED",
    "ARCHIVED",
];

/*
|--------------------------------------------------------------------------
| Design tokens — same ledger/registry system used across the admin app:
| warm paper, ink navy, and teal / gold / blue / brick / purple as
| status accents.
|--------------------------------------------------------------------------
*/
const INK = "#1D2333";
const PAPER = "#FAF7F0";
const LINE = "#E4DFD2";
const MUTED = "#9A927C";

const STATUS_TOKENS = {
    DRAFT: { label: "Draft", fg: "#6B6250", bg: "#F3EFE4", ring: "#DCD3BE" },
    SCHEDULED: { label: "Scheduled", fg: "#1D5C8A", bg: "#EAF3FA", ring: "#B9D8EC" },
    REGISTRATION_OPEN: { label: "Registration Open", fg: "#0E6E55", bg: "#E9F5F0", ring: "#A9D9C7" },
    REGISTRATION_CLOSED: { label: "Registration Closed", fg: "#8A5A12", bg: "#FBF3E1", ring: "#E9CE96" },
    ONGOING: { label: "Ongoing", fg: "#146C43", bg: "#E3F6EC", ring: "#9FE0BE" },
    COMPLETED: { label: "Completed", fg: "#5B6270", bg: "#EEEFF1", ring: "#D3D6DC" },
    CANCELLED: { label: "Cancelled", fg: "#A23B2E", bg: "#FBEDE9", ring: "#E9BCB0" },
    POSTPONED: { label: "Postponed", fg: "#8A4B12", bg: "#FBF0E1", ring: "#E9CBA0" },
    ARCHIVED: { label: "Archived", fg: "#6B3FA0", bg: "#F1EAF9", ring: "#D9C4EC" },
};

const TYPE_ACCENTS = [
    "#1D2333",
    "#0E6E55",
    "#1D5C8A",
    "#8A5A12",
    "#6B3FA0",
    "#A23B2E",
];

function accentForType(type = "") {
    let hash = 0;
    for (let i = 0; i < type.length; i += 1) {
        hash = (hash + type.charCodeAt(i) * (i + 1)) % TYPE_ACCENTS.length;
    }
    return TYPE_ACCENTS[hash];
}

/* ==========================================================================
   HELPERS
============================================================================ */
function formatStatus(status = "") {
    if (!status) return "Unknown";
    return String(status)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatActivityType(type = "") {
    if (!type) return "Activity";
    return String(type)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateValue) {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return String(dateValue);
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    }).format(date);
}

function formatDateParts(dateValue) {
    if (!dateValue) return { day: "--", month: "—" };
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return { day: "--", month: "—" };
    return {
        day: new Intl.DateTimeFormat("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" }).format(date),
        month: new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).format(date),
    };
}

function formatTime(timeValue) {
    if (!timeValue) return "";
    const parts = String(timeValue).split(":");
    if (parts.length < 2) return String(timeValue);
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return String(timeValue);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
}

/* ==========================================================================
   STAT CARD
============================================================================ */
function StatCard({ title, value, icon: Icon, accent }) {
    return (
        <div className="bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${accent}14`, color: accent }}>
                <Icon size={17} />
            </div>
            <div className="text-2xl font-semibold" style={{ color: INK, fontFamily: "Georgia, 'Source Serif 4', serif" }}>{value}</div>
            <div className="mt-1 text-xs" style={{ color: MUTED }}>{title}</div>
        </div>
    );
}

/* ==========================================================================
   QUICK ACTION MENU
============================================================================ */
function ActivityQuickMenu({ activity, onAction }) {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { label: "View Activity", icon: Eye, action: "view" },
        { label: "Edit Activity", icon: Edit3, action: "edit" },
        { label: "Participants", icon: UserPlus, action: "participants" },
        { label: "Attendance", icon: ClipboardCheck, action: "attendance" },
        { label: "Tasks", icon: ListTodo, action: "tasks" },
        { label: "Timeline", icon: History, action: "timeline" },
        { label: "Media", icon: ImageIcon, action: "media" },
    ];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                title="More actions"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-[#FAF7F0]"
                style={{ borderColor: LINE, color: "#5B6270" }}
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-10 cursor-default"
                    />
                    <div
                        className="menu-in absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border bg-white shadow-lg"
                        style={{ borderColor: LINE }}
                    >
                        <div className="border-b px-3 py-2" style={{ borderColor: LINE, background: "#FAF7F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>Quick Actions</p>
                            <p className="ledger-mono text-[11px] font-semibold" style={{ color: INK }}>{activity.activity_code || "ACTIVITY"}</p>
                        </div>
                        {menuItems.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                                <button
                                    key={item.action}
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        onAction(item.action, activity);
                                    }}
                                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition hover:bg-[#FAF7F0]"
                                    style={{ color: "#3F4451" }}
                                >
                                    <ItemIcon size={15} style={{ color: MUTED }} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

/* ==========================================================================
   ACTIVITY CARD
============================================================================ */
function ActivityCard({ activity, onAction }) {
    const location = [activity.venue_name, activity.city, activity.district].filter(Boolean).join(", ");
    const isAllDay = Number(activity.is_all_day) === 1 || activity.is_all_day === true;
    const tokens = STATUS_TOKENS[activity.status] || STATUS_TOKENS.DRAFT;
    const typeAccent = accentForType(activity.activity_type);
    const dateParts = formatDateParts(activity.start_date);
    const isOngoing = activity.status === "ONGOING";

    return (
        <article className="relative flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:shadow-[0_12px_30px_rgba(29,35,51,0.08)]" style={{ borderColor: LINE }}>
            <div className="h-1.5 w-full" style={{ background: tokens.fg }} />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3">
                    {/* ticket-stub date block */}
                    <div className="flex w-14 shrink-0 flex-col items-center overflow-hidden rounded-lg border" style={{ borderColor: LINE }}>
                        <div className="w-full py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white" style={{ background: typeAccent }}>
                            {dateParts.month}
                        </div>
                        <div className="w-full py-1.5 text-center text-lg font-bold" style={{ color: INK, background: "#FAF7F0" }}>
                            {dateParts.day}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="ledger-mono text-[11px] font-semibold" style={{ color: MUTED }}>{activity.activity_code || "ACTIVITY"}</p>
                        <h3 className="mt-0.5 truncate text-base font-bold" style={{ color: INK }}>
                            {activity.title || "Untitled Activity"}
                        </h3>
                    </div>

                    <ActivityQuickMenu activity={activity} onAction={onAction} />
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span
                        className="stamp inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase"
                        style={{ color: tokens.fg, background: tokens.bg, borderColor: tokens.ring }}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full bg-current ${isOngoing ? "pulse-dot" : ""}`} />
                        {formatStatus(activity.status)}
                    </span>

                    <span className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase" style={{ color: typeAccent, background: `${typeAccent}14` }}>
                        {formatActivityType(activity.activity_type)}
                    </span>

                    {activity.priority === "HIGH" && (
                        <span className="stamp inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase" style={{ color: "#8A5A12", background: "#FBF3E1", borderColor: "#E9CE96" }}>
                            High Priority
                        </span>
                    )}

                    {activity.priority === "URGENT" && (
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white" style={{ background: "#A23B2E" }}>
                            Urgent
                        </span>
                    )}

                    {Number(activity.featured) === 1 && (
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white" style={{ background: "linear-gradient(90deg,#8A5A12,#D9A441)" }}>
                            Featured
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-sm leading-5" style={{ color: "#5B6270" }}>
                    {activity.short_description || activity.description || "No description available for this activity."}
                </p>

                {/* Information */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4" style={{ borderColor: LINE }}>
                    <InfoRow icon={<CalendarDays size={15} />} label="Date" value={formatDate(activity.start_date)} />
                    <InfoRow
                        icon={<Clock3 size={15} />}
                        label="Time"
                        value={
                            isAllDay
                                ? "All Day"
                                : `${formatTime(activity.start_time) || "—"}${activity.end_time ? ` – ${formatTime(activity.end_time)}` : ""}`
                        }
                    />
                    <InfoRow icon={<MapPin size={15} />} label="Location" value={location || "Not specified"} />
                    <InfoRow icon={<Users size={15} />} label="Capacity" value={activity.max_participants ? `${activity.max_participants} people` : "Unlimited"} />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex gap-2 border-t p-4" style={{ borderColor: LINE, background: "#FAF7F0" }}>
                <button
                    type="button"
onClick={() => navigate(`/admin/activities/${activity.id}`)}                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#F3EFE4]"
                    style={{ borderColor: LINE, color: "#3F4451" }}
                >
                    <Eye size={14} />
                    View
                </button>
                <button
                    type="button"
                    onClick={() => onAction("edit", activity)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ background: INK }}
                >
                    <Edit3 size={14} />
                    Manage
                </button>
            </div>
        </article>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2">
            <span className="mt-0.5" style={{ color: MUTED }}>{icon}</span>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{label}</p>
                <p className="truncate text-xs font-semibold" style={{ color: "#3F4451" }}>{value}</p>
            </div>
        </div>
    );
}

/* ==========================================================================
   MAIN COMPONENT
============================================================================ */
export default function Activities() {
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 12;

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const [refreshing, setRefreshing] = useState(false);

    const handleCreateActivity = () => navigate("/admin/activities/create");

    /* ---------------------------------------------------------------- */
    /* FETCH ACTIVITIES                                                  */
    /* ---------------------------------------------------------------- */
    const fetchActivities = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) setRefreshing(true);
                else setLoading(true);
                setError("");

                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", String(limit));
                if (search.trim()) params.set("search", search.trim());
                if (statusFilter !== "ALL") params.set("status", statusFilter);
                if (typeFilter !== "ALL") params.set("activity_type", typeFilter);

                const response = await fetch(`${API_BASE_URL}/activities?${params.toString()}`, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                });

                let result = null;
                try {
                    result = await response.json();
                } catch {
                    throw new Error("The server returned an invalid response.");
                }

                if (!response.ok) {
                    throw new Error(result?.message || `Request failed with status ${response.status}.`);
                }

                /*
                  Support different API response structures.

                  Expected:
                  { success: true, data: [], pagination: {} }

                  Also supports:
                  { data: { activities: [] } }
                */
                let activityData = [];
                if (Array.isArray(result?.data)) {
                    activityData = result.data;
                } else if (Array.isArray(result?.activities)) {
                    activityData = result.activities;
                } else if (Array.isArray(result?.data?.activities)) {
                    activityData = result.data.activities;
                }

                setActivities(activityData);

                const serverPagination = result?.pagination || result?.data?.pagination;

                if (serverPagination) {
                    setPagination({
                        page: Number(serverPagination.page) || page,
                        limit: Number(serverPagination.limit) || limit,
                        total: Number(serverPagination.total) || activityData.length,
                        totalPages: Number(serverPagination.totalPages) || 1,
                        hasNextPage: Boolean(serverPagination.hasNextPage),
                        hasPreviousPage: Boolean(serverPagination.hasPreviousPage),
                    });
                } else {
                    const total = activityData.length;
                    setPagination({
                        page,
                        limit,
                        total,
                        totalPages: total > 0 ? Math.ceil(total / limit) : 1,
                        hasNextPage: total > page * limit,
                        hasPreviousPage: page > 1,
                    });
                }
            } catch (fetchError) {
                console.error("ACTIVITIES LOAD ERROR:", fetchError);
                setActivities([]);
                setError(fetchError?.message || "Unable to load activities.");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [page, search, statusFilter, typeFilter]
    );

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, typeFilter]);

    /* ---------------------------------------------------------------- */
    /* STATISTICS                                                        */
    /* ---------------------------------------------------------------- */
    const statistics = useMemo(() => {
        const total = Number(pagination.total) || activities.length;
        return {
            total,
            draft: activities.filter((item) => item.status === "DRAFT").length,
            scheduled: activities.filter((item) => item.status === "SCHEDULED").length,
            registrationOpen: activities.filter((item) => item.status === "REGISTRATION_OPEN").length,
            ongoing: activities.filter((item) => item.status === "ONGOING").length,
            completed: activities.filter((item) => item.status === "COMPLETED").length,
            cancelled: activities.filter((item) => item.status === "CANCELLED").length,
        };
    }, [activities, pagination.total]);

    /* ---------------------------------------------------------------- */
    /* ACTION HANDLER                                                    */
    /* ---------------------------------------------------------------- */
    const handleActivityAction = useCallback(
        (action, activity) => {
            if (!activity) return;
            const activityId = activity.id || activity.activity_id || activity.activity_code;

            switch (action) {
                case "view":
                    if (activity.activity_code) navigate(`/admin/activities/${activity.activity_code}`);
                    break;
                case "edit":
                    if (activity.activity_code) navigate(`/admin/activities/${activity.activity_code}/edit`);
                    break;
                case "participants":
                    if (activityId) navigate(`/admin/activities/${activityId}/participants`);
                    break;
                case "attendance":
                    if (activityId) navigate(`/admin/activities/${activityId}/attendance`);
                    break;
                case "tasks":
                    if (activityId) navigate(`/admin/activities/${activityId}/tasks`);
                    break;
                case "timeline":
                    if (activityId) navigate(`/admin/activities/${activityId}/timeline`);
                    break;
                case "media":
                    if (activityId) navigate(`/admin/activities/${activityId}/media`);
                    break;
                default:
                    break;
            }
        },
        [navigate]
    );

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setTypeFilter("ALL");
        setPage(1);
    };

    const hasFilters = search.trim() !== "" || statusFilter !== "ALL" || typeFilter !== "ALL";

    const handlePreviousPage = () => {
        if (page > 1) setPage((previous) => previous - 1);
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage || page < pagination.totalPages) setPage((previous) => previous + 1);
    };

    /* ---------------------------------------------------------------- */
    /* RENDER                                                            */
    /* ---------------------------------------------------------------- */
    return (
        <div className="min-h-screen" style={{ background: PAPER }}>
            <style>{`
                @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
                @keyframes menuIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
                .skeleton { background: linear-gradient(90deg, #EFEBDF 25%, #F6F2E7 37%, #EFEBDF 63%); background-size: 800px 100%; animation: shimmer 1.4s ease-in-out infinite; }
                .menu-in { animation: menuIn 0.15s ease-out both; }
                .pulse-dot { animation: pulseDot 1.4s ease-in-out infinite; }
                .stamp { border-width: 1.5px; border-style: solid; letter-spacing: 0.03em; }
                .ledger-mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", monospace; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                @media (prefers-reduced-motion: reduce) { .skeleton, .menu-in, .pulse-dot { animation: none !important; } }
            `}</style>

            <div className="mx-auto max-w-[1500px] p-5 sm:p-6 lg:p-8">
                {/* PAGE HEADER */}
                <div className="mb-6 flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: LINE }}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: INK, color: "#F2B705" }}>
                            <Activity size={22} />
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#8A5A12" }}>Activities Registry</p>
                            <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: INK, fontFamily: "Georgia, 'Source Serif 4', serif" }}>
                                Activities &amp; Events
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-6" style={{ color: "#6B7280" }}>
                                Plan, manage, and monitor foundation activities, programs, events, and volunteer initiatives.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreateActivity}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ background: INK }}
                    >
                        <Plus size={17} />
                        Create Activity
                    </button>
                </div>

                {/* STATISTICS */}
                <div
                    className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-3 xl:grid-cols-7"
                    style={{ borderColor: LINE, background: LINE }}
                >
                    <StatCard title="Total" value={statistics.total} icon={Activity} accent={INK} />
                    <StatCard title="Draft" value={statistics.draft} icon={Clock3} accent="#6B6250" />
                    <StatCard title="Scheduled" value={statistics.scheduled} icon={CalendarDays} accent="#1D5C8A" />
                    <StatCard title="Registration Open" value={statistics.registrationOpen} icon={UserPlus} accent="#0E6E55" />
                    <StatCard title="Ongoing" value={statistics.ongoing} icon={Activity} accent="#146C43" />
                    <StatCard title="Completed" value={statistics.completed} icon={CheckCircle2} accent="#5B6270" />
                    <StatCard title="Cancelled" value={statistics.cancelled} icon={XCircle} accent="#A23B2E" />
                </div>

                {/* FILTERS */}
                <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4" style={{ borderColor: LINE }}>
                    <div className="relative min-w-[240px] flex-1">
                        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9AA0AC" }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title, code, category or location..."
                            className="w-full rounded-lg border py-2.5 pl-10 pr-9 text-sm outline-none transition focus:ring-2"
                            style={{ borderColor: LINE, background: "#FAF7F0", "--tw-ring-color": "#D9C68C" }}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                title="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: LINE }}>
                        <Filter size={15} style={{ color: MUTED }} />
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="bg-transparent text-sm font-medium outline-none"
                            style={{ color: INK }}
                        >
                            <option value="ALL">All Statuses</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>{formatStatus(status)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: LINE }}>
                        <Activity size={15} style={{ color: MUTED }} />
                        <select
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                            className="bg-transparent text-sm font-medium outline-none"
                            style={{ color: INK }}
                        >
                            <option value="ALL">All Types</option>
                            {ACTIVITY_TYPES.map((type) => (
                                <option key={type} value={type}>{formatActivityType(type)}</option>
                            ))}
                        </select>
                    </div>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition hover:bg-[#FAF7F0]"
                            style={{ borderColor: LINE, color: "#3F4451" }}
                        >
                            <X size={15} />
                            Clear
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => fetchActivities(true)}
                        disabled={refreshing}
                        title="Refresh activities"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-[#FAF7F0] disabled:opacity-50"
                        style={{ borderColor: LINE, color: "#3F4451" }}
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* SECTION TITLE */}
                <div className="mb-4 flex items-baseline justify-between">
                    <h2 className="text-lg font-bold" style={{ color: INK }}>Activity Management</h2>
                    <p className="text-sm" style={{ color: MUTED }}>{pagination.total || 0} activities found</p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "#E9BCB0", background: "#FBEDE9" }}>
                        <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#A23B2E" }} />
                        <div className="flex-1">
                            <p className="text-sm font-bold" style={{ color: "#A23B2E" }}>Unable to load activities</p>
                            <p className="text-xs mt-0.5" style={{ color: "#B15948" }}>{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => fetchActivities()}
                            className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:bg-white"
                            style={{ borderColor: "#E9BCB0", color: "#A23B2E" }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
                                <div className="flex gap-3">
                                    <div className="skeleton h-14 w-14 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="skeleton h-3 w-20 rounded" />
                                        <div className="skeleton h-4 w-40 rounded" />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="skeleton h-3 w-full rounded" />
                                    <div className="skeleton h-3 w-3/4 rounded" />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="skeleton h-8 rounded" />
                                    <div className="skeleton h-8 rounded" />
                                </div>
                            </div>
                        ))}
                    </section>
                ) : activities.length > 0 ? (
                    <>
                        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {activities.map((activity, index) => (
                                <ActivityCard
                                    key={activity.id || activity.activity_id || activity.activity_code || index}
                                    activity={activity}
                                    onAction={handleActivityAction}
                                />
                            ))}
                        </section>

                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between rounded-xl border bg-white px-5 py-4" style={{ borderColor: LINE }}>
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={!pagination.hasPreviousPage && page <= 1}
                                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                                    style={{ borderColor: LINE, color: "#3F4451" }}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                <div className="text-sm" style={{ color: MUTED }}>
                                    Page <strong style={{ color: "#3F4451" }}>{page}</strong> of{" "}
                                    <strong style={{ color: "#3F4451" }}>{pagination.totalPages || 1}</strong>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={!pagination.hasNextPage && page >= pagination.totalPages}
                                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                                    style={{ borderColor: LINE, color: "#3F4451" }}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* EMPTY STATE */
                    <section className="flex flex-col items-center gap-3 rounded-2xl border bg-white px-6 py-16 text-center" style={{ borderColor: LINE }}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#F3EFE4", color: "#8A5A12" }}>
                            <Inbox size={26} />
                        </div>
                        <h3 className="text-base font-bold" style={{ color: INK }}>
                            {hasFilters ? "No activities found" : "No activities yet"}
                        </h3>
                        <p className="max-w-sm text-sm" style={{ color: MUTED }}>
                            {hasFilters ? "Try changing your search or filters." : "Create your first foundation activity to get started."}
                        </p>
                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-[#FAF7F0]"
                                style={{ borderColor: LINE, color: "#3F4451" }}
                            >
                                Clear Filters
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCreateActivity}
                                className="mt-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                style={{ background: INK }}
                            >
                                <Plus size={16} />
                                Create Activity
                            </button>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}