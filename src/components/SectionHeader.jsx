function SectionHeader({
  badge,
  title,
  description,
}) {
  return (
    <div className="text-center mb-16">

      {badge && (
        <span
          className="
            inline-block
            bg-yellow-100
            text-yellow-700
            px-4
            py-2
            rounded-full
            font-semibold
            text-sm
          "
        >
          {badge}
        </span>
      )}

      <h2
        className="
          mt-5
          text-4xl
          lg:text-5xl
          font-bold
          text-slate-900
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-5
          text-lg
          text-slate-600
          max-w-3xl
          mx-auto
        "
      >
        {description}
      </p>

    </div>
  );
}

export default SectionHeader;