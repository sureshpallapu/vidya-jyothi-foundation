function Button({
  children,
  variant = "primary",
}) {
  const styles = {
    primary:
      "bg-yellow-500 text-white hover:bg-yellow-600",

    secondary:
      "border border-slate-300 hover:bg-slate-100",
  };

  return (
    <button
      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        transition
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  );
}

export default Button;