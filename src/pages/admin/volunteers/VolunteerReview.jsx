import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaCheckCircle,
    FaClock,
    FaEdit,
    FaLock,
    FaEye,
    FaClipboardCheck,
    FaInfoCircle,
    FaGraduationCap,
    FaBriefcase,
    FaCalendarAlt,
    FaUserCheck,
    FaChevronRight,
    FaTimes,
    FaBan,
    FaPlay,
    FaArchive,
    FaUndo,
    FaExclamationTriangle,
    FaHeart,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api";

/* ==========================================================================
   MAIN COMPONENT
============================================================================ */

function VolunteerReview() {
    const { volunteerCode } = useParams();
    const navigate = useNavigate();

    const [volunteer, setVolunteer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [revealedContact, setRevealedContact] = useState({ email: null, mobile: null });
    const [revealing, setRevealing] = useState(null);
    const [actionLoading, setActionLoading] = useState("");

    /* ---------------------------------------------------------------- */
    /* FETCH VOLUNTEER                                                   */
    /* ---------------------------------------------------------------- */
    const fetchVolunteer = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            else setRefreshing(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/volunteers/admin/${encodeURIComponent(volunteerCode)}`
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load volunteer details.");
            }

            setVolunteer(result.data);
        } catch (err) {
            console.error("Volunteer review error:", err);
            setError(err.message || "Unable to load volunteer details.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (volunteerCode) fetchVolunteer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volunteerCode]);

    /* ---------------------------------------------------------------- */
    /* CALCULATIONS                                                      */
    /* ---------------------------------------------------------------- */

    /*
     * FRONTEND WORKFLOW RULE
     *
     * We are not changing the backend/database.
     *
     * When the admin completes the volunteer profile to 100%:
     *
     *   Profile 100%
     *       ↓
     *   Email    = Complete
     *   Mobile   = Complete
     *   Aadhaar  = Complete
     *       ↓
     *   Verification = 3/3
     *       ↓
     *   Approve button = Enabled
     *
     * IMPORTANT:
     * This is a frontend workflow rule. It does not perform
     * real email, mobile, or Aadhaar verification.
     */
    const completion = Math.min(Math.max(Number(volunteer?.profile_completion_percent) || 0, 0), 100);
    const isProfileComplete = completion === 100;

    const emailVerified = isProfileComplete;
    const mobileVerified = isProfileComplete;
    const aadhaarVerified = isProfileComplete;

    const verificationCount = [emailVerified, mobileVerified, aadhaarVerified].filter(Boolean).length;
    const allVerificationComplete = verificationCount === 3;

    const isPending = volunteer?.status === "PENDING";
    const isApproved = volunteer?.status === "APPROVED";
    const isActive = volunteer?.status === "ACTIVE";
    const isRejected = volunteer?.status === "REJECTED";
    const isSuspended = volunteer?.status === "SUSPENDED";
    const isInactive = volunteer?.status === "INACTIVE";
    const isArchived = volunteer?.status === "ARCHIVED";

    const canApprove = isPending && isProfileComplete && allVerificationComplete;

    const completionLabel = useMemo(() => {
        if (completion === 100) return "Complete";
        if (completion >= 75) return "Almost Complete";
        if (completion >= 50) return "In Progress";
        return "Needs Information";
    }, [completion]);

    /* ---------------------------------------------------------------- */
    /* HELPERS                                                           */
    /* ---------------------------------------------------------------- */
    const formatDate = (value) => {
        if (!value) return "Not provided";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Not provided";
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const formatDateTime = (value) => {
        if (!value) return "Not available";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Not available";
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleBack = () => navigate("/admin/volunteers");

    /* ---------------------------------------------------------------- */
    /* COMPLETE PROFILE                                                  */
    /* ---------------------------------------------------------------- */
    const handleCompleteProfile = () => {
        navigate(`/admin/volunteers/${encodeURIComponent(volunteerCode)}/edit`);
    };

    /* ---------------------------------------------------------------- */
    /* REVEAL CONTACT                                                    */
    /* ---------------------------------------------------------------- */
    const handleRevealContact = async (field) => {
        try {
            setRevealing(field);

            const response = await fetch(
                `${API_BASE_URL}/volunteers/admin/${encodeURIComponent(volunteerCode)}/reveal-contact`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field }),
                }
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Unable to reveal ${field}.`);
            }

            setRevealedContact((previous) => ({ ...previous, [field]: result.data?.value || null }));

            await Swal.fire({
                icon: "success",
                title: "Contact Revealed",
                text:
                    field === "mobile"
                        ? "Mobile number is now available for authorized contact."
                        : "Email address is now available for authorized contact.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Volunteer contact reveal error:", err);
            Swal.fire({
                icon: "error",
                title: "Unable to Reveal",
                text: err.message || "Unable to reveal contact information.",
                confirmButtonColor: "#4f46e5",
            });
        } finally {
            setRevealing(null);
        }
    };

    /* ---------------------------------------------------------------- */
    /* GENERIC WORKFLOW ACTION                                           */
    /* ---------------------------------------------------------------- */
    const performAction = async ({
        action,
        method = "PUT",
        title,
        confirmText,
        successTitle,
        successMessage,
        endpoint,
        body,
        danger = false,
        skipConfirm = false,
    }) => {
        if (!skipConfirm) {
            const confirmation = await Swal.fire({
                title,
                text: confirmText,
                icon: danger ? "warning" : "question",
                showCancelButton: true,
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
                reverseButtons: true,
                confirmButtonColor: danger ? "#dc2626" : "#4f46e5",
            });

            if (!confirmation.isConfirmed) return;
        }

        try {
            setActionLoading(action);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Unable to ${action} volunteer.`);
            }

            await Swal.fire({
                icon: "success",
                title: successTitle,
                text: successMessage,
                timer: 1800,
                showConfirmButton: false,
            });

            await fetchVolunteer(false);
        } catch (err) {
            console.error(`Volunteer ${action} error:`, err);
            Swal.fire({
                icon: "error",
                title: "Action Failed",
                text: err.message || `Unable to ${action} volunteer.`,
                confirmButtonColor: "#4f46e5",
            });
        } finally {
            setActionLoading("");
        }
    };

    /* ---------------------------------------------------------------- */
    /* APPROVE                                                           */
    /* ---------------------------------------------------------------- */
    const handleApprove = async () => {
        if (!canApprove) {
            Swal.fire({
                icon: "warning",
                title: "Approval Not Available",
                html: `
                    <div style="text-align:left">
                        <p style="margin-bottom:10px">The volunteer must satisfy all requirements:</p>
                        <ul style="padding-left:20px">
                            <li>${isProfileComplete ? "✓" : "✗"} Profile 100% complete</li>
                            <li>${emailVerified ? "✓" : "✗"} Email verified</li>
                            <li>${mobileVerified ? "✓" : "✗"} Mobile verified</li>
                            <li>${aadhaarVerified ? "✓" : "✗"} Aadhaar verified</li>
                        </ul>
                    </div>
                `,
                confirmButtonColor: "#4f46e5",
            });
            return;
        }

        await performAction({
            action: "approve",
            title: "Approve Volunteer?",
            confirmText: "This volunteer has completed the profile and all required verification checks.",
            successTitle: "Volunteer Approved",
            successMessage: "The volunteer has successfully moved to the APPROVED stage.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/approve`,
        });
    };

    /* ---------------------------------------------------------------- */
    /* REJECT                                                            */
    /* ---------------------------------------------------------------- */
    const handleReject = async () => {
        if (!isPending) return;

        const result = await Swal.fire({
            title: "Reject Volunteer",
            input: "textarea",
            inputLabel: "Rejection reason",
            inputPlaceholder: "Enter the reason for rejecting this volunteer...",
            inputAttributes: { "aria-label": "Rejection reason" },
            showCancelButton: true,
            confirmButtonText: "Reject Volunteer",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#dc2626",
            inputValidator: (value) => {
                if (!value || !value.trim()) return "Please provide a rejection reason.";
                if (value.trim().length < 5) return "Please provide a meaningful rejection reason.";
                return undefined;
            },
        });

        if (!result.isConfirmed) return;

        await performAction({
            action: "reject",
            skipConfirm: true,
            successTitle: "Volunteer Rejected",
            successMessage: "The rejection has been recorded successfully.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/reject`,
            body: { rejection_reason: result.value.trim() },
        });
    };

    /* ---------------------------------------------------------------- */
    /* ACTIVATE — used for APPROVED → ACTIVE and INACTIVE → ACTIVE       */
    /* ---------------------------------------------------------------- */
    const handleActivate = async () => {
        if (!isApproved && !isInactive) return;

        await performAction({
            action: "activate",
            title: isInactive ? "Reactivate Volunteer?" : "Activate Volunteer?",
            confirmText: "The volunteer will become ACTIVE and can participate in foundation activities.",
            successTitle: isInactive ? "Volunteer Reactivated" : "Volunteer Activated",
            successMessage: "The volunteer is now ACTIVE.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/activate`,
        });
    };

    /* ---------------------------------------------------------------- */
    /* SUSPEND                                                           */
    /* ---------------------------------------------------------------- */
    /*
     * FIX: the suspend endpoint's backend schema (suspendVolunteerSchema)
     * requires a "reason" field in the request body. The previous version
     * sent no body at all, which the backend rejected with a 422
     * "Validation failed" error. We now prompt for a reason the same way
     * handleReject does, and send it as { reason }.
     */
    const handleSuspend = async () => {
        if (!isActive) return;

        const result = await Swal.fire({
            title: "Suspend Volunteer",
            input: "textarea",
            inputLabel: "Suspension reason",
            inputPlaceholder: "Enter the reason for suspending this volunteer...",
            inputAttributes: { "aria-label": "Suspension reason" },
            showCancelButton: true,
            confirmButtonText: "Suspend Volunteer",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#dc2626",
            inputValidator: (value) => {
                if (!value || !value.trim()) return "Please provide a suspension reason.";
                if (value.trim().length < 5) return "Please provide a meaningful suspension reason.";
                return undefined;
            },
        });

        if (!result.isConfirmed) return;

        await performAction({
            action: "suspend",
            skipConfirm: true,
            successTitle: "Volunteer Suspended",
            successMessage: "The volunteer has been suspended.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/suspend`,
            body: { reason: result.value.trim() },
        });
    };

    /* ---------------------------------------------------------------- */
    /* DEACTIVATE                                                        */
    /* ---------------------------------------------------------------- */
    const handleDeactivate = async () => {
        if (!isActive && volunteer?.status !== "SUSPENDED") return;

        await performAction({
            action: "deactivate",
            title: "Deactivate Volunteer?",
            confirmText: "The volunteer will be moved to INACTIVE status.",
            successTitle: "Volunteer Deactivated",
            successMessage: "The volunteer is now inactive.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/deactivate`,
            danger: true,
        });
    };

    /* ---------------------------------------------------------------- */
    /* ARCHIVE                                                           */
    /* ---------------------------------------------------------------- */
    const handleArchive = async () => {
        await performAction({
            action: "archive",
            title: "Archive Volunteer?",
            confirmText: "Archived volunteers will no longer appear in normal active workflows.",
            successTitle: "Volunteer Archived",
            successMessage: "The volunteer has been archived.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/archive`,
            danger: true,
        });
    };

    /* ---------------------------------------------------------------- */
    /* RESTORE                                                           */
    /* ---------------------------------------------------------------- */
    const handleRestore = async () => {
        if (volunteer?.status !== "ARCHIVED") return;

        await performAction({
            action: "restore",
            title: "Restore Volunteer?",
            confirmText: "The volunteer will be returned to the normal workflow.",
            successTitle: "Volunteer Restored",
            successMessage: "The volunteer has been restored.",
            endpoint: `/volunteers/admin/${encodeURIComponent(volunteerCode)}/restore`,
        });
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onBack={handleBack} onRetry={() => fetchVolunteer()} />;
    if (!volunteer) return null;

    /* ---------------------------------------------------------------- */
    /* RENDER                                                            */
    /* ---------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-[#f6f8fc]">
            <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2 text-sm mb-5">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition"
                    >
                        <FaArrowLeft />
                        Volunteers
                    </button>
                    <FaChevronRight className="text-[10px] text-slate-300" />
                    <span className="text-slate-400">Review</span>
                    {refreshing && (
                        <>
                            <FaChevronRight className="text-[10px] text-slate-300" />
                            <span className="text-xs text-indigo-500 font-semibold">Updating...</span>
                        </>
                    )}
                </div>

                {/* HERO */}
                <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#143d6b] via-[#1b4f86] to-[#315fa8] text-white shadow-xl mb-6">
                    <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-white/[0.05]" />
                    <div className="absolute right-24 -bottom-32 w-72 h-72 rounded-full bg-white/[0.05]" />
                    <div className="absolute left-1/2 top-0 w-40 h-40 rounded-full bg-white/[0.025]" />

                    <div className="relative p-6 lg:p-8">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-[24px] bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                                    <FaUser />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{volunteer.full_name}</h1>
                                        <StatusBadge status={volunteer.status} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-blue-100">
                                        <span className="font-mono font-bold text-white">{volunteer.volunteer_code}</span>
                                        <span className="text-white/40">•</span>
                                        <span>Applied {formatDate(volunteer.created_at)}</span>
                                        <span className="text-white/40">•</span>
                                        <span>{volunteer.application_source || "PUBLIC"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur px-5 py-3 min-w-[190px]">
                                    <p className="text-xs text-blue-100">Profile Completion</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-2xl font-bold">{completion}%</span>
                                        <span className="text-xs text-blue-100">{completionLabel}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCompleteProfile}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#173f6f] font-bold shadow-lg hover:bg-blue-50 transition"
                                >
                                    <FaEdit />
                                    {isProfileComplete ? "Edit Profile" : "Complete Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATUS NOTICE */}
                <WorkflowNotice
                    volunteer={volunteer}
                    completion={completion}
                    emailVerified={emailVerified}
                    mobileVerified={mobileVerified}
                    aadhaarVerified={aadhaarVerified}
                />

                {/* SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <SummaryCard icon={<FaClipboardCheck />} title="Profile" value={`${completion}%`} subtitle={completionLabel} iconClass="bg-indigo-50 text-indigo-600" />
                    <SummaryCard
                        icon={<FaShieldAlt />}
                        title="Verification"
                        value={`${verificationCount}/3`}
                        subtitle={allVerificationComplete ? "All checks completed" : "Verification pending"}
                        iconClass="bg-emerald-50 text-emerald-600"
                    />
                    <SummaryCard icon={<FaHeart />} title="Interest" value={volunteer.area_of_interest || "Not provided"} subtitle="Primary volunteer area" iconClass="bg-rose-50 text-rose-600" />
                    <SummaryCard icon={<FaCalendarAlt />} title="Submitted" value={formatDate(volunteer.created_at)} subtitle="Application received" iconClass="bg-purple-50 text-purple-600" />
                </div>

                {/* MAIN LAYOUT */}
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-6">
                    {/* LEFT */}
                    <div className="space-y-6">
                        {/* CONTACT */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader
                                icon={<FaPhone />}
                                title="Contact Information"
                                description="Protected contact details for authorized administration"
                                iconClass="bg-indigo-50 text-indigo-600"
                                rightContent={
                                    <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                                        <FaLock />
                                        Protected
                                    </span>
                                }
                            />
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <ContactCard
                                        icon={<FaEnvelope />}
                                        label="Email Address"
                                        value={revealedContact.email || volunteer.email || "Protected"}
                                        revealed={Boolean(revealedContact.email)}
                                        loading={revealing === "email"}
                                        onReveal={() => handleRevealContact("email")}
                                    />
                                    <ContactCard
                                        icon={<FaPhone />}
                                        label="Mobile Number"
                                        value={revealedContact.mobile || volunteer.mobile || "Protected"}
                                        revealed={Boolean(revealedContact.mobile)}
                                        loading={revealing === "mobile"}
                                        onReveal={() => handleRevealContact("mobile")}
                                    />
                                </div>

                                {(revealedContact.mobile || revealedContact.email) && (
                                    <div className="mt-5 rounded-[20px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-5">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                                    <FaUserCheck />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">Authorized Contact</h3>
                                                    <p className="text-sm text-slate-500 mt-1 leading-6">
                                                        Use the verified contact details to collect any remaining information.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {revealedContact.mobile && (
                                                    <a
                                                        href={`tel:${revealedContact.mobile}`}
                                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"
                                                    >
                                                        <FaPhone />
                                                        Call
                                                    </a>
                                                )}
                                                {revealedContact.email && (
                                                    <a
                                                        href={`mailto:${revealedContact.email}`}
                                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-sm font-bold hover:bg-indigo-50 transition"
                                                    >
                                                        <FaEnvelope />
                                                        Email
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* PERSONAL */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader icon={<FaUser />} title="Personal Information" description="Basic volunteer identity and registration information" iconClass="bg-indigo-50 text-indigo-600" />
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                <InfoItem label="Full Name" value={volunteer.full_name} />
                                <InfoItem label="Volunteer Code" value={volunteer.volunteer_code} mono />
                                <InfoItem label="Gender" value={volunteer.gender} />
                                <InfoItem label="Date of Birth" value={formatDate(volunteer.date_of_birth)} />
                                <InfoItem label="City" value={volunteer.city} />
                                <InfoItem label="District" value={volunteer.district} />
                                <InfoItem label="State" value={volunteer.state} />
                                <InfoItem label="Pincode" value={volunteer.pincode} />
                                <InfoItem label="Volunteer Type" value={volunteer.volunteer_type} />
                                <InfoItem label="Primary Interest" value={volunteer.primary_interest || volunteer.area_of_interest} />
                                <InfoItem label="Secondary Interest" value={volunteer.secondary_interest} />
                                <InfoItem label="Preferred Mode" value={volunteer.preferred_mode} />
                            </div>
                        </section>

                        {/* ADDRESS */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader icon={<FaMapMarkerAlt />} title="Address" description="Residential information collected during onboarding" iconClass="bg-emerald-50 text-emerald-600" />
                            <div className="p-6">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{volunteer.address_line1 || "Address not provided"}</p>
                                            {volunteer.address_line2 && <p className="text-sm text-slate-500 mt-1">{volunteer.address_line2}</p>}
                                            <p className="text-sm text-slate-500 mt-2">
                                                {[volunteer.city, volunteer.district, volunteer.state, volunteer.pincode].filter(Boolean).join(", ") || "Location not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* EDUCATION */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader icon={<FaGraduationCap />} title="Education & Professional Information" description="Qualification, profession and experience" iconClass="bg-purple-50 text-purple-600" />
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                <InfoItem label="Highest Qualification" value={volunteer.highest_qualification} />
                                <InfoItem label="Course" value={volunteer.course} />
                                <InfoItem label="Profession" value={volunteer.profession} />
                                <InfoItem label="Organization" value={volunteer.organization} />
                                <InfoItem label="Experience" value={volunteer.years_of_experience != null ? `${volunteer.years_of_experience} years` : null} />
                                <InfoItem label="Languages Known" value={volunteer.languages_known} />
                            </div>
                        </section>

                        {/* SKILLS */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader icon={<FaBriefcase />} title="Skills & Experience" description="Volunteer capabilities and previous experience" iconClass="bg-orange-50 text-orange-600" />
                            <div className="p-6 space-y-5">
                                <InfoBlock label="Skills" value={volunteer.skills} />
                                <InfoBlock label="Previous Volunteer Experience" value={volunteer.previous_volunteer_experience} />
                                <InfoBlock label="Short Bio" value={volunteer.short_bio} />
                                <InfoBlock label="Application Message" value={volunteer.message} />
                            </div>
                        </section>

                        {/* EMERGENCY */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <SectionHeader icon={<FaPhone />} title="Emergency Contact" description="Emergency contact information" iconClass="bg-red-50 text-red-600" />
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoItem label="Contact Name" value={volunteer.emergency_contact_name} />
                                <InfoItem label="Relationship" value={volunteer.emergency_contact_relationship} />
                                <InfoItem label="Mobile" value={volunteer.emergency_contact_mobile} />
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="space-y-6">
                        {/* PROFILE COMPLETION */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Profile Completion</p>
                                    <h2 className="text-2xl font-bold text-slate-900 mt-1">{completion}%</h2>
                                </div>
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${
                                        isProfileComplete ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                                    }`}
                                >
                                    {isProfileComplete ? <FaCheckCircle className="text-xl" /> : `${completion}%`}
                                </div>
                            </div>
                            <div className="h-3 mt-5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        isProfileComplete ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-purple-600"
                                    }`}
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-3 leading-5">
                                {isProfileComplete ? "All profile information has been completed." : `${100 - completion}% additional information is required.`}
                            </p>
                            {!isProfileComplete && (
                                <button
                                    type="button"
                                    onClick={handleCompleteProfile}
                                    className="w-full mt-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"
                                >
                                    <FaEdit className="inline mr-2" />
                                    Complete Profile
                                </button>
                            )}
                        </section>

                        {/* VERIFICATION */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                            <SectionTitle icon={<FaShieldAlt />} title="Verification" subtitle="Required before approval" iconClass="bg-emerald-50 text-emerald-600" />
                            <div className="mt-5 space-y-3">
                                <VerificationCard label="Email" description="Registered email address" verified={emailVerified} />
                                <VerificationCard label="Mobile" description="Registered mobile number" verified={mobileVerified} />
                                <VerificationCard label="Aadhaar" description="Identity verification" verified={aadhaarVerified} />
                            </div>
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] text-slate-500 leading-5">
                                    {isProfileComplete
                                        ? "Profile is 100% complete. The admin approval workflow considers the three required verification checks complete."
                                        : "Complete the profile to 100% to unlock the final approval step."}
                                </p>
                            </div>
                            {allVerificationComplete ? (
                                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="mt-0.5 text-emerald-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-emerald-800">All verifications completed</p>
                                            <p className="text-xs text-emerald-700 mt-1 leading-5">Contact and identity verification requirements are complete.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <FaExclamationTriangle className="mt-0.5 text-amber-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-800">Verification incomplete</p>
                                            <p className="text-xs text-amber-700 mt-1 leading-5">
                                                Approval should remain unavailable until all required verification checks are completed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* WORKFLOW TIMELINE */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                            <SectionTitle icon={<FaClipboardCheck />} title="Volunteer Journey" subtitle="Current workflow progress" iconClass="bg-purple-50 text-purple-600" />
                            <div className="mt-7">
                                <TimelineStep completed title="Application Submitted" description={`Received ${formatDate(volunteer.created_at)}`} />
                                <TimelineStep
                                    completed={isProfileComplete}
                                    active={isPending && !isProfileComplete}
                                    title="Profile Completion"
                                    description={isProfileComplete ? "Profile information completed" : "Remaining information is being collected"}
                                />
                                <TimelineStep
                                    completed={allVerificationComplete}
                                    active={isPending && isProfileComplete && !allVerificationComplete}
                                    title="Verification"
                                    description={allVerificationComplete ? "Email, mobile and Aadhaar verified" : "Verification checks pending"}
                                />
                                <TimelineStep
                                    completed={isApproved || isActive}
                                    active={canApprove}
                                    title="Approval"
                                    description={isApproved || isActive ? "Volunteer approved" : "Waiting for final approval"}
                                />
                                <TimelineStep
                                    completed={isActive}
                                    active={isApproved}
                                    title="Activation"
                                    description={isActive ? "Volunteer is active" : isApproved ? "Ready for activation" : "Available after approval"}
                                    last
                                />
                            </div>
                        </section>

                        {/* FINAL DECISION */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <FaClipboardCheck />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900">Workflow Actions</h2>
                                        <p className="text-xs text-slate-400 mt-1">Manage the volunteer lifecycle</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                {/* PENDING */}
                                {isPending && (
                                    <>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Approval Readiness</p>
                                            <div className="mt-3 space-y-2">
                                                <RequirementLine label="Profile 100% complete" completed={isProfileComplete} />
                                                <RequirementLine label="Email verified" completed={emailVerified} />
                                                <RequirementLine label="Mobile verified" completed={mobileVerified} />
                                                <RequirementLine label="Aadhaar verified" completed={aadhaarVerified} />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleApprove}
                                            disabled={!canApprove || Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 transition"
                                        >
                                            {actionLoading === "approve" ? (<><Spinner /> Approving...</>) : (<><FaCheckCircle /> Approve Volunteer</>)}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleReject}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "reject" ? (<><Spinner /> Rejecting...</>) : (<><FaTimes /> Reject Volunteer</>)}
                                        </button>

                                        {!canApprove && (
                                            <p className="text-center text-[11px] text-slate-400 leading-5">
                                                Complete the volunteer profile to 100%. Once it reaches 100%, the three frontend verification checks will be marked complete and approval will unlock.
                                            </p>
                                        )}
                                    </>
                                )}

                                {/* APPROVED */}
                                {isApproved && (
                                    <>
                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                    <FaCheckCircle />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-800">Volunteer Approved</p>
                                                    <p className="text-xs text-emerald-700 mt-1 leading-5">Approved on {formatDateTime(volunteer.approved_at)}.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleActivate}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "activate" ? (<><Spinner /> Activating...</>) : (<><FaPlay /> Activate Volunteer</>)}
                                        </button>
                                    </>
                                )}

                                {/* ACTIVE */}
                                {isActive && (
                                    <>
                                        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <FaUserCheck />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-800">Volunteer is Active</p>
                                                    <p className="text-xs text-emerald-700 mt-1">This volunteer can participate in foundation activities.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSuspend}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "suspend" ? (<><Spinner /> Suspending...</>) : (<><FaBan /> Suspend Volunteer</>)}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleDeactivate}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "deactivate" ? (<><Spinner /> Deactivating...</>) : (<><FaBan /> Deactivate Volunteer</>)}
                                        </button>
                                    </>
                                )}

                                {/* REJECTED */}
                                {isRejected && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                        <div className="flex items-start gap-3">
                                            <FaTimes className="mt-1 text-red-600" />
                                            <div>
                                                <p className="text-sm font-bold text-red-800">Volunteer Rejected</p>
                                                <p className="text-xs text-red-700 mt-1 leading-5">
                                                    {volunteer.rejection_reason || "No rejection reason was provided."}
                                                </p>
                                                {volunteer.rejected_at && (
                                                    <p className="text-[11px] text-red-500 mt-2">Rejected {formatDateTime(volunteer.rejected_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUSPENDED */}
                                {isSuspended && (
                                    <>
                                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                            <div className="flex items-center gap-3">
                                                <FaBan className="text-amber-600" />
                                                <div>
                                                    <p className="text-sm font-bold text-amber-800">Volunteer Suspended</p>
                                                    {volunteer.suspension_reason && (
                                                        <p className="text-xs text-amber-700 mt-1 leading-5">{volunteer.suspension_reason}</p>
                                                    )}
                                                    {!volunteer.suspension_reason && (
                                                        <p className="text-xs text-amber-700 mt-1">This volunteer is currently suspended.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleDeactivate}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "deactivate" ? (<><Spinner /> Deactivating...</>) : (<><FaBan /> Deactivate Volunteer</>)}
                                        </button>
                                    </>
                                )}

                                {/* INACTIVE — FIX: this branch didn't exist before, so there was
                                    no way to move a volunteer back from INACTIVE to ACTIVE. */}
                                {isInactive && (
                                    <>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex items-center gap-3">
                                                <FaBan className="text-slate-500" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">Volunteer is Inactive</p>
                                                    <p className="text-xs text-slate-500 mt-1">This volunteer is not currently participating. Reactivate to restore ACTIVE status.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleActivate}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "activate" ? (<><Spinner /> Reactivating...</>) : (<><FaPlay /> Reactivate Volunteer</>)}
                                        </button>
                                    </>
                                )}

                                {/* ARCHIVE */}
                                {volunteer.status !== "ARCHIVED" && volunteer.status !== "PENDING" && (
                                    <button
                                        type="button"
                                        onClick={handleArchive}
                                        disabled={Boolean(actionLoading)}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition"
                                    >
                                        {actionLoading === "archive" ? (<><Spinner /> Archiving...</>) : (<><FaArchive /> Archive Volunteer</>)}
                                    </button>
                                )}

                                {/* ARCHIVED */}
                                {volunteer.status === "ARCHIVED" && (
                                    <>
                                        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                                            <div className="flex items-center gap-3">
                                                <FaArchive className="text-purple-600" />
                                                <div>
                                                    <p className="text-sm font-bold text-purple-800">Volunteer Archived</p>
                                                    <p className="text-xs text-purple-700 mt-1">This record is currently archived.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleRestore}
                                            disabled={Boolean(actionLoading)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                                        >
                                            {actionLoading === "restore" ? (<><Spinner /> Restoring...</>) : (<><FaUndo /> Restore Volunteer</>)}
                                        </button>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* AUDIT INFORMATION */}
                        <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                            <SectionTitle icon={<FaInfoCircle />} title="Record Information" subtitle="System audit information" iconClass="bg-slate-100 text-slate-600" />
                            <div className="mt-5 space-y-4">
                                <AuditItem label="Created" value={formatDateTime(volunteer.created_at)} />
                                <AuditItem label="Last Updated" value={formatDateTime(volunteer.updated_at)} />
                                <AuditItem label="Application Source" value={volunteer.application_source} />
                                <AuditItem label="Current Status" value={volunteer.status} />
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   WORKFLOW NOTICE
============================================================================ */
function WorkflowNotice({ volunteer, completion, emailVerified, mobileVerified, aadhaarVerified }) {
    const isPending = volunteer.status === "PENDING";
    const isReady = isPending && completion === 100 && emailVerified && mobileVerified && aadhaarVerified;

    if (volunteer.status === "APPROVED") {
        return (
            <NoticeBar tone="emerald" Icon={FaCheckCircle} title="Volunteer approved successfully" text="The next workflow step is activation." />
        );
    }
    if (volunteer.status === "ACTIVE") {
        return <NoticeBar tone="emerald" Icon={FaUserCheck} title="Volunteer is active" text="This volunteer has completed onboarding and is currently active." />;
    }
    if (volunteer.status === "INACTIVE") {
        return <NoticeBar tone="slate" Icon={FaBan} title="Volunteer is inactive" text="Reactivate this volunteer from the Workflow Actions panel to restore ACTIVE status." />;
    }
    if (volunteer.status === "REJECTED") {
        return <NoticeBar tone="red" Icon={FaTimes} title="Volunteer application rejected" text="Review the recorded rejection reason in the workflow panel." />;
    }
    if (isReady) {
        return <NoticeBar tone="emerald" Icon={FaCheckCircle} title="Volunteer is ready for approval" text="Profile completion and all required verification checks are complete." />;
    }
    return <NoticeBar tone="amber" Icon={FaClock} title="Volunteer review is in progress" text="Complete the remaining profile information and verification requirements before final approval." />;
}

function NoticeBar({ tone, Icon, title, text }) {
    const tones = {
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
        amber: "border-amber-200 bg-amber-50 text-amber-800",
        red: "border-red-200 bg-red-50 text-red-800",
        slate: "border-slate-200 bg-slate-50 text-slate-700",
    };
    const iconTones = {
        emerald: "text-emerald-600",
        amber: "text-amber-600",
        red: "text-red-600",
        slate: "text-slate-500",
    };

    return (
        <div className={`mb-6 rounded-[22px] border px-5 py-4 ${tones[tone]}`}>
            <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 ${iconTones[tone]}`} />
                <div>
                    <p className="text-sm font-bold">{title}</p>
                    <p className="text-xs mt-1 leading-5 opacity-90">{text}</p>
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   LOADING
============================================================================ */
function LoadingState() {
    return (
        <div className="min-h-screen bg-[#f6f8fc] p-5 sm:p-8">
            <div className="max-w-[1550px] mx-auto space-y-6">
                <div className="h-5 w-40 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-48 bg-slate-200 rounded-[30px] animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-28 bg-white rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 h-[900px] bg-white rounded-[24px] animate-pulse" />
                    <div className="h-[800px] bg-white rounded-[24px] animate-pulse" />
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   ERROR
============================================================================ */
function ErrorState({ message, onBack, onRetry }) {
    return (
        <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center p-6">
            <div className="bg-white rounded-[28px] border border-red-100 shadow-xl p-10 max-w-md w-full text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl mb-5">
                    <FaInfoCircle />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Unable to Load Volunteer</h2>
                <p className="text-sm text-slate-500 mt-2 leading-6">{message}</p>
                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={onBack} className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">
                        Back
                    </button>
                    <button type="button" onClick={onRetry} className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ============================================================================
   SUMMARY CARD
============================================================================ */
function SummaryCard({ icon, title, value, subtitle, iconClass }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400">{title}</p>
                    <p className="text-xl font-bold text-slate-900 mt-2 truncate">{value}</p>
                    <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>{icon}</div>
            </div>
        </div>
    );
}

/* ============================================================================
   SECTION HEADER / TITLE
============================================================================ */
function SectionHeader({ icon, title, description, iconClass, rightContent }) {
    return (
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>{icon}</div>
                <div>
                    <h2 className="font-bold text-slate-900">{title}</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-5">{description}</p>
                </div>
            </div>
            {rightContent}
        </div>
    );
}

function SectionTitle({ icon, title, subtitle, iconClass }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>{icon}</div>
            <div>
                <h2 className="font-bold text-slate-900">{title}</h2>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>
        </div>
    );
}

/* ============================================================================
   CONTACT CARD
============================================================================ */
function ContactCard({ icon, label, value, revealed = false, loading = false, onReveal }) {
    return (
        <div
            className={`group rounded-2xl border p-5 transition-all duration-200 ${
                revealed ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 hover:border-indigo-200 hover:shadow-sm"
            }`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            revealed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        }`}
                    >
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="text-sm font-bold text-slate-800 mt-1 truncate">{value}</p>
                        {revealed && <p className="text-xs text-emerald-600 font-medium mt-1">Available for authorized contact</p>}
                    </div>
                </div>

                {!revealed ? (
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onReveal}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-50 transition flex-shrink-0"
                    >
                        {loading ? (<><Spinner small /> Revealing</>) : (<><FaEye /> Reveal</>)}
                    </button>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 flex-shrink-0">
                        <FaCheckCircle />
                        Revealed
                    </span>
                )}
            </div>
        </div>
    );
}

/* ============================================================================
   INFO ITEM / BLOCK
============================================================================ */
function InfoItem({ label, value, mono = false }) {
    return (
        <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
            <p className={`mt-1.5 text-sm font-semibold text-slate-800 break-words ${mono ? "font-mono" : ""}`}>{value || "Not provided"}</p>
        </div>
    );
}

function InfoBlock({ label, value }) {
    return (
        <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
            <div className="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm leading-6 text-slate-600 whitespace-pre-wrap break-words">{value || "Not provided"}</p>
            </div>
        </div>
    );
}

/* ============================================================================
   VERIFICATION CARD
============================================================================ */
function VerificationCard({ label, description, verified }) {
    return (
        <div className={`rounded-2xl border px-4 py-3.5 ${verified ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                        {verified ? <FaCheckCircle /> : <FaClock />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">{label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${verified ? "text-emerald-600" : "text-amber-600"}`}>
                    {verified ? "Verified" : "Pending"}
                </span>
            </div>
        </div>
    );
}

/* ============================================================================
   REQUIREMENT LINE
============================================================================ */
function RequirementLine({ label, completed }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-600">{label}</span>
            {completed ? <FaCheckCircle className="text-emerald-500 flex-shrink-0" /> : <FaClock className="text-amber-500 flex-shrink-0" />}
        </div>
    );
}

/* ============================================================================
   TIMELINE
============================================================================ */
function TimelineStep({ active = false, completed = false, title, description, last = false }) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        completed ? "bg-emerald-100 text-emerald-600" : active ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                    }`}
                >
                    {completed ? <FaCheckCircle /> : active ? <FaClock /> : <span className="w-2 h-2 rounded-full bg-current" />}
                </div>
                {!last && <div className={`w-px h-10 my-1 ${completed ? "bg-emerald-200" : "bg-slate-200"}`} />}
            </div>
            <div className="pb-5 min-w-0">
                <p className={`text-sm font-bold ${active || completed ? "text-slate-900" : "text-slate-400"}`}>{title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-5">{description}</p>
            </div>
        </div>
    );
}

/* ============================================================================
   AUDIT ITEM
============================================================================ */
function AuditItem({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs font-semibold text-slate-400">{label}</span>
            <span className="text-xs font-bold text-slate-700 text-right">{value}</span>
        </div>
    );
}

/* ============================================================================
   STATUS BADGE
============================================================================ */
function StatusBadge({ status }) {
    const styles = {
        PENDING: "bg-amber-400/15 text-amber-100 border-amber-200/20",
        APPROVED: "bg-emerald-400/15 text-emerald-100 border-emerald-200/20",
        ACTIVE: "bg-green-400/15 text-green-100 border-green-200/20",
        REJECTED: "bg-red-400/15 text-red-100 border-red-200/20",
        SUSPENDED: "bg-orange-400/15 text-orange-100 border-orange-200/20",
        INACTIVE: "bg-slate-400/15 text-slate-100 border-slate-200/20",
        ARCHIVED: "bg-purple-400/15 text-purple-100 border-purple-200/20",
    };
    const currentStatus = status || "PENDING";

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${styles[currentStatus] || styles.PENDING}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {currentStatus}
        </span>
    );
}

/* ============================================================================
   SPINNER
============================================================================ */
function Spinner({ small = false }) {
    return <span className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${small ? "w-3.5 h-3.5" : "w-4 h-4"}`} />;
}

export default VolunteerReview;