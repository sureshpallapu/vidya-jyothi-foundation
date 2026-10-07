/*
|==============================================================================|
| ActivityFormUI — shared design system for the Activities admin forms.       |
|                                                                              |
| Visual concept: "the ledger" — Vidya Jyothi Foundation keeps a physical     |
| record book for every activity it runs. Each section of the form reads     |
| like a tabbed page in that ledger (a coloured spine on the left of every   |
| card), and the activity's live status is shown as an ink stamp, the way   |
| a registrar would mark a physical file. Warm paper background, a serif    |
| display face for headings, restrained colour used only to carry meaning   |
| (gold = identity, plum = narrative, sky = schedule, sage = place/people,  |
| terracotta = danger/errors).                                              |
|==============================================================================|
*/

/* ---------------------------------------------------------------------------
   TOKENS
--------------------------------------------------------------------------- */
export const INK = "#1D2333";
export const INK_SOFT = "#2A3350";
export const PAPER = "#FBF8F2";
export const PAPER_SOFT = "#F3EFE4";
export const LINE = "#E4DFD2";
export const MUTED = "#9A927C";
export const GOLD = "#8A5A12";
export const GOLD_SOFT = "#D9C68C";
export const SAGE = "#0E6E55";
export const SAGE_SOFT = "#A9D9C7";
export const TERRACOTTA = "#A23B2E";
export const SKY = "#1D5C8A";
export const PLUM = "#6B3FA0";

export const DISPLAY_FONT = "Georgia, 'Source Serif 4', serif";

/* ---------------------------------------------------------------------------
   KEYFRAMES — injected once per page. No animation dependency required.
--------------------------------------------------------------------------- */
export function LedgerStyles() {
    return (
        <style>{`
            @keyframes ledger-rise {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes ledger-pop {
                0%   { transform: scale(0.85) rotate(-8deg); opacity: 0; }
                60%  { transform: scale(1.06) rotate(-4deg); opacity: 1; }
                100% { transform: scale(1) rotate(-4deg); opacity: 1; }
            }
            .ledger-animate {
                animation: ledger-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .ledger-stamp {
                animation: ledger-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            }
            .ledger-input:focus {
                box-shadow: 0 0 0 4px rgba(217, 198, 140, 0.35);
            }
            @media (prefers-reduced-motion: reduce) {
                .ledger-animate, .ledger-stamp { animation: none !important; }
            }
        `}</style>
    );
}

/* ---------------------------------------------------------------------------
   TEXT PRIMITIVES
--------------------------------------------------------------------------- */
export function InputLabel({ children, required = false, hint }) {
    return (
        <label className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold" style={{ color: "#374151" }}>
                {children}
                {required && (
                    <span className="ml-1" style={{ color: TERRACOTTA }}>
                        *
                    </span>
                )}
            </span>
            {hint && (
                <span className="text-[11px] font-medium" style={{ color: MUTED }}>
                    {hint}
                </span>
            )}
        </label>
    );
}

export function TextInput({
    value,
    onChange,
    placeholder = "",
    type = "text",
    disabled = false,
    min,
    maxLength,
    hasError = false,
    icon,
}) {
    return (
        <div className="relative">
            {icon && (
                <span
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: MUTED }}
                >
                    {icon}
                </span>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                maxLength={maxLength}
                className="ledger-input w-full rounded-lg border px-4 py-3 text-sm font-medium outline-none transition-all duration-150 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                style={{
                    borderColor: hasError ? TERRACOTTA : LINE,
                    background: "#FFFFFF",
                    color: INK,
                    paddingLeft: icon ? "2.5rem" : undefined,
                }}
                onFocus={(event) => {
                    if (!hasError) event.target.style.borderColor = INK;
                }}
                onBlur={(event) => {
                    if (!hasError) event.target.style.borderColor = LINE;
                }}
            />
        </div>
    );
}

export function TextArea({ value, onChange, placeholder = "", rows = 4, hasError = false }) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="ledger-input w-full resize-none rounded-lg border px-4 py-3 text-sm font-medium leading-6 outline-none transition-all duration-150"
            style={{ borderColor: hasError ? TERRACOTTA : LINE, background: "#FFFFFF", color: INK }}
            onFocus={(event) => {
                if (!hasError) event.target.style.borderColor = INK;
            }}
            onBlur={(event) => {
                if (!hasError) event.target.style.borderColor = LINE;
            }}
        />
    );
}

