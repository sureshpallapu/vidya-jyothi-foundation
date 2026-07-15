import { useSettings } from "../context/SettingsContext";

function Logo() {
  const { settings, loading } = useSettings();
  return (
    <div className="flex items-center gap-4">
      {/* Logo Symbol */}

      <div className="relative">

        <div
          className="
            w-16
            h-16
            border-4
            border-yellow-500
            rounded-b-xl
            flex
            items-center
            justify-center
            relative
          "
        >
          <span
            className="
              text-3xl
              font-extrabold
              text-yellow-500
            "
          >
            VJ
          </span>
        </div>

        <div
          className="
            absolute
            -top-3
            left-1/2
            -translate-x-1/2
            text-yellow-500
            text-xl
          "
        >
          ✦
        </div>

      </div>

      {/* Text */}

      <div>
        
  <h1 className="font-bold text-lg text-slate-900">

  {
    loading
      ? "Loading..."
      : settings?.trust_name ||
        "Vidya Jyothi Foundation"
  }

</h1>


        <p
          className="
            text-yellow-600
            text-lg
            font-medium
          "
        >
          Empowering Education
        </p>

      </div>
    </div>
  );
}

export default Logo;