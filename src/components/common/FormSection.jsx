function FormSection({
  title,
  children,
}) {
  return (
    <div className="mb-10">

      <div className="border-b pb-3 mb-6">

        <h2 className="text-2xl font-bold text-slate-800">
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
}

export default FormSection;