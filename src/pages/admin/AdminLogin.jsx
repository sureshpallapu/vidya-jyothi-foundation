import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../utils/adminAuth";
import { useSettings } from "../../context/SettingsContext";

/*
|--------------------------------------------------------------------------
| Background image
|--------------------------------------------------------------------------
| Drop a licensed photo (campus, graduation day, your students, an
| archive shot of the trust's work — whatever fits) at this path in
| your project's public/assets folder. Nothing is hotlinked from the
| internet, so there's no copyright or broken-link risk.
|
| No image yet? Leave the path as-is — the illustrated gradient +
| particle background below renders on its own as a graceful fallback.
*/
const HERO_IMAGE = "/assets/images/scholarship-hero.jpg";

function AdminLogin() {
  const { settings, loading } = useSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMAGE;
    img.onload = () => setImageLoaded(true);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password }
      );

      if (response.data.success) {
        /*
        |--------------------------------------------------------------------------
        | Save Admin Session
        |--------------------------------------------------------------------------
        */
        login(response.data.admin, settings?.session_timeout || 5);

        /*
        |--------------------------------------------------------------------------
        | Redirect Dashboard
        |--------------------------------------------------------------------------
        */
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustName = loading ? "Loading…" : settings?.trust_name || "Vidya Jyothi Foundation";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B1220]">
      <style>{`
        @keyframes drift {
          0%   { transform: translate3d(0, 0, 0); }
          50%  { transform: translate3d(12px, -18px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes meshShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .particle { animation: drift ease-in-out infinite, flicker ease-in-out infinite; }
        .mesh-bg { background-size: 200% 200%; animation: meshShift 18s ease-in-out infinite; }
        .rise-in { animation: riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fade-in { animation: fadeIn 1s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .particle, .mesh-bg, .rise-in, .fade-in { animation: none !important; }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Background layer: photo (if present) + illustrated fallback      */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-0">
        {/* photo, fades in once loaded */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            opacity: imageLoaded ? 1 : 0,
          }}
        />

        {/* illustrated gradient mesh fallback / base layer, always present */}
        <div
          className="mesh-bg absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #1E3A5F 0%, transparent 45%)," +
              "radial-gradient(circle at 85% 15%, #7C2D12 0%, transparent 40%)," +
              "radial-gradient(circle at 50% 100%, #B45309 0%, transparent 50%)," +
              "linear-gradient(160deg, #0B1220 0%, #111C34 45%, #1A1030 100%)",
          }}
        />

        {/* open book / knowledge motif, faint, bottom-left */}
        <svg
          className="absolute -bottom-10 -left-10 opacity-[0.07]"
          width="420"
          height="420"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M20 40C50 30 75 35 100 50C125 35 150 30 180 40V160C150 150 125 155 100 170C75 155 50 150 20 160V40Z"
            stroke="#F2B705"
            strokeWidth="1.4"
          />
          <path d="M100 50V170" stroke="#F2B705" strokeWidth="1.4" />
        </svg>

        {/* mortarboard motif, faint, top-right */}
        <svg
          className="absolute -top-6 -right-6 opacity-[0.07]"
          width="360"
          height="360"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M100 60L180 90L100 120L20 90L100 60Z" stroke="#F2B705" strokeWidth="1.4" />
          <path d="M60 100V135C60 150 140 150 140 135V100" stroke="#F2B705" strokeWidth="1.4" />
          <path d="M180 90V125" stroke="#F2B705" strokeWidth="1.4" />
        </svg>

        {/* floating light particles — "jyothi" motif */}
        {[
          { top: "18%", left: "22%", size: 6, delay: "0s", dur: "5s" },
          { top: "32%", left: "78%", size: 4, delay: "1.1s", dur: "6.5s" },
          { top: "62%", left: "12%", size: 5, delay: "0.6s", dur: "7s" },
          { top: "74%", left: "62%", size: 7, delay: "1.8s", dur: "5.5s" },
          { top: "45%", left: "48%", size: 3, delay: "0.3s", dur: "6s" },
          { top: "85%", left: "30%", size: 4, delay: "2.2s", dur: "6.8s" },
        ].map((p, i) => (
          <span
            key={i}
            className="particle absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, #FDE68A 0%, #F2B705 60%, transparent 80%)",
              boxShadow: "0 0 10px 2px rgba(242,183,5,0.5)",
              animationDelay: `${p.delay}, ${p.delay}`,
              animationDuration: `${p.dur}, 3.4s`,
            }}
          />
        ))}

        {/* contrast scrim so the card and copy stay readable over any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/80 via-[#0B1220]/55 to-[#0B1220]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Foreground content                                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-16">
        {/* brand mark + eyebrow */}
        <div className="fade-in mb-8 flex flex-col items-center text-center">
          <svg width="52" height="68" viewBox="0 0 72 96" fill="none" className="mb-4">
            <ellipse cx="36" cy="80" rx="28" ry="9" fill="#1E293B" opacity="0.6" />
            <path
              d="M8 74C8 64 20 62 36 62C52 62 64 64 64 74C64 82 52 86 36 86C20 86 8 82 8 74Z"
              fill="url(#diyaGradient)"
            />
            <path
              d="M36 20C36 20 22 38 22 52C22 62 28 68 36 68C44 68 50 62 50 52C50 38 36 20 36 20Z"
              fill="url(#flameGradient)"
            />
            <defs>
              <linearGradient id="diyaGradient" x1="8" y1="62" x2="64" y2="86" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B45309" />
                <stop offset="1" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="flameGradient" x1="22" y1="20" x2="50" y2="68" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE68A" />
                <stop offset="0.5" stopColor="#F2B705" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>

          <span className="mb-2 text-[11px] uppercase tracking-[0.35em] text-[#F2B705]/80">
            Administrator Access
          </span>
          <h1
            className="text-3xl sm:text-4xl font-semibold text-[#F8F5EC]"
            style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
          >
            {trustName}
          </h1>
          <p className="mt-2 max-w-sm text-sm text-[#B9C2D0]">
            Sign in to manage scholarships, applicants, and records.
          </p>
        </div>

        {/* glass login card */}
        <div
          className="rise-in w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl"
          style={{ background: "rgba(17, 24, 39, 0.55)" }}
        >
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-[#E5E7EB]"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-[#F8F5EC] placeholder-[#8B95A7] outline-none transition focus:border-[#F2B705] focus:ring-2 focus:ring-[#F2B705]/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#E5E7EB]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 pr-11 text-[#F8F5EC] placeholder-[#8B95A7] outline-none transition focus:border-[#F2B705] focus:ring-2 focus:ring-[#F2B705]/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95A7] hover:text-[#E5E7EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]/40 rounded"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.24A9.9 9.9 0 0112 4c5 0 9 4 10.5 8-1.03 2.5-2.62 4.5-4.6 5.9M6.1 6.1C3.9 7.6 2.4 9.7 1.5 12c.9 2.3 2.4 4.4 4.6 5.9A9.9 9.9 0 0012 20" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1.5 12S5 4 12 4s10.5 8 10.5 8-3.5 8-10.5 8S1.5 12 1.5 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-[#F3C6A0]/40 bg-[#F3C6A0]/10 px-4 py-3 text-sm text-[#FBD38D]"
              >
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#F2B705] to-[#D97706] py-3 font-medium text-[#1F1300] transition hover:from-[#FDE68A] hover:to-[#F2B705] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isSubmitting ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>

        <p className="fade-in mt-8 text-center text-xs text-[#8B95A7]">
          Restricted area — authorized personnel only ·{" "}
          <span className="text-[#B9C2D0]">Trouble signing in? Contact your system administrator.</span>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;