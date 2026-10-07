import { useState } from "react";

import {
  FaChevronDown,
  FaChevronUp,
  FaTrophy,
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaHeart,
  FaMedal,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

function DonorAccordion({ donor }) {
  const [open, setOpen] = useState(false);

  if (!donor) {
    return null;
  }

  const rank = Number(donor.rank) || 0;

  const numericAmount = Number(donor.amount || 0);

  const amount = numericAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const donationCount = Number(donor.donationCount) || 0;

  const formattedDate = donor.date
    ? new Date(donor.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const donorName = donor.name || "Anonymous Donor";

  /* -------------------------------------------------------
     Rank configuration
  ------------------------------------------------------- */

  const getRankConfig = () => {
    if (rank === 1) {
      return {
        label: "1st",
        title: "Top Donor",
        badge:
          "bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 text-white border-yellow-300",
        icon: "text-white",
        glow: "shadow-[0_8px_30px_rgba(234,179,8,0.18)]",
        accent: "from-yellow-400 to-orange-400",
        softBg: "bg-yellow-50",
        softText: "text-yellow-700",
        border: "border-yellow-200",
      };
    }

    if (rank === 2) {
      return {
        label: "2nd",
        title: "2nd Place",
        badge:
          "bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 text-white border-gray-300",
        icon: "text-white",
        glow: "shadow-[0_8px_30px_rgba(100,116,139,0.14)]",
        accent: "from-slate-400 to-gray-500",
        softBg: "bg-gray-50",
        softText: "text-gray-700",
        border: "border-gray-200",
      };
    }

    if (rank === 3) {
      return {
        label: "3rd",
        title: "3rd Place",
        badge:
          "bg-gradient-to-br from-orange-300 via-orange-400 to-amber-600 text-white border-orange-300",
        icon: "text-white",
        glow: "shadow-[0_8px_30px_rgba(249,115,22,0.14)]",
        accent: "from-orange-400 to-amber-500",
        softBg: "bg-orange-50",
        softText: "text-orange-700",
        border: "border-orange-200",
      };
    }

    return {
      label: `#${rank}`,
      title: "Top 5 Donor",
      badge:
        "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400",
      icon: "text-white",
      glow: "",
      accent: "from-blue-500 to-indigo-600",
      softBg: "bg-blue-50",
      softText: "text-blue-700",
      border: "border-blue-100",
    };
  };

  const rankConfig = getRankConfig();

  /* -------------------------------------------------------
     Helper
  ------------------------------------------------------- */

  const formatCompactAmount = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div
      className={`
        group relative overflow-hidden
        mb-4
        rounded-2xl
        border
        border-gray-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:border-gray-300
        hover:shadow-xl
        ${rankConfig.glow}
      `}
    >
      {/* ---------------------------------------------------
          Premium top accent
      --------------------------------------------------- */}

      <div
        className={`
          h-1
          w-full
          bg-gradient-to-r
          ${rankConfig.accent}
        `}
      />

      {/* ---------------------------------------------------
          Main Header
      --------------------------------------------------- */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="
          w-full
          text-left
          px-4
          py-4
          sm:px-5
          sm:py-5
          transition-all
          duration-300
          hover:bg-gray-50/70
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-inset
        "
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* -------------------------------------------------
              Rank Badge
          ------------------------------------------------- */}

          <div
            className={`
              relative
              flex
              h-12
              w-12
              sm:h-14
              sm:w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              font-bold
              ${rankConfig.badge}
            `}
          >
            {rank <= 3 ? (
              <FaTrophy
                className={`
                  text-lg
                  sm:text-xl
                  ${rankConfig.icon}
                `}
              />
            ) : (
              <span className="text-sm sm:text-base">
                #{rank}
              </span>
            )}

            {rank === 1 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                <FaStar className="text-[8px] text-yellow-500" />
              </span>
            )}
          </div>

          {/* -------------------------------------------------
              Donor Information
          ------------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3
                className="
                  min-w-0
                  truncate
                  text-sm
                  font-bold
                  text-gray-900
                  sm:text-lg
                "
              >
                {donorName}
              </h3>

              {rank === 1 && (
                <span
                  className="
                    hidden
                    shrink-0
                    items-center
                    gap-1
                    rounded-full
                    bg-yellow-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-yellow-700
                    sm:inline-flex
                  "
                >
                  <FaStar className="text-yellow-500" />
                  Top Donor
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <FaHandHoldingHeart className="text-gray-400" />

                {donationCount}{" "}
                {donationCount === 1
                  ? "Donation"
                  : "Donations"}
              </span>

              {formattedDate && (
                <>
                  <span className="hidden h-3 w-px bg-gray-200 sm:block" />

                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-gray-400" />

                    <span>
                      Latest: {formattedDate}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* -------------------------------------------------
              Contribution
          ------------------------------------------------- */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="text-right">
              <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:block">
                Annual Contribution
              </p>

              <p className="mt-0.5 text-sm font-extrabold text-gray-900 sm:text-xl">
                ₹{amount}
              </p>

              <p className="mt-0.5 hidden text-[10px] font-medium text-gray-400 sm:block">
                {formatCompactAmount(numericAmount)}
              </p>
            </div>

            {/* Expand */}
            <div
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-300
                sm:h-9
                sm:w-9
                ${
                  open
                    ? `${rankConfig.softBg} ${rankConfig.softText} ${rankConfig.border}`
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }
              `}
            >
              {open ? (
                <FaChevronUp className="text-xs" />
              ) : (
                <FaChevronDown className="text-xs" />
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------
            Mobile rank title
        --------------------------------------------------- */}

        <div className="mt-3 flex items-center justify-between sm:hidden">
          <span
            className={`
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              ${rankConfig.softBg}
              ${rankConfig.softText}
            `}
          >
            {rankConfig.title}
          </span>

          <span className="text-[10px] font-medium text-gray-400">
            Tap to {open ? "collapse" : "view details"}
          </span>
        </div>
      </button>

      {/* -----------------------------------------------------
          Expanded Content
      ----------------------------------------------------- */}

      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className="
              border-t
              border-gray-100
              bg-gradient-to-b
              from-gray-50
              to-white
              px-4
              py-4
              sm:px-5
              sm:py-5
            "
          >
            {/* ------------------------------------------------
                Statistics
            ------------------------------------------------ */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Ranking */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Ranking
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                      #{rank}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      ${rankConfig.softBg}
                      ${rankConfig.softText}
                    `}
                  >
                    {rank <= 3 ? (
                      <FaMedal />
                    ) : (
                      <FaTrophy />
                    )}
                  </div>
                </div>
              </div>

              {/* Donations */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Total Donations
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                      {donationCount}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FaHandHoldingHeart />
                  </div>
                </div>
              </div>

              {/* Annual Contribution */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Annual Contribution
                    </p>

                    <p className="mt-1 truncate text-xl font-extrabold text-gray-900">
                      ₹{amount}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FaChartLine />
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------
                Contribution Summary
            ------------------------------------------------ */}

            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Contribution Summary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {rankConfig.title}
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-bold
                      ${rankConfig.softBg}
                      ${rankConfig.softText}
                    `}
                  >
                    #{rank}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                {/* Amount */}
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-medium text-gray-400">
                    Total Annual Contribution
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-2xl font-extrabold tracking-tight text-gray-900">
                      ₹{amount}
                    </p>

                    <span className="mb-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Latest */}
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-medium text-gray-400">
                    Latest Contribution
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                      <FaCalendarAlt />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {formattedDate || "Not available"}
                      </p>

                      <p className="text-xs text-gray-400">
                        Most recent donation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------
                Thank You Message
            ------------------------------------------------ */}

            <div
              className="
                mt-4
                relative
                overflow-hidden
                rounded-2xl
                border
                border-red-100
                bg-gradient-to-r
                from-red-50
                via-white
                to-rose-50
                p-4
                sm:p-5
              "
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-100/40 blur-2xl" />

              <div className="relative flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    shadow-sm
                  "
                >
                  <FaHeart className="text-red-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800">
                    Thank you for your generous support
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    Your contribution helps Vidya Jyothi
                    Foundation support students and create
                    better educational opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------
                Footer
            ------------------------------------------------ */}

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                Vidya Jyothi Foundation
              </span>

              <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 sm:text-xs">
                <FaHeart className="text-red-400" />
                Supporting Education
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorAccordion;