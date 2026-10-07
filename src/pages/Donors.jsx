import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FaHeart,
    FaUsers,
    FaIndianRupeeSign,
    FaTrophy,
    FaCrown,
    FaMedal,
    FaArrowTrendUp,
    FaRotateRight,
    FaCalendarDays,
} from "react-icons/fa6";

import DonorAccordion from "../components/Donors/DonorAccordion";
import {
    getPublicDonorLeaderboard,
    getPublicTopDonors,
} from "../api/donorApi";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));

const formatCompactCurrency = (amount) => {
    const value = Number(amount || 0);

    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace(/\.00$/, "")} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1).replace(/\.0$/, "")} K`;

    return `₹${value}`;
};

const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

/*
| Animated count-up (respects "prefers-reduced-motion")
*/
function useCountUp(target, duration = 1200) {

    const [value, setValue] = useState(0);

    useEffect(() => {

        const end = Number(target) || 0;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            setValue(end);
            return undefined;
        }

        let frame;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setValue(end * eased);

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);

    }, [target, duration]);

    return value;
}

/*
|--------------------------------------------------------------------------
| Shared UI
|--------------------------------------------------------------------------
*/

function Hero({ children }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">

            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

            <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur text-sm font-medium">
                    <FaHeart className="text-rose-300" />
                    Our Donors
                </div>

                <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
                    Donors{" "}
                    <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                        &amp; Contributions
                    </span>
                </h1>

                <p className="mt-5 max-w-2xl mx-auto text-blue-100/90 text-lg leading-8">
                    Every contribution helps us create better educational
                    opportunities for deserving students.
                </p>

                {children}

            </div>
        </section>
    );
}

function SectionHeading({ eyebrow, title, subtitle, icon: Icon, right }) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                    {Icon && <Icon />}
                    {eyebrow}
                </p>

                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>
                )}
            </div>

            {right}

        </div>
    );
}

function StatCard({ label, value, hint, icon: Icon, tone, children }) {

    const tones = {
        blue: "bg-blue-50 text-blue-700",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-600",
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{label}</p>

                    <p className="mt-3 text-3xl font-extrabold text-slate-900 truncate">
                        {value}
                    </p>

                    {children}
                </div>

                <div className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center text-lg transition group-hover:scale-110 ${tones[tone]}`}>
                    <Icon />
                </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">{hint}</p>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Yearly Trend (pure CSS bar chart)
|--------------------------------------------------------------------------
*/

