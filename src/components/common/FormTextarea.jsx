function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg px-4 py-3 border outline-none transition
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

export default FormTextarea;