export function SelectInput({ value, onChange, children, hasError = false }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="ledger-input w-full appearance-none rounded-lg border px-4 py-3 pr-9 text-sm font-semibold outline-none transition-all duration-150"
                style={{ borderColor: hasError ? TERRACOTTA : LINE, background: "#FFFFFF", color: INK }}
            >
                {children}
            </select>
            <svg
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                viewBox="0 0 12 8"
                fill="none"
            >
                <path d="M1 1.5L6 6.5L11 1.5" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

export function ErrorText({ children }) {
    return (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: TERRACOTTA }}>
            <span
                className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: TERRACOTTA }}
            >
                !
            </span>
            {children}
        </p>
    );
}

/* ---------------------------------------------------------------------------
   SECTION CARD — the "ledger page". A coloured spine on the left edge marks
   which register this section belongs to; a faint index number sits behind
   the title, like a filed page reference.
--------------------------------------------------------------------------- */
export function SectionCard({ icon, index, title, description, accent = INK, children, delay = 0 }) {
    return (
        <section
            className="ledger-animate group relative overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(29,35,51,0.35)]"
            style={{ borderColor: LINE, animationDelay: `${delay}ms` }}
        >
            <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />

            {index && (
                <span
                    className="pointer-events-none absolute -right-2 -top-6 select-none text-7xl font-black"
                    style={{ color: accent, opacity: 0.05, fontFamily: DISPLAY_FONT }}
                >
                    {index}
                </span>
            )}

            <div className="relative flex items-center gap-4 border-b px-6 py-5" style={{ borderColor: LINE }}>
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `${accent}14`, color: accent }}
                >
                    {icon}
                </div>
                <div>
                    <h2 className="text-base font-bold" style={{ color: INK, fontFamily: DISPLAY_FONT }}>
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
                        {description}
                    </p>
                </div>
            </div>

            <div className="relative p-6">{children}</div>
        </section>
    );
}

/* ---------------------------------------------------------------------------
   TOGGLE
--------------------------------------------------------------------------- */
export function Toggle({ checked, onChange, title, description, accent = SAGE }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-200"
            style={{
                borderColor: checked ? accent : LINE,
                background: checked ? `${accent}0D` : "#FFFFFF",
            }}
        >
            <div>
                <p className="text-sm font-bold" style={{ color: INK }}>
                    {title}
                </p>
                {description && (
                    <p className="mt-1 text-xs leading-5" style={{ color: MUTED }}>
                        {description}
                    </p>
                )}
            </div>
            <span
                className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
                style={{ background: checked ? accent : "#D3D6DC" }}
            >
                <span
                    className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: checked ? "1.5rem" : "0.25rem" }}
                />
            </span>
        </button>
    );
}

/* ---------------------------------------------------------------------------
   STAMP — the signature element. A rotated, dashed-border "registrar's
   stamp" that reflects the activity's current status.
--------------------------------------------------------------------------- */
const STAMP_COLORS = {
    DRAFT: MUTED,
    SCHEDULED: SKY,
    REGISTRATION_OPEN: SAGE,
    REGISTRATION_CLOSED: GOLD,
    ONGOING: PLUM,
    COMPLETED: SAGE,
    CANCELLED: TERRACOTTA,
    POSTPONED: GOLD,
    ARCHIVED: MUTED,
};

export function StatusStamp({ status, label }) {
    const color = STAMP_COLORS[status] || MUTED;

    return (
        <div
            className="ledger-stamp inline-flex -rotate-3 items-center gap-2 rounded-lg border-2 border-dashed px-3 py-1.5"
            style={{ borderColor: color, color }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            <span className="text-[11px] font-black uppercase tracking-[0.14em]">{label}</span>
        </div>
    );
}

/* ---------------------------------------------------------------------------
   PREVIEW / SUMMARY HELPERS
--------------------------------------------------------------------------- */
export function SummaryItem({ label, value }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-bold" style={{ color: INK }}>
                {value}
            </p>
        </div>
    );
}

export function SummaryRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
            <span className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                {icon}
                {label}
            </span>
            <span className="text-xs font-bold text-white">{value}</span>
        </div>
    );
}