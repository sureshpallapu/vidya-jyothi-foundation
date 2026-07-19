import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaBriefcase,
  FaGlobe,
  FaCalendarAlt,
} from "react-icons/fa";

import { getTrusteeById } from "../../../api/trusteeApi";

/* ==========================================================================
   Lightweight, dependency-free entrance animation.
   ========================================================================== */
function AnimationStyles() {
  return (
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.94); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
    `}</style>
  );
}

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`rounded-lg bg-gray-200 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #e5e7eb 0px, #f3f4f6 40px, #e5e7eb 80px)",
        backgroundSize: "600px 100%",
        animation: "shimmer 1.4s ease-in-out infinite",
      }}
    />
  );
}

function TrusteeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trustee, setTrustee] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load Trustee
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const loadTrustee = async () => {
      try {
        setLoading(true);

        const response = await getTrusteeById(id);

        setTrustee(response.data.data);
      } catch (error) {
        console.error("Failed to load trustee:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrustee();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "-";
    return `XXXXXXXX${String(aadhaar).slice(-4)}`;
  };

  const displayValue = (value) => value || "-";

  /*
  |--------------------------------------------------------------------------
  | Loading — animated skeleton instead of plain text
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <AnimationStyles />

        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-11 h-11" />
          <div className="space-y-2">
            <SkeletonBlock className="w-48 h-6" />
            <SkeletonBlock className="w-64 h-4" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-6">
            <SkeletonBlock className="w-32 h-32 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="w-1/3 h-7" />
              <SkeletonBlock className="w-1/4 h-5" />
              <SkeletonBlock className="w-1/2 h-4" />
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl shadow-sm p-6 space-y-4"
            >
              <SkeletonBlock className="w-1/3 h-5" />
              <SkeletonBlock className="w-full h-4" />
              <SkeletonBlock className="w-2/3 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */
  if (!trustee) {
    return (
      <div className="p-10 animate-[fadeInUp_0.3s_ease-out]">
        <AnimationStyles />
        <h2 className="text-xl font-bold text-gray-800">
          Trustee not found.
        </h2>

        <button
          type="button"
          onClick={() => navigate("/admin/trustees")}
          className="mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl transition-all duration-150"
        >
          Back to Trustees
        </button>
      </div>
    );
  }

  const profileImage = trustee.profile_image
    ? `http://localhost:5000/uploads/trustees/${trustee.profile_image}`
    : null;

  return (
    <div className="p-8 space-y-6">
      <AnimationStyles />

      {/* ================================================================
          Header Actions
      ================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-[fadeInUp_0.4s_ease-out]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/trustees")}
            className="w-11 h-11 bg-white border rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all duration-150"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Trustee Profile
            </h1>
            <p className="text-gray-500 mt-1">
              View complete trustee information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/admin/trustees/${id}/edit`)}
          className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-150"
        >
          <FaEdit />
          Edit Trustee
        </button>
      </div>

      {/* ================================================================
          Profile Hero
      ================================================================= */}
      <div
        className="bg-white border rounded-2xl shadow-sm p-6 animate-[fadeInUp_0.45s_ease-out_backwards]"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Photo */}
          {profileImage ? (
            <img
              src={profileImage}
              alt={trustee.full_name}
              className="w-32 h-32 rounded-2xl object-cover border shadow-sm animate-[scaleIn_0.4s_ease-out]"
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-5xl font-bold animate-[scaleIn_0.4s_ease-out]">
              {trustee.full_name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Main Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-800">
                {trustee.full_name}
              </h2>

              {Number(trustee.is_active) === 1 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                  INACTIVE
                </span>
              )}
            </div>

            <p className="text-lg font-semibold text-blue-600 mt-2">
              {trustee.designation}
            </p>

            <p className="text-gray-500 mt-2">
              Trustee Code:{" "}
              <span className="font-semibold text-gray-700">
                {trustee.trustee_code}
              </span>
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              {Number(trustee.show_on_website) === 1 ? (
                <span className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium transition-transform duration-200 hover:scale-105">
                  <FaGlobe />
                  Public Website Profile
                </span>
              ) : (
                <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
                  <FaGlobe />
                  Hidden from Website
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          Information Grid
      ================================================================= */}
      <div className="grid xl:grid-cols-2 gap-6">
        <InfoCard icon={<FaUserTie />} title="Personal Information" delay={120}>
          <InfoRow label="Full Name" value={trustee.full_name} />
          <InfoRow
            label="Father / Spouse Name"
            value={displayValue(trustee.father_or_spouse_name)}
          />
          <InfoRow
            label="Date of Birth"
            value={formatDate(trustee.date_of_birth)}
          />
          <InfoRow label="Gender" value={displayValue(trustee.gender)} />
        </InfoCard>

        <InfoCard icon={<FaPhone />} title="Contact Information" delay={160}>
          <InfoRow
            icon={<FaPhone />}
            label="Mobile"
            value={displayValue(trustee.mobile_number)}
          />
          <InfoRow
            label="Alternate Mobile"
            value={displayValue(trustee.alternate_mobile_number)}
          />
          <InfoRow
            icon={<FaEnvelope />}
            label="Email"
            value={displayValue(trustee.email)}
          />
        </InfoCard>

        <InfoCard icon={<FaIdCard />} title="KYC Information" delay={200}>
          <InfoRow
            label="Aadhaar Number"
            value={maskAadhaar(trustee.aadhaar_number)}
          />
          <InfoRow
            label="PAN Number"
            value={displayValue(trustee.pan_number)}
          />
        </InfoCard>

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Trust Information"
          delay={240}
        >
          <InfoRow label="Designation" value={trustee.designation} />
          <InfoRow
            label="Joined Date"
            value={formatDate(trustee.joined_date)}
          />
          <InfoRow
            label="Tenure Start"
            value={formatDate(trustee.tenure_start_date)}
          />
          <InfoRow
            label="Tenure End"
            value={formatDate(trustee.tenure_end_date)}
          />
        </InfoCard>

        <InfoCard
          icon={<FaBriefcase />}
          title="Professional Information"
          delay={280}
        >
          <InfoRow
            label="Profession"
            value={displayValue(trustee.profession)}
          />
          <InfoRow
            label="Qualification"
            value={displayValue(trustee.qualification)}
          />
        </InfoCard>

        <InfoCard
          icon={<FaMapMarkerAlt />}
          title="Address Information"
          delay={320}
        >
          <InfoRow
            label="Address"
            value={
              [trustee.address_line1, trustee.address_line2]
                .filter(Boolean)
                .join(", ") || "-"
            }
          />
          <InfoRow label="City" value={displayValue(trustee.city)} />
          <InfoRow label="District" value={displayValue(trustee.district)} />
          <InfoRow label="State" value={displayValue(trustee.state)} />
          <InfoRow label="PIN Code" value={displayValue(trustee.pincode)} />
        </InfoCard>
      </div>

      {/* ================================================================
          Biography
      ================================================================= */}
      <div
        className="bg-white border rounded-2xl shadow-sm animate-[fadeInUp_0.45s_ease-out_backwards]"
        style={{ animationDelay: "360ms" }}
      >
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-3">
          <FaGlobe className="text-blue-600" />
          <h2 className="font-bold text-gray-800">
            Public Profile Biography
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {trustee.short_bio || "No biography has been added."}
          </p>

          <div className="mt-6 pt-5 border-t">
            <InfoRow
              label="Display Order"
              value={trustee.display_order ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable Information Card
|--------------------------------------------------------------------------
*/
function InfoCard({ icon, title, children, delay = 0 }) {
  return (
    <div
      className="bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-[fadeInUp_0.45s_ease-out_backwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
        <span className="text-blue-600">{icon}</span>
        <h2 className="font-bold text-gray-800">{title}</h2>
      </div>

      <div className="p-6 divide-y">{children}</div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable Information Row
|--------------------------------------------------------------------------
*/
function InfoRow({ icon, label, value }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>

      <div className="flex items-center gap-2 mt-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="font-medium text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}

export default TrusteeDetails;