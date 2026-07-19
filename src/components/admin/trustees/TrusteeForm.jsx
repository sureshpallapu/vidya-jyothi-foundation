import { useRef, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaUniversity,
  FaBriefcase,
  FaGlobe,
  FaCamera,
} from "react-icons/fa";

const designations = [
  "Founder Chairman and Managing Trustee",
  "President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Managing Trustee",
  "Executive Trustee",
  "Honorary Trustee",
  "Trustee",
];

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400";

const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

/* ==========================================================================
   Lightweight, dependency-free entrance animation. Injected once per file
   via a plain <style> tag, then triggered with Tailwind's arbitrary
   animate-[...] syntax — no extra animation library, no tailwind.config
   changes needed.
   ========================================================================== */
function AnimationStyles() {
  return (
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
      }
    `}</style>
  );
}

/* ==========================================================================
   Section — hoisted OUTSIDE TrusteeForm so it keeps a stable component
   identity across renders. Defining it inside the form component was
   causing every input inside every section to unmount/remount on each
   keystroke, which is what made the cursor jump / lose focus while typing.
   ========================================================================== */
function Section({ icon, title, children, delay = 0 }) {
  return (
    <div
      className="bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-[fadeInUp_0.45s_ease-out_backwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-3">
        <span className="text-blue-600">{icon}</span>
        <h2 className="font-bold text-gray-800">{title}</h2>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-sm mt-1 animate-[fadeInUp_0.2s_ease-out]">
      {message}
    </p>
  );
}

function TrusteeForm({
  formData,
  setFormData,
  errors = {},
  onSubmit,
  submitting = false,
  submitLabel = "Create Trustee",
  isEdit = false,
}) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profile_image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const existingImageUrl = formData.existing_profile_image
    ? `http://localhost:5000/uploads/trustees/${formData.existing_profile_image}`
    : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AnimationStyles />

      {/* Profile Photo */}
      <Section icon={<FaCamera />} title="Trustee Profile Photo" delay={0}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-28 h-28 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            {imagePreview || existingImageUrl ? (
              <img
                src={imagePreview || existingImageUrl}
                alt="Trustee profile"
                className="w-full h-full object-cover animate-[scaleIn_0.3s_ease-out]"
              />
            ) : (
              <FaUser className="text-4xl text-blue-400" />
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors duration-200">
              <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-semibold transition-all duration-150"
            >
              Select Profile Photo
            </button>

            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG or WEBP. Maximum 5 MB.
            </p>
          </div>
        </div>
      </Section>

      {/* Personal Information */}
      <Section icon={<FaUser />} title="Personal Information" delay={60}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {isEdit && (
            <div>
              <label className={labelClass}>Trustee Code</label>

              <input
                type="text"
                value={formData.trustee_code || ""}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed font-semibold"
              />

              <p className="text-xs text-gray-400 mt-1">
                Trustee code is generated automatically and cannot be
                changed.
              </p>
            </div>
          )}

          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full legal name"
              className={inputClass}
            />
            <FieldError message={errors.full_name} />
          </div>

          <div>
            <label className={labelClass}>Father / Spouse Name</label>
            <input
              name="father_or_spouse_name"
              value={formData.father_or_spouse_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section icon={<FaPhone />} title="Contact Information" delay={120}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Mobile Number *</label>
            <input
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              maxLength={10}
              placeholder="10 digit mobile number"
              className={inputClass}
            />
            <FieldError message={errors.mobile_number} />
          </div>

          <div>
            <label className={labelClass}>Alternate Mobile</label>
            <input
              name="alternate_mobile_number"
              value={formData.alternate_mobile_number}
              onChange={handleChange}
              maxLength={10}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="trustee@example.com"
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      {/* KYC */}
      <Section icon={<FaIdCard />} title="KYC Information" delay={180}>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Aadhaar Number</label>
            <input
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              maxLength={12}
              placeholder="12 digit Aadhaar number"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>PAN Number</label>
            <input
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              maxLength={10}
              placeholder="ABCDE1234F"
              className={`${inputClass} uppercase`}
            />
          </div>
        </div>
      </Section>

      {/* Address */}
      <Section icon={<FaMapMarkerAlt />} title="Address Information" delay={240}>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Address Line 1</label>
            <input
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Address Line 2</label>
            <input
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {[
            ["city", "City / Town"],
            ["district", "District"],
            ["state", "State"],
            ["pincode", "PIN Code"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Trust Information */}
      <Section icon={<FaUniversity />} title="Trust Information" delay={300}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Designation *</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Designation</option>
              {designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            <FieldError message={errors.designation} />
          </div>

          <div>
            <label className={labelClass}>Joined Date</label>
            <input
              type="date"
              name="joined_date"
              value={formData.joined_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tenure Start Date</label>
            <input
              type="date"
              name="tenure_start_date"
              value={formData.tenure_start_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tenure End Date</label>
            <input
              type="date"
              name="tenure_end_date"
              value={formData.tenure_end_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      {/* Professional */}
      <Section icon={<FaBriefcase />} title="Professional Information" delay={360}>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Profession</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Qualification</label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      {/* Website */}
      <Section icon={<FaGlobe />} title="Public Website Profile" delay={420}>
        <div>
          <label className={labelClass}>Short Biography</label>
          <textarea
            name="short_bio"
            value={formData.short_bio}
            onChange={handleChange}
            rows={5}
            maxLength={1500}
            placeholder="Enter a short biography for the public Trustees page..."
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {(formData.short_bio || "").length}/1500
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              min="0"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <label
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 mt-8 md:mt-0 self-end cursor-pointer transition-all duration-200 ${
              formData.show_on_website
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              name="show_on_website"
              checked={formData.show_on_website}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="font-medium text-gray-700">
              Show on Website
            </span>
          </label>

          <label
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 mt-8 md:mt-0 self-end cursor-pointer transition-all duration-200 ${
              formData.is_active
                ? "border-green-300 bg-green-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 accent-green-600"
            />
            <span className="font-medium text-gray-700">Active Trustee</span>
          </label>
        </div>
      </Section>

      {/* Submit */}
      <div
        className="flex justify-end gap-3 bg-white border rounded-2xl p-5 animate-[fadeInUp_0.45s_ease-out_backwards]"
        style={{ animationDelay: "480ms" }}
      >
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border rounded-xl font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all duration-150"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-xl font-semibold transition-all duration-150 disabled:opacity-50 disabled:active:scale-100"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TrusteeForm;