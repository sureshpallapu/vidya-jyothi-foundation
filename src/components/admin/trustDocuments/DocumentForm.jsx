import React from "react";

function DocumentForm({
  formData,
  setFormData,
  categories = [],
  selectedFile,
  setSelectedFile,
  loading,
  onSubmit,
  submitText = "Save Document",
}) {
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
    >
      {/* ================= Basic Information ================= */}

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Document Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enter the document details.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Document Name *
          </label>

          <input
            type="text"
            name="document_name"
            value={formData.document_name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Document Number
          </label>

          <input
            type="text"
            name="document_number"
            value={formData.document_number}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>

      {/* ================= Category & Authority ================= */}

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Category *
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.category_name || category.name}
              </option>
            ))}

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Issuing Authority
          </label>

          <input
            type="text"
            name="issuing_authority"
            value={formData.issuing_authority}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>

      {/* ================= Dates ================= */}

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Issue Date
          </label>

          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Expiry Date
          </label>

          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            disabled={formData.is_permanent}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />
        </div>

      </div>

      {/* ================= Permanent ================= */}

      <div>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="is_permanent"
            checked={formData.is_permanent}
            onChange={handleChange}
            className="w-5 h-5"
          />

          <span className="font-medium">
            Permanent Document
          </span>

        </label>

      </div>

      {/* ================= Description ================= */}

      <div>

        <label className="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        />

      </div>

      {/* ================= Upload ================= */}

      <div>

        <label className="block text-sm font-medium mb-2">
          PDF Document
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full border rounded-xl p-3"
        />

        {selectedFile && (
          <p className="mt-2 text-sm text-green-600">
            {selectedFile.name}
          </p>
        )}

      </div>

      {/* ================= Buttons ================= */}

      <div className="flex justify-end gap-3 pt-6 border-t">

        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Please Wait..." : submitText}
        </button>

      </div>

    </form>
  );
}

export default DocumentForm;