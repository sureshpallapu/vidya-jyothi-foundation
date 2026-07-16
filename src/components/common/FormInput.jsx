function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  maxLength,
  readOnly = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full rounded-lg px-4 py-3 border transition outline-none
        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
        }
        ${
          readOnly || disabled
            ? "bg-gray-100 cursor-not-allowed"
            : ""
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;