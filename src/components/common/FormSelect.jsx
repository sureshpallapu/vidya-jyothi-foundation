function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
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

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg px-4 py-3 border outline-none transition
        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
        }`}
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormSelect;