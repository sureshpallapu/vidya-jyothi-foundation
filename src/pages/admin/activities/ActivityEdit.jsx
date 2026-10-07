import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaGlobe,
    FaUsers,
    FaCheckCircle,
    FaSave,
    FaTimes,
    FaInfoCircle,
    FaBullseye,
    FaExclamationTriangle,
    FaRedo,
    FaAddressBook,
    FaHashtag,
} from "react-icons/fa";

import {
    INK,
    PAPER,
    LINE,
    MUTED,
    GOLD,
    SAGE,
    SKY,
    PLUM,
    TERRACOTTA,
    DISPLAY_FONT,
    LedgerStyles,
    InputLabel,
    TextInput,
    TextArea,
    SelectInput,
    ErrorText,
    SectionCard,
    Toggle,
    StatusStamp,
    SummaryItem,
} from "./ActivityFormUI";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ============================================================================
   OPTIONS
============================================================================ */
const ACTIVITY_TYPES = [
    { value: "EVENT", label: "Event" },
    { value: "PROGRAM", label: "Program" },
    { value: "CAMP", label: "Camp" },
    { value: "DRIVE", label: "Drive" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "MEETING", label: "Meeting" },
    { value: "AWARENESS", label: "Awareness" },
    { value: "DISTRIBUTION", label: "Distribution" },
    { value: "VOLUNTEER_ACTIVITY", label: "Volunteer Activity" },
    { value: "FUNDRAISING", label: "Fundraising" },
    { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
    { value: "DRAFT", label: "Draft" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "REGISTRATION_OPEN", label: "Registration Open" },
    { value: "REGISTRATION_CLOSED", label: "Registration Closed" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "POSTPONED", label: "Postponed" },
    { value: "ARCHIVED", label: "Archived" },
];

const PRIORITY_OPTIONS = [
    { value: "LOW", label: "Low" },
    { value: "NORMAL", label: "Normal" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
];

const VISIBILITY_OPTIONS = [
    { value: "PUBLIC", label: "Public", description: "Visible on the public website" },
    { value: "PRIVATE", label: "Private", description: "Only authorized administrators" },
    { value: "INTERNAL", label: "Internal", description: "Visible to staff and volunteers only" },
];

/* ============================================================================
   HELPERS
============================================================================ */
function formatLabel(value = "") {
    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitialForm() {
    return {
        title: "",
        activity_type: "EVENT",
        category: "",

        short_description: "",
        description: "",
        objective: "",

        status: "DRAFT",
        priority: "NORMAL",
        visibility: "PUBLIC",

        start_date: "",
        end_date: "",

        start_time: "",
        end_time: "",

        is_all_day: false,

        venue_name: "",
        address: "",
        city: "",
        district: "",
        state: "",
        pincode: "",

        max_participants: "",

        featured: false,
        show_on_website: true,

        registration_required: false,
        registration_deadline: "",

        contact_name: "",
        contact_phone: "",
        contact_email: "",
    };
}

function normalizeDate(value) {
    if (!value) return "";
    const stringValue = String(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) return stringValue;
    if (stringValue.includes("T")) return stringValue.split("T")[0];

    const date = new Date(stringValue);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
}

function normalizeTime(value) {
    if (!value) return "";
    const stringValue = String(value);

    if (/^\d{2}:\d{2}:\d{2}$/.test(stringValue)) return stringValue.substring(0, 5);
    if (/^\d{2}:\d{2}$/.test(stringValue)) return stringValue;

    return "";
}

function normalizeBoolean(value) {
    return value === true || value === 1 || value === "1" || value === "true" || value === "TRUE";
}

function getActivityData(response) {
    if (!response) return null;
    if (response.data?.data) return response.data.data;
    if (response.data) return response.data;
    return null;
}

/* ============================================================================
   COMPONENT
============================================================================ */
export default function ActivityEdit() {
    const navigate = useNavigate();
    const { activityCode } = useParams();

    const [form, setForm] = useState(getInitialForm());
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    /* ---------------------------------------------------------------- */
    /* LOAD ACTIVITY                                                     */
    /* ---------------------------------------------------------------- */
    const loadActivity = useCallback(async () => {
        if (!activityCode) {
            setLoadError("Activity code is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setLoadError("");

            const response = await fetch(`${API_BASE_URL}/activities/${encodeURIComponent(activityCode)}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || "Unable to load activity.");
            }

            const data = getActivityData(result);
            if (!data) {
                throw new Error("Activity data was not returned by the server.");
            }

            setActivity(data);

            setForm({
                title: data.title || "",
                activity_type: data.activity_type || "EVENT",
                category: data.category || "",
                short_description: data.short_description || "",
                description: data.description || "",
                objective: data.objective || "",
                status: data.status || "DRAFT",
                priority: data.priority || "NORMAL",
                visibility: data.visibility || "PUBLIC",
                start_date: normalizeDate(data.start_date),
                end_date: normalizeDate(data.end_date),
                start_time: normalizeTime(data.start_time),
                end_time: normalizeTime(data.end_time),
                is_all_day: normalizeBoolean(data.is_all_day),
                venue_name: data.venue_name || "",
                address: data.address || "",
                city: data.city || "",
                district: data.district || "",
                state: data.state || "",
                pincode: data.pincode || "",
                max_participants: data.max_participants ?? "",
                featured: normalizeBoolean(data.featured),
                show_on_website: data.show_on_website === undefined ? true : normalizeBoolean(data.show_on_website),
                registration_required: normalizeBoolean(data.registration_required),
                registration_deadline: normalizeDate(data.registration_deadline),
                contact_name: data.contact_name || "",
                contact_phone: data.contact_phone || "",
                contact_email: data.contact_email || "",
            });
        } catch (error) {
            console.error("LOAD ACTIVITY ERROR:", error);
            setLoadError(error.message || "Unable to load activity.");
        } finally {
            setLoading(false);
        }
    }, [activityCode]);

    useEffect(() => {
        loadActivity();
    }, [loadActivity]);

    /* ---------------------------------------------------------------- */
    /* UPDATE FIELD                                                      */
    /* ---------------------------------------------------------------- */
    const updateField = (field, value) => {
        setForm((previous) => ({ ...previous, [field]: value }));
        setFieldErrors((previous) => {
            if (!previous[field]) return previous;
            const next = { ...previous };
            delete next[field];
            return next;
        });
    };

    /* ---------------------------------------------------------------- */
    /* VALIDATION                                                        */
    /* ---------------------------------------------------------------- */
    const validateForm = () => {
        const errors = {};

        if (!form.title.trim()) errors.title = "Activity title is required.";
        if (!form.activity_type) errors.activity_type = "Activity type is required.";
        if (!form.start_date) errors.start_date = "Start date is required.";

        if (form.end_date && form.start_date && form.end_date < form.start_date) {
            errors.end_date = "End date cannot be before start date.";
        }

        if (!form.is_all_day && form.start_time && form.end_time && form.end_time < form.start_time) {
            errors.end_time = "End time cannot be before start time.";
        }

        if (form.max_participants !== "" && Number(form.max_participants) < 0) {
            errors.max_participants = "Capacity cannot be negative.";
        }

        if (form.registration_required && !form.registration_deadline) {
            errors.registration_deadline = "Registration deadline is required when registration is enabled.";
        }

        if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
            errors.contact_email = "Enter a valid email address.";
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length) {
            const firstError = Object.keys(errors)[0];
            const element = document.getElementById(`activity-field-${firstError}`);
            element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return Object.keys(errors).length === 0;
    };

    /* ---------------------------------------------------------------- */
    /* PAYLOAD                                                           */
    /* ---------------------------------------------------------------- */
    const buildPayload = () => {
        return {
            title: form.title.trim(),
            activity_type: form.activity_type,
            category: form.category.trim() || null,
            short_description: form.short_description.trim() || null,
            description: form.description.trim() || null,
            objective: form.objective.trim() || null,
            status: form.status,
            priority: form.priority,
            visibility: form.visibility,
            start_date: form.start_date || null,
            end_date: form.end_date || form.start_date || null,
            start_time: form.is_all_day ? null : form.start_time || null,
            end_time: form.is_all_day ? null : form.end_time || null,
            is_all_day: form.is_all_day ? 1 : 0,
            venue_name: form.venue_name.trim() || null,
            address: form.address.trim() || null,
            city: form.city.trim() || null,
            district: form.district.trim() || null,
            state: form.state.trim() || null,
            pincode: form.pincode.trim() || null,
            max_participants: form.max_participants === "" ? null : Number(form.max_participants),
            featured: form.featured ? 1 : 0,
            show_on_website: form.show_on_website ? 1 : 0,
            registration_required: form.registration_required ? 1 : 0,
            registration_deadline: form.registration_required ? form.registration_deadline || null : null,
            contact_name: form.contact_name.trim() || null,
            contact_phone: form.contact_phone.trim() || null,
            contact_email: form.contact_email.trim() || null,
        };
    };

    /* ---------------------------------------------------------------- */
    /* SAVE                                                              */
    /* ---------------------------------------------------------------- */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            setSaving(true);

            const response = await fetch(`${API_BASE_URL}/activities/${encodeURIComponent(activityCode)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload()),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || "Unable to update activity.");
            }

            await Swal.fire({
                icon: "success",
                title: "Changes Saved",
                text: "The activity record has been updated.",
                confirmButtonColor: INK,
                confirmButtonText: "Back to Activity",
                timer: 1800,
                timerProgressBar: true,
            });

            navigate(`/admin/activities/${encodeURIComponent(activityCode)}`);
        } catch (error) {
            console.error("UPDATE ACTIVITY ERROR:", error);
            Swal.fire({
                icon: "error",
                title: "Unable to Save Changes",
                text: error.message || "Unable to update activity.",
                confirmButtonColor: INK,
            });
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------------- */
    /* CANCEL                                                            */
    /* ---------------------------------------------------------------- */
    const handleCancel = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Discard changes?",
            text: "Any unsaved edits to this activity will be lost.",
            showCancelButton: true,
            confirmButtonText: "Discard",
            cancelButtonText: "Keep Editing",
            reverseButtons: true,
            confirmButtonColor: TERRACOTTA,
        });

        if (result.isConfirmed) {
            navigate(`/admin/activities/${encodeURIComponent(activityCode)}`);
        }
    };

    /* ---------------------------------------------------------------- */
    /* PREVIEW                                                           */
    /* ---------------------------------------------------------------- */
    const locationPreview = useMemo(
        () => [form.venue_name, form.city, form.district].filter(Boolean).join(", "),
        [form.venue_name, form.city, form.district]
    );

    const datePreview = form.start_date
        ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(
              new Date(`${form.start_date}T00:00:00`)
          )
        : "Date not set";

    const statusLabel = STATUS_OPTIONS.find((item) => item.value === form.status)?.label || formatLabel(form.status);

    /* ---------------------------------------------------------------- */
    /* LOADING STATE                                                     */
    /* ---------------------------------------------------------------- */
    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center" style={{ background: PAPER }}>
                <LedgerStyles />
                <div className="flex flex-col items-center gap-4 text-center">
                    <span
                        className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                        style={{ borderColor: `${INK}33`, borderTopColor: INK }}
                    />
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
                            Loading Activity
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: MUTED }}>
                            Fetching activity details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------------------------------------------------------- */
    /* LOAD ERROR STATE                                                  */
    /* ---------------------------------------------------------------- */
    if (loadError && !activity) {
        return (
            <div className="flex min-h-full items-center justify-center px-5" style={{ background: PAPER }}>
                <LedgerStyles />
                <div
                    className="ledger-animate w-full max-w-md rounded-2xl border bg-white p-8 text-center"
                    style={{ borderColor: LINE }}
                >
                    <div
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: `${TERRACOTTA}14`, color: TERRACOTTA }}
                    >
                        <FaExclamationTriangle size={22} />
                    </div>
                    <h2 className="mt-4 text-lg font-bold" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
                        Unable to Load Activity
                    </h2>
                    <p className="mt-2 text-sm leading-6" style={{ color: MUTED }}>
                        {loadError}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/activities")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-[#FAF7F0]"
                            style={{ borderColor: LINE, color: "#5B6270" }}
                        >
                            <FaArrowLeft />
                            Back to Activities
                        </button>
                        <button
                            type="button"
                            onClick={loadActivity}
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                            style={{ background: INK }}
                        >
                            <FaRedo />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------------------------------------------------------- */
    /* RENDER                                                            */
    /* ---------------------------------------------------------------- */
    return (
        <div className="min-h-full" style={{ background: PAPER }}>
            <LedgerStyles />

            {/* TOP HEADER */}
            <div className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur" style={{ borderColor: LINE }}>
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:-translate-x-0.5 hover:bg-[#FAF7F0]"
                            style={{ borderColor: LINE, color: "#5B6270" }}
                        >
                            <FaArrowLeft />
                        </button>

                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                                Activities
                                <span style={{ color: LINE }}>/</span>
                                Edit
                            </div>
                            <h1 className="mt-1 text-xl font-semibold sm:text-2xl" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
                                Edit Activity
                            </h1>
                            <p className="mt-1 text-xs" style={{ color: MUTED }}>
                                Update and manage this foundation activity.
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-[#FAF7F0] disabled:opacity-50"
                            style={{ borderColor: LINE, color: "#5B6270" }}
                        >
                            <FaTimes />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="activity-edit-form"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ background: INK }}
                        >
                            {saving ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <form id="activity-edit-form" onSubmit={handleSubmit} className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8 lg:py-8">
                {/* LIVE PREVIEW — the open ledger page */}
                <div
                    className="ledger-animate relative mb-6 overflow-hidden rounded-2xl border"
                    style={{ borderColor: LINE, background: "linear-gradient(90deg, #F3EFE4, #FFFFFF, #EAF3FA)" }}
                >
                    <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                                Activity Preview
                            </p>
                            <h2 className="mt-2 max-w-md truncate text-xl font-bold" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
                                {form.title || "Untitled Activity"}
                            </h2>
                            <p className="mt-1 max-w-md truncate text-sm" style={{ color: MUTED }}>
                                {form.short_description || "No short description provided."}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-5">
                            <SummaryItem label="Date" value={datePreview} />
                            <SummaryItem label="Location" value={locationPreview || "Location not set"} />
                            <StatusStamp status={form.status} label={statusLabel} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
                    {/* LEFT COLUMN */}
                    <main className="space-y-6">
                        {/* BASIC INFORMATION */}
                        <SectionCard icon={<FaInfoCircle />} index="01" title="Basic Information" description="Define the identity and purpose of the activity." accent={INK} delay={0}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <InputLabel required>Activity Title</InputLabel>
                                    <div id="activity-field-title">
                                        <TextInput
                                            value={form.title}
                                            onChange={(event) => updateField("title", event.target.value)}
                                            placeholder="e.g. Education Awareness Program"
                                            hasError={Boolean(fieldErrors.title)}
                                        />
                                    </div>
                                    {fieldErrors.title && <ErrorText>{fieldErrors.title}</ErrorText>}
                                </div>

                                <div>
                                    <InputLabel required>Activity Type</InputLabel>
                                    <div id="activity-field-activity_type">
                                        <SelectInput
                                            value={form.activity_type}
                                            onChange={(event) => updateField("activity_type", event.target.value)}
                                            hasError={Boolean(fieldErrors.activity_type)}
                                        >
                                            {ACTIVITY_TYPES.map((item) => (
                                                <option key={item.value} value={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    {fieldErrors.activity_type && <ErrorText>{fieldErrors.activity_type}</ErrorText>}
                                </div>

                                <div>
                                    <InputLabel>Category</InputLabel>
                                    <TextInput
                                        value={form.category}
                                        onChange={(event) => updateField("category", event.target.value)}
                                        placeholder="e.g. Education, Health, Community"
                                    />
                                </div>
                            </div>
                        </SectionCard>

                        {/* DESCRIPTION */}
                        <SectionCard icon={<FaBullseye />} index="02" title="Description & Objective" description="Provide clear information about this activity." accent={PLUM} delay={60}>
                            <div className="space-y-5">
                                <div>
                                    <InputLabel>Short Description</InputLabel>
                                    <TextInput
                                        value={form.short_description}
                                        onChange={(event) => updateField("short_description", event.target.value)}
                                        placeholder="Short summary shown on activity cards"
                                    />
                                </div>
                                <div>
                                    <InputLabel>Full Description</InputLabel>
                                    <TextArea
                                        value={form.description}
                                        onChange={(event) => updateField("description", event.target.value)}
                                        placeholder="Describe the activity in detail..."
                                        rows={5}
                                    />
                                </div>
                                <div>
                                    <InputLabel>Objective</InputLabel>
                                    <TextArea
                                        value={form.objective}
                                        onChange={(event) => updateField("objective", event.target.value)}
                                        placeholder="What is the objective of this activity?"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </SectionCard>

                        {/* SCHEDULE */}
                        <SectionCard icon={<FaCalendarAlt />} index="03" title="Schedule" description="Define when this activity will take place." accent={SKY} delay={120}>
                            <div className="space-y-5">
                                <Toggle
                                    checked={form.is_all_day}
                                    onChange={(value) => updateField("is_all_day", value)}
                                    title="All-day activity"
                                    description="Use this when the activity does not have specific start and end times."
                                    accent={SKY}
                                />

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <InputLabel required>Start Date</InputLabel>
                                        <div id="activity-field-start_date">
                                            <TextInput
                                                type="date"
                                                icon={<FaCalendarAlt />}
                                                value={form.start_date}
                                                onChange={(event) => updateField("start_date", event.target.value)}
                                                hasError={Boolean(fieldErrors.start_date)}
                                            />
                                        </div>
                                        {fieldErrors.start_date && <ErrorText>{fieldErrors.start_date}</ErrorText>}
                                    </div>

                                    <div>
                                        <InputLabel>End Date</InputLabel>
                                        <div id="activity-field-end_date">
                                            <TextInput
                                                type="date"
                                                icon={<FaCalendarAlt />}
                                                value={form.end_date}
                                                min={form.start_date || undefined}
                                                onChange={(event) => updateField("end_date", event.target.value)}
                                                hasError={Boolean(fieldErrors.end_date)}
                                            />
                                        </div>
                                        {fieldErrors.end_date && <ErrorText>{fieldErrors.end_date}</ErrorText>}
                                    </div>

                                    {!form.is_all_day && (
                                        <>
                                            <div>
                                                <InputLabel>Start Time</InputLabel>
                                                <TextInput
                                                    type="time"
                                                    icon={<FaClock />}
                                                    value={form.start_time}
                                                    onChange={(event) => updateField("start_time", event.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <InputLabel>End Time</InputLabel>
                                                <div id="activity-field-end_time">
                                                    <TextInput
                                                        type="time"
                                                        icon={<FaClock />}
                                                        value={form.end_time}
                                                        onChange={(event) => updateField("end_time", event.target.value)}
                                                        hasError={Boolean(fieldErrors.end_time)}
                                                    />
                                                </div>
                                                {fieldErrors.end_time && <ErrorText>{fieldErrors.end_time}</ErrorText>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SectionCard>

                        {/* LOCATION */}
                        <SectionCard icon={<FaMapMarkerAlt />} index="04" title="Location" description="Specify where the activity will take place." accent={SAGE} delay={180}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <InputLabel>Venue Name</InputLabel>
                                    <TextInput
                                        value={form.venue_name}
                                        onChange={(event) => updateField("venue_name", event.target.value)}
                                        placeholder="e.g. Vidya Jyothi Foundation"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel>Address</InputLabel>
                                    <TextInput
                                        value={form.address}
                                        onChange={(event) => updateField("address", event.target.value)}
                                        placeholder="Full address"
                                    />
                                </div>

                                <div>
                                    <InputLabel>City</InputLabel>
                                    <TextInput value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City" />
                                </div>

                                <div>
                                    <InputLabel>District</InputLabel>
                                    <TextInput value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="District" />
                                </div>

                                <div>
                                    <InputLabel>State</InputLabel>
                                    <TextInput value={form.state} onChange={(event) => updateField("state", event.target.value)} placeholder="State" />
                                </div>

                                <div>
                                    <InputLabel>PIN Code</InputLabel>
                                    <TextInput
                                        value={form.pincode}
                                        onChange={(event) => updateField("pincode", event.target.value)}
                                        placeholder="PIN Code"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </SectionCard>

                        {/* PARTICIPATION */}
                        <SectionCard icon={<FaUsers />} index="05" title="Participation" description="Configure participant capacity and registration." accent={GOLD} delay={240}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <InputLabel>Maximum Participants</InputLabel>
                                    <TextInput
                                        type="number"
                                        icon={<FaUsers />}
                                        value={form.max_participants}
                                        onChange={(event) => updateField("max_participants", event.target.value)}
                                        min="0"
                                        placeholder="Leave empty for unlimited"
                                        hasError={Boolean(fieldErrors.max_participants)}
                                    />
                                    {fieldErrors.max_participants && <ErrorText>{fieldErrors.max_participants}</ErrorText>}
                                </div>

                                <div>
                                    <InputLabel>Registration</InputLabel>
                                    <Toggle
                                        checked={form.registration_required}
                                        onChange={(value) => updateField("registration_required", value)}
                                        title="Registration required"
                                        description="Participants must register before attending."
                                        accent={GOLD}
                                    />
                                </div>

                                {form.registration_required && (
                                    <div>
                                        <InputLabel required>Registration Deadline</InputLabel>
                                        <div id="activity-field-registration_deadline">
                                            <TextInput
                                                type="date"
                                                value={form.registration_deadline}
                                                onChange={(event) => updateField("registration_deadline", event.target.value)}
                                                hasError={Boolean(fieldErrors.registration_deadline)}
                                            />
                                        </div>
                                        {fieldErrors.registration_deadline && <ErrorText>{fieldErrors.registration_deadline}</ErrorText>}
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        {/* CONTACT */}
                        <SectionCard icon={<FaAddressBook />} index="06" title="Contact Information" description="Optional contact details for this activity." accent={PLUM} delay={300}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <InputLabel>Contact Name</InputLabel>
                                    <TextInput
                                        value={form.contact_name}
                                        onChange={(event) => updateField("contact_name", event.target.value)}
                                        placeholder="Contact person"
                                    />
                                </div>

                                <div>
                                    <InputLabel>Contact Phone</InputLabel>
                                    <TextInput
                                        type="tel"
                                        value={form.contact_phone}
                                        onChange={(event) => updateField("contact_phone", event.target.value)}
                                        placeholder="Phone number"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel>Contact Email</InputLabel>
                                    <TextInput
                                        type="email"
                                        value={form.contact_email}
                                        onChange={(event) => updateField("contact_email", event.target.value)}
                                        placeholder="contact@example.com"
                                        hasError={Boolean(fieldErrors.contact_email)}
                                    />
                                    {fieldErrors.contact_email && <ErrorText>{fieldErrors.contact_email}</ErrorText>}
                                </div>
                            </div>
                        </SectionCard>
                    </main>

                    {/* RIGHT COLUMN */}
                    <aside className="space-y-6">
                        {/* PUBLISHING */}
                        <SectionCard icon={<FaCheckCircle />} title="Publishing" description="Control how the activity is managed." accent={SKY} delay={80}>
                            <div className="space-y-5">
                                <div>
                                    <InputLabel>Status</InputLabel>
                                    <SelectInput value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                                        {STATUS_OPTIONS.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </div>

                                <div>
                                    <InputLabel>Priority</InputLabel>
                                    <SelectInput value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
                                        {PRIORITY_OPTIONS.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </div>

                                <div>
                                    <InputLabel>Visibility</InputLabel>
                                    <SelectInput value={form.visibility} onChange={(event) => updateField("visibility", event.target.value)}>
                                        {VISIBILITY_OPTIONS.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <p className="mt-2 text-xs leading-5" style={{ color: MUTED }}>
                                        {VISIBILITY_OPTIONS.find((item) => item.value === form.visibility)?.description}
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        {/* DISPLAY OPTIONS */}
                        <SectionCard icon={<FaGlobe />} title="Display Options" description="Choose how this activity appears." accent={SAGE} delay={140}>
                            <div className="space-y-3">
                                <Toggle
                                    checked={form.featured}
                                    onChange={(value) => updateField("featured", value)}
                                    title="Featured Activity"
                                    description="Highlight this activity on featured sections."
                                    accent={SAGE}
                                />
                                <Toggle
                                    checked={form.show_on_website}
                                    onChange={(value) => updateField("show_on_website", value)}
                                    title="Show on Website"
                                    description="Display this activity on the public website."
                                    accent={SAGE}
                                />
                            </div>
                        </SectionCard>

                        {/* ACTIVITY CODE */}
                        <div
                            className="ledger-animate flex items-center gap-4 rounded-2xl p-6 text-white"
                            style={{ background: `linear-gradient(135deg, ${INK}, #2A3350)`, animationDelay: "200ms" }}
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.1)", color: "#F2B705" }}>
                                <FaHashtag />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                                    Activity Code
                                </p>
                                <p className="truncate text-sm font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                                    {activity?.activity_code || activityCode}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div
                    className="ledger-animate mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-white p-5 sm:flex-row"
                    style={{ borderColor: LINE }}
                >
                    <p className="text-xs" style={{ color: MUTED }}>
                        Changes are saved to the activity record.
                    </p>

                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-[#FAF7F0] disabled:opacity-50 sm:flex-none"
                            style={{ borderColor: LINE, color: "#5B6270" }}
                        >
                            <FaTimes />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                            style={{ background: INK }}
                        >
                            {saving ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}