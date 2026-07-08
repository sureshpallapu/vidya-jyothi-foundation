function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
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
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-lg px-4 py-3 border transition outline-none
        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
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