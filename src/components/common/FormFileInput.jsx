function FormFileInput({
  label,
  name,
  accept,
  required = false,
  onChange,
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

      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className={`w-full rounded-lg border p-3
        ${
          error
            ? "border-red-500"
            : "border-gray-300"
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

export default FormFileInput;