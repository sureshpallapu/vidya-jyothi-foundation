import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Download,
    Printer,
    Mail,
    Archive,
    Award,
    User,
    IndianRupee,
    FileText,
    Loader2,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Fonts
|--------------------------------------------------------------------------
| This component assumes the following are loaded once, globally, e.g. in
| index.html or via @import in your global stylesheet:
|
|   <link rel="preconnect" href="https://fonts.googleapis.com">
|   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
|
| Font stacks are applied inline below so this component works even if
| your tailwind.config.js hasn't been extended with these families.
|--------------------------------------------------------------------------
*/

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace";

/* ==============================================================
   Status styling
========================================================== */

const STATUS_STYLES = {
    ISSUED: { bg: "#E6F4EC", text: "#1E7F53", ring: "#BFE3CE" },
    ACTIVE: { bg: "#E6F4EC", text: "#1E7F53", ring: "#BFE3CE" },
    PENDING: { bg: "#FBF2E2", text: "#9A6B21", ring: "#EFD9AE" },
    ARCHIVED: { bg: "#EFF0EC", text: "#5B6B62", ring: "#DADCD5" },
    REVOKED: { bg: "#FBEAE8", text: "#B3403A", ring: "#F0C7C3" },
};

const getStatusStyle = (status) =>
    STATUS_STYLES[String(status || "").toUpperCase()] || STATUS_STYLES.ARCHIVED;

/* ==============================================================
   Component
========================================================== */

function CertificateViewCard({
    certificate,
    onDownload,
    onPrint,
    onEmail,
    onArchive,
}) {

    const navigate = useNavigate();
    const [pendingAction, setPendingAction] = useState(null);

    if (!certificate) {
        return (
            <div
                className="rounded-xl border p-16 text-center"
                style={{
                    background: "#FFFFFF",
                    borderColor: "#E2E4DE",
                    fontFamily: FONT_BODY,
                }}
            >
                <div
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "#F6F5F1", color: "#B8863C" }}
                >
                    <FileText size={26} />
                </div>

                <h3
                    className="text-lg font-semibold"
                    style={{ color: "#1B2A22", fontFamily: FONT_DISPLAY }}
                >
                    No certificate selected
                </h3>

                <p className="mt-1 text-sm" style={{ color: "#5B6B62" }}>
                    Choose a certificate from the list to see its details here.
                </p>
            </div>
        );
    }

    const statusStyle = getStatusStyle(certificate.status);

    const runAction = async (key, handler) => {

        if (!handler) return;

        try {
            setPendingAction(key);
            await handler(certificate);
        } finally {
            setPendingAction(null);
        }

    };

    return (
        <div
            className="space-y-6"
            style={{ fontFamily: FONT_BODY, color: "#1B2A22" }}
        >

            {/* ==========================================================
                Folio Header
            ========================================================== */}

            <div
                className="relative overflow-hidden rounded-xl border"
                style={{ background: "#FFFFFF", borderColor: "#E2E4DE" }}
            >

                {/* Watermark seal */}

                <Award
                    size={220}
                    strokeWidth={1}
                    className="pointer-events-none absolute -right-10 -top-12 opacity-[0.05]"
                    style={{ color: "#0E6E4E" }}
                />

                <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-start gap-4">

                        {/* Seal badge — the one bold signature element */}

                        <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed"
                            style={{ borderColor: "#B8863C", color: "#B8863C" }}
                        >
                            <Award size={26} />
                        </div>

                        <div>

                            <p
                                className="text-[11px] font-medium uppercase tracking-[0.18em]"
                                style={{ color: "#5B6B62", fontFamily: FONT_MONO }}
                            >
                                Donation Certificate &middot; Ref{" "}
                                {certificate.certificate_code}
                            </p>

                            <h1
                                className="mt-1 text-2xl font-semibold sm:text-3xl"
                                style={{ fontFamily: FONT_DISPLAY, color: "#1B2A22" }}
                            >
                                {certificate.certificate_title || "Certificate Details"}
                            </h1>

                            <p className="mt-1.5 text-sm" style={{ color: "#5B6B62" }}>
                                Issued under {certificate.certificate_type || "General"} for
                                FY {certificate.financial_year || "-"}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex shrink-0 items-center gap-2 self-start rounded-lg border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ borderColor: "#E2E4DE", color: "#1B2A22" }}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                </div>

                {/* Folio strip */}

                <div
                    className="relative flex flex-wrap items-center gap-x-8 gap-y-3 border-t px-6 py-4"
                    style={{ borderColor: "#E2E4DE", background: "#FBFAF7" }}
                >

                    <FolioItem label="Status">
                        <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1"
                            style={{
                                background: statusStyle.bg,
                                color: statusStyle.text,
                                boxShadow: `inset 0 0 0 1px ${statusStyle.ring}`,
                            }}
                        >
                            {certificate.status}
                        </span>
                    </FolioItem>

                    <FolioDivider />

                    <FolioItem label="Issue Date">
                        {certificate.issue_date || "-"}
                    </FolioItem>

                    <FolioDivider />

                    <FolioItem label="Certificate Type">
                        {certificate.certificate_type || "-"}
                    </FolioItem>

                </div>

            </div>

            {/* ==========================================================
                Information
            ========================================================== */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <LedgerCard
                    icon={<Award size={20} style={{ color: "#0E6E4E" }} />}
                    title="Certificate Information"
                >
                    <InfoRow label="Certificate Code" value={certificate.certificate_code} mono />
                    <InfoRow label="Certificate Type" value={certificate.certificate_type} />
                    <InfoRow label="Certificate Title" value={certificate.certificate_title} />
                    <InfoRow label="Issue Date" value={certificate.issue_date} />
                    <InfoRow label="Financial Year" value={certificate.financial_year} />
                    <InfoRow label="Status" value={certificate.status} last />
                </LedgerCard>

                <LedgerCard
                    icon={<User size={20} style={{ color: "#0E6E4E" }} />}
                    title="Donor Information"
                >
                    <InfoRow label="Donor Name" value={certificate.full_name} />
                    <InfoRow label="Mobile" value={certificate.mobile} />
                    <InfoRow label="Email" value={certificate.email} />
                    <InfoRow label="Address" value={certificate.address} last />
                </LedgerCard>

            </div>

            {/* ==========================================================
                Donation
            ========================================================== */}

            <LedgerCard
                icon={<IndianRupee size={20} style={{ color: "#0E6E4E" }} />}
                title="Donation Information"
            >
                <div className="grid gap-x-10 md:grid-cols-2">
                    <div>
                        <InfoRow
                            label="Donation Amount"
                            value={
                                certificate.amount != null
                                    ? `\u20B9 ${Number(certificate.amount).toLocaleString("en-IN")}`
                                    : null
                            }
                            emphasize
                        />
                        <InfoRow label="Donation Type" value={certificate.donation_type} last />
                    </div>
                    <div>
                        <InfoRow label="Payment Mode" value={certificate.payment_mode} />
                        <InfoRow label="Receipt Number" value={certificate.receipt_code} mono last />
                    </div>
                </div>
            </LedgerCard>

            {/* ==========================================================
                Actions
            ========================================================== */}

            <div
                className="rounded-xl border p-6"
                style={{ background: "#FFFFFF", borderColor: "#E2E4DE" }}
            >

                <h2
                    className="mb-5 text-lg font-semibold"
                    style={{ fontFamily: FONT_DISPLAY }}
                >
                    Certificate Actions
                </h2>

                <div className="flex flex-wrap gap-3">

                    <ActionButton
                        icon={Download}
                        label="Download PDF"
                        variant="primary"
                        loading={pendingAction === "download"}
                        onClick={() => runAction("download", onDownload)}
                    />

                    <ActionButton
                        icon={Printer}
                        label="Print"
                        variant="secondary"
                        loading={pendingAction === "print"}
                        onClick={() => runAction("print", onPrint)}
                    />

                    <ActionButton
                        icon={Mail}
                        label="Email"
                        variant="secondary"
                        loading={pendingAction === "email"}
                        onClick={() => runAction("email", onEmail)}
                    />

                    <ActionButton
                        icon={Archive}
                        label="Archive"
                        variant="danger"
                        loading={pendingAction === "archive"}
                        onClick={() => runAction("archive", onArchive)}
                    />

                </div>

            </div>

        </div>
    );

}