function YearlyTrend({ leaderboard, activeYear }) {

    const data = useMemo(
        () => [...leaderboard].sort((a, b) => Number(a.year) - Number(b.year)),
        [leaderboard]
    );

    const max = Math.max(...data.map((d) => Number(d.totalAmount || 0)), 1);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Contributions by Year</h3>
                <span className="text-xs text-slate-500">Received &amp; cleared</span>
            </div>

            <div className="mt-8 flex h-56 items-end gap-3 md:gap-5">

                {data.map((item) => {

                    const amount = Number(item.totalAmount || 0);
                    const height = Math.max((amount / max) * 100, 4);
                    const isActive = Number(item.year) === Number(activeYear);

                    return (
                        <div
                            key={item.year}
                            className="group flex h-full flex-1 flex-col items-center justify-end"
                            title={`${item.year}: ${formatCurrency(amount)}`}
                        >
                            <span className="mb-2 text-xs font-semibold text-slate-600 opacity-0 transition group-hover:opacity-100">
                                {formatCompactCurrency(amount)}
                            </span>

                            <div
                                style={{ height: `${height}%` }}
                                className={`w-full max-w-[56px] rounded-t-xl transition-all duration-500 ${
                                    isActive
                                        ? "bg-gradient-to-t from-blue-700 to-blue-400"
                                        : "bg-gradient-to-t from-slate-300 to-slate-200 group-hover:from-blue-600 group-hover:to-blue-400"
                                }`}
                            />

                            <span className={`mt-3 text-xs font-semibold ${isActive ? "text-blue-700" : "text-slate-500"}`}>
                                {item.year}
                            </span>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Podium (Top 3)
|--------------------------------------------------------------------------
*/

const PODIUM = {
    1: {
        icon: FaCrown,
        ring: "ring-amber-300",
        badge: "from-amber-300 to-amber-500 text-amber-950",
        pedestal: "from-amber-400 to-amber-500",
        height: "md:h-28",
        label: "1st",
    },
    2: {
        icon: FaMedal,
        ring: "ring-slate-300",
        badge: "from-slate-200 to-slate-400 text-slate-800",
        pedestal: "from-slate-300 to-slate-400",
        height: "md:h-20",
        label: "2nd",
    },
    3: {
        icon: FaMedal,
        ring: "ring-orange-300",
        badge: "from-orange-300 to-orange-500 text-orange-950",
        pedestal: "from-orange-300 to-orange-500",
        height: "md:h-14",
        label: "3rd",
    },
};

function Podium({ donors }) {

    const top = donors.slice(0, 3);

    // Visual order: 2nd, 1st, 3rd
    const ordered = [top[1], top[0], top[2]].filter(Boolean);

    if (!top.length) return null;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">

            {ordered.map((donor) => {

                const rank = donor.rank;
                const style = PODIUM[rank] || PODIUM[3];
                const Icon = style.icon;

                return (
                    <div
                        key={`${rank}-${donor.name}`}
                        className={`flex flex-col ${rank === 1 ? "md:order-none" : ""}`}
                    >
                        <div className={`rounded-3xl bg-white p-6 text-center shadow-sm ring-2 ${style.ring} transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>

                            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-xl shadow-md ${style.badge}`}>
                                <Icon />
                            </div>

                            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                {style.label} Place
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-900 truncate" title={donor.name}>
                                {donor.name}
                            </p>

                            <p className="mt-2 text-2xl font-extrabold text-blue-700">
                                {formatCurrency(donor.amount)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {formatNumber(donor.donationCount)}{" "}
                                {Number(donor.donationCount) === 1 ? "contribution" : "contributions"}
                            </p>
                        </div>

                        <div className={`mt-2 hidden rounded-t-xl bg-gradient-to-b md:block ${style.pedestal} ${style.height}`} />
                    </div>
                );
            })}

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Loading Skeleton
|--------------------------------------------------------------------------
*/

function LoadingSkeleton() {
    return (
        <section className="py-16 px-6" aria-busy="true" aria-live="polite">

            <div className="max-w-6xl mx-auto animate-pulse">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-40 rounded-3xl bg-slate-200/70" />
                    ))}
                </div>

                <div className="mt-8 h-72 rounded-3xl bg-slate-200/70" />

                <div className="mt-8 space-y-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-2xl bg-slate-200/70" />
                    ))}
                </div>

            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Loading donor contributions...
            </p>

        </section>
    );
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

function Donors() {

    const [leaderboard, setLeaderboard] = useState([]);
    const [topDonors, setTopDonors] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch Public Donor Data
    |--------------------------------------------------------------------------
    */

    const fetchDonorData = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const [leaderboardResult, topDonorsResult] =
                await Promise.allSettled([
                    getPublicDonorLeaderboard(),
                    getPublicTopDonors(),
                ]);

            const extract = (result) =>
                result.status === "fulfilled" &&
                result.value?.data?.success &&
                Array.isArray(result.value?.data?.data)
                    ? result.value.data.data
                    : [];

            const leaderboardData = extract(leaderboardResult);
            const topDonorsData = extract(topDonorsResult);

            setLeaderboard(leaderboardData);
            setTopDonors(topDonorsData);

            if (
                leaderboardResult.status === "rejected" &&
                topDonorsResult.status === "rejected"
            ) {
                console.error(
                    "Error fetching donor information:",
                    leaderboardResult.reason
                );

                setError(
                    "Unable to load donor information. Please try again later."
                );
            }

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {
        fetchDonorData();
    }, [fetchDonorData]);

    /*
    |--------------------------------------------------------------------------
    | Derived Data
    |--------------------------------------------------------------------------
    */

    const sortedLeaderboard = useMemo(
        () => [...leaderboard].sort((a, b) => Number(b.year) - Number(a.year)),
        [leaderboard]
    );

    const currentYear = new Date().getFullYear();

    const currentYearData =
        sortedLeaderboard.find((item) => Number(item.year) === currentYear) ||
        sortedLeaderboard[0];

    const previousYearData = currentYearData
        ? sortedLeaderboard.find(
              (item) => Number(item.year) < Number(currentYearData.year)
          )
        : null;

    const previousYears = sortedLeaderboard.filter(
        (item) => Number(item.year) !== Number(currentYearData?.year)
    );

    const growth =
        currentYearData &&
        previousYearData &&
        Number(previousYearData.totalAmount) > 0
            ? ((Number(currentYearData.totalAmount) -
                  Number(previousYearData.totalAmount)) /
                  Number(previousYearData.totalAmount)) *
              100
            : null;

    const lifetimeTotal = sortedLeaderboard.reduce(
        (sum, item) => sum + Number(item.totalAmount || 0),
        0
    );

    const sortedTopDonors = useMemo(
        () => [...topDonors].sort((a, b) => Number(b.year) - Number(a.year)),
        [topDonors]
    );

    // Default the year tab to the current / latest year with data
    useEffect(() => {

        if (!sortedTopDonors.length) {
            setSelectedYear(null);
            return;
        }

        setSelectedYear((prev) => {
            const stillValid = sortedTopDonors.some(
                (item) => Number(item.year) === Number(prev)
            );

            if (stillValid) return prev;

            const preferred =
                sortedTopDonors.find(
                    (item) => Number(item.year) === currentYear
                ) || sortedTopDonors[0];

            return preferred.year;
        });

    }, [sortedTopDonors, currentYear]);

    const activeYearData = sortedTopDonors.find(
        (item) => Number(item.year) === Number(selectedYear)
    );

    // Animated headline numbers
    const animatedDonors = useCountUp(currentYearData?.totalDonors);
    const animatedAmount = useCountUp(currentYearData?.totalAmount);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Hero />
                <LoadingSkeleton />
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Hero />

                <section className="py-20 px-6">
                    <div className="max-w-xl mx-auto rounded-3xl bg-white border border-red-100 shadow-sm p-10 text-center">

                        <div className="mx-auto h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 text-xl">
                            <FaHeart />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Unable to load donor information
                        </h2>

                        <p className="mt-3 text-slate-600">{error}</p>

                        <button
                            type="button"
                            onClick={fetchDonorData}
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                            <FaRotateRight />
                            Try Again
                        </button>

                    </div>
                </section>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Empty
    |--------------------------------------------------------------------------
    */

    if (!sortedLeaderboard.length) {
        return (
            <div className="min-h-screen bg-slate-50">

                <Hero />

                <section className="py-20 px-6">
                    <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-sm p-12 text-center">

                        <FaHeart className="mx-auto text-4xl text-slate-300" />

                        <h2 className="mt-5 text-2xl font-bold text-slate-900">
                            Contributions Coming Soon
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Donor contribution information will appear here
                            once contributions are recorded.
                        </p>

                    </div>
                </section>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Main Page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* ================================================================
                HERO + LIFETIME STRIP
            ================================================================= */}

            <Hero>
                <div className="mx-auto mt-10 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 backdrop-blur">

                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-blue-200">
                            Total Raised
                        </p>
                        <p className="text-xl font-bold">
                            {formatCompactCurrency(lifetimeTotal)}
                        </p>
                    </div>

                    <span className="hidden h-8 w-px bg-white/20 sm:block" />

                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-blue-200">
                            Years of Giving
                        </p>
                        <p className="text-xl font-bold">
                            {sortedLeaderboard.length}
                        </p>
                    </div>

                </div>
            </Hero>

            {/* ================================================================
                TRANSPARENCY INTRO
            ================================================================= */}

            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Transparency &amp; Gratitude
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-amber-400" />

                    <p className="mt-5 text-slate-600 leading-8">
                        We are deeply grateful to every individual and
                        organization that supports our mission. Your
                        contributions help us provide meaningful educational
                        opportunities to deserving students.
                    </p>

                </div>
            </section>

            {/* ================================================================
                CURRENT YEAR HIGHLIGHTS
            ================================================================= */}

            {currentYearData && (
                <section className="pb-16 px-6">
                    <div className="max-w-6xl mx-auto">

                        <SectionHeading
                            icon={FaTrophy}
                            eyebrow={`${currentYearData.year} Contribution Highlights`}
                            title="Making an Impact Together"
                            right={
                                growth !== null && (
                                    <span
                                        className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold md:self-auto ${
                                            growth >= 0
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        <FaArrowTrendUp className={growth < 0 ? "rotate-90" : ""} />
                                        {growth >= 0 ? "+" : ""}
                                        {growth.toFixed(1)}% vs {previousYearData.year}
                                    </span>
                                )
                            }
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                            <StatCard
                                tone="blue"
                                icon={FaUsers}
                                label="Total Donors"
                                value={formatNumber(Math.round(animatedDonors))}
                                hint="Supporters who contributed this year"
                            />

                            <StatCard
                                tone="emerald"
                                icon={FaIndianRupeeSign}
                                label="Total Contributions"
                                value={formatCurrency(Math.round(animatedAmount))}
                                hint="Received and cleared contributions"
                            />

                            <StatCard
                                tone="amber"
                                icon={FaTrophy}
                                label="Highest Contributor"
                                value={currentYearData.topDonorName || "—"}
                                hint={`Highest total contribution for ${currentYearData.year}`}
                            >
                                <p className="mt-2 text-lg font-semibold text-blue-700">
                                    {formatCurrency(currentYearData.topDonorAmount)}
                                </p>
                            </StatCard>

                        </div>

                    </div>
                </section>
            )}

            {/* ================================================================
                YEARLY TREND + PREVIOUS YEARS
            ================================================================= */}

            {sortedLeaderboard.length > 1 && (
                <section className="pb-16 px-6">
                    <div className="max-w-6xl mx-auto">

                        <SectionHeading
                            eyebrow="Our Journey"
                            title="Year by Year"
                            subtitle="See how our community of supporters has grown over time."
                        />

                        <YearlyTrend
                            leaderboard={sortedLeaderboard}
                            activeYear={currentYearData?.year}
                        />

                        {previousYears.length > 0 && (
                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                                {previousYears.map((year) => (
                                    <article
                                        key={year.year}
                                        className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
                                    >

                                        <div className="flex items-center justify-between">

                                            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                                                <FaCalendarDays className="text-blue-600 text-base" />
                                                {year.year}
                                            </h3>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                                                {formatNumber(year.totalDonors)} donors
                                            </span>

                                        </div>

                                        <div className="mt-6">
                                            <p className="text-sm text-slate-500">
                                                Total Contributions
                                            </p>
                                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                                {formatCurrency(year.totalAmount)}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                                <FaTrophy />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-slate-500">
                                                    Highest Contributor
                                                </p>
                                                <p className="truncate font-semibold text-slate-900">
                                                    {year.topDonorName}
                                                </p>
                                            </div>

                                            <span className="whitespace-nowrap font-semibold text-blue-700">
                                                {formatCurrency(year.topDonorAmount)}
                                            </span>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

                    </div>
                </section>
            )}

            {/* ================================================================
                TOP DONORS (YEAR TABS + PODIUM + ACCORDION)
            ================================================================= */}

            {sortedTopDonors.length > 0 && (
                <section className="pb-24 px-6">
                    <div className="max-w-6xl mx-auto">

                        <SectionHeading
                            eyebrow="Contribution History"
                            title="Our Top Donors"
                            subtitle="We appreciate every contribution made toward our educational mission."
                        />

                        {/* Year tabs */}
                        <div
                            role="tablist"
                            aria-label="Select year"
                            className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-2"
                        >
                            {sortedTopDonors.map((item) => {

                                const active =
                                    Number(item.year) === Number(selectedYear);

                                return (
                                    <button
                                        key={item.year}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setSelectedYear(item.year)}
                                        className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                                            active
                                                ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                                        }`}
                                    >
                                        {item.year}
                                    </button>
                                );
                            })}
                        </div>

                        {activeYearData && (
                            <div
                                key={activeYearData.year}
                                role="tabpanel"
                                className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm md:p-8"
                            >

                                <div className="mb-8 flex items-center justify-between">

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                                            Top Contributors
                                        </p>
                                        <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                                            {activeYearData.year}
                                        </h3>
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                                        Top {Math.min(activeYearData.donors?.length || 0, 5)} Donors
                                    </span>

                                </div>

                                {/* Podium */}
                                <Podium donors={activeYearData.donors || []} />

                                {/* Detailed list */}
                                <div className="mt-10">

                                    <p className="mb-4 text-sm font-semibold text-slate-500">
                                        Detailed contributions
                                    </p>

                                    <div>
                                        {activeYearData.donors?.map((donor) => (
                                            <DonorAccordion
                                                key={`${activeYearData.year}-${donor.rank}-${donor.name}`}
                                                donor={donor}
                                            />
                                        ))}
                                    </div>

                                </div>

                            </div>
                        )}

                    </div>
                </section>
            )}

        </div>
    );
}

export default Donors;