/* ==============================================================
   Sub-components
========================================================== */

function FolioItem({ label, children }) {
    return (
        <div>
            <p
                className="text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{ color: "#8A9690" }}
            >
                {label}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: "#1B2A22" }}>
                {children}
            </p>
        </div>
    );
}

function FolioDivider() {
    return <div className="hidden h-8 w-px sm:block" style={{ background: "#E2E4DE" }} />;
}

function LedgerCard({ icon, title, children }) {
    return (
        <div
            className="rounded-xl border p-6"
            style={{ background: "#FFFFFF", borderColor: "#E2E4DE" }}
        >
            <div className="mb-4 flex items-center gap-2.5">
                {icon}
                <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: FONT_DISPLAY, color: "#1B2A22" }}
                >
                    {title}
                </h2>
            </div>
            <div>{children}</div>
        </div>
    );
}

function InfoRow({ label, value, mono, emphasize, last }) {
    return (
        <div
            className="flex items-center justify-between gap-6 py-3"
            style={{ borderBottom: last ? "none" : "1px solid #EEEFEA" }}
        >
            <span className="text-sm" style={{ color: "#5B6B62" }}>
                {label}
            </span>
            <span
                className={emphasize ? "text-lg font-semibold" : "text-sm font-medium"}
                style={{
                    color: emphasize ? "#0E6E4E" : "#1B2A22",
                    fontFamily: mono ? FONT_MONO : FONT_BODY,
                    textAlign: "right",
                }}
            >
                {value || "-"}
            </span>
        </div>
    );
}

const ACTION_VARIANTS = {
    primary: { bg: "#0E6E4E", text: "#FFFFFF", border: "#0E6E4E" },
    secondary: { bg: "#FFFFFF", text: "#1B2A22", border: "#E2E4DE" },
    danger: { bg: "#FFFFFF", text: "#B3403A", border: "#F0C7C3" },
};

function ActionButton({ icon: Icon, label, variant, loading, onClick }) {

    const style = ACTION_VARIANTS[variant] || ACTION_VARIANTS.secondary;

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            style={{
                background: style.bg,
                color: style.text,
                border: `1px solid ${style.border}`,
            }}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
            {label}
        </button>
    );
}

export default CertificateViewCard;