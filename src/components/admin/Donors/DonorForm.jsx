import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";
import { getDonorTypes } from "../../../api/donorApi";

function DonorForm({
  formData,
  setFormData,
  errors = {},
  onSubmit,
  submitting = false,
  submitLabel = "Save Donor",
}) {

  const navigate = useNavigate();

  const [donorTypes, setDonorTypes] = useState([]);

  useEffect(() => {
    loadDonorTypes();
  }, []);

  const loadDonorTypes = async () => {
    try {

      const response = await getDonorTypes();

      setDonorTypes(response?.data?.data || []);

    } catch (error) {

      console.error("Unable to load donor types", error);

    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const inputClass = (field) =>
    `
      w-full
      rounded-xl
      border
      px-4
      py-3
      outline-none
      transition
      ${
        errors[field]
          ? "border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      }
    `;

  return (

    <form onSubmit={onSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold text-slate-800">

            Donor Information

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            Basic donor profile details.

          </p>

        </div>

        <div className="p-6 grid lg:grid-cols-3 gap-5">

          {/* Donor Type */}

          <div>

            <label className="block mb-2 font-medium">

              Donor Type
              <span className="text-red-500">*</span>

            </label>

            <select
              name="donor_type_id"
              value={formData.donor_type_id}
              onChange={handleChange}
              className={inputClass("donor_type_id")}
            >

              <option value="">
                Select Donor Type
              </option>

              {donorTypes.map((type) => (

                <option
                  key={type.id}
                  value={type.id}
                >
{type.type_name}                </option>

              ))}

            </select>

            {errors.donor_type_id && (

              <p className="text-sm text-red-500 mt-1">

                {errors.donor_type_id}

              </p>

            )}

          </div>

          {/* Full Name */}

          <div>

            <label className="block mb-2 font-medium">

              Full Name
              <span className="text-red-500">*</span>

            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className={inputClass("full_name")}
            />

            {errors.full_name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.full_name}
              </p>
            )}

          </div>

          {/* Display Name */}

          <div>

            <label className="block mb-2 font-medium">

              Display Name

            </label>

            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Website Display Name"
              className={inputClass("display_name")}
            />

          </div>

        </div>

      </div>
            <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold">

            Contact Information

          </h2>

          <p className="text-sm text-gray-500">

            Phone, email and website details.

          </p>

        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-5">

          {/* Mobile */}

          <div>

            <label className="block mb-2 font-medium">

              Mobile Number
              <span className="text-red-500">*</span>

            </label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              className={inputClass("mobile")}
            />

            {errors.mobile && (

              <p className="text-sm text-red-500 mt-1">

                {errors.mobile}

              </p>

            )}

          </div>

          {/* Alternate */}

          <div>

            <label className="block mb-2 font-medium">

              Alternate Mobile

            </label>

            <input
              type="text"
              name="alternate_mobile"
              value={formData.alternate_mobile}
              onChange={handleChange}
              className={inputClass("alternate_mobile")}
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 font-medium">

              Email Address

            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={inputClass("email")}
            />

            {errors.email && (

              <p className="text-sm text-red-500 mt-1">

                {errors.email}

              </p>

            )}

          </div>

          {/* Website */}

          <div>

            <label className="block mb-2 font-medium">

              Website

            </label>

            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.org"
              className={inputClass("website")}
            />

          </div>

        </div>

      </div>

            {/* ============================================================
          Identification Details
      ============================================================ */}

      <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold text-slate-800">
            Identification Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Government issued identification numbers.
          </p>

        </div>

        <div className="p-6 grid lg:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* PAN */}

          <div>

            <label className="block mb-2 font-medium">
              PAN Number
            </label>

            <input
              type="text"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className={inputClass("pan_number")}
            />

            {errors.pan_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.pan_number}
              </p>
            )}

          </div>

          {/* Aadhaar */}

          <div>

            <label className="block mb-2 font-medium">
              Aadhaar Number
            </label>

            <input
              type="text"
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              placeholder="123412341234"
              className={inputClass("aadhaar_number")}
            />

            {errors.aadhaar_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.aadhaar_number}
              </p>
            )}

          </div>

          {/* GST */}

          <div>

            <label className="block mb-2 font-medium">
              GST Number
            </label>

            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleChange}
              placeholder="GST Number"
              className={inputClass("gst_number")}
            />

          </div>

          {/* Registration */}

          <div>

            <label className="block mb-2 font-medium">
              Registration No.
            </label>

            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="Registration Number"
              className={inputClass("registration_number")}
            />

          </div>

        </div>

      </div>

            {/* ============================================================
          Address Information
      ============================================================ */}

      <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold text-slate-800">
            Address Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Primary communication address.
          </p>

        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-5">

          {/* Address 1 */}

          <div className="lg:col-span-2">

            <label className="block mb-2 font-medium">
              Address Line 1
            </label>

            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              placeholder="Door No, Street"
              className={inputClass("address_line1")}
            />

          </div>

          {/* Address 2 */}

          <div className="lg:col-span-2">

            <label className="block mb-2 font-medium">
              Address Line 2
            </label>

            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              placeholder="Area / Landmark"
              className={inputClass("address_line2")}
            />

          </div>

          {/* City */}

          <div>

            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass("city")}
            />

          </div>

          {/* District */}

          <div>

            <label className="block mb-2 font-medium">
              District
            </label>

            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={inputClass("district")}
            />

          </div>

          {/* State */}

          <div>

            <label className="block mb-2 font-medium">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={inputClass("state")}
            />

          </div>

          {/* Country */}

          <div>

            <label className="block mb-2 font-medium">
              Country
            </label>

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass("country")}
            />

          </div>

          {/* Pincode */}

          <div>

            <label className="block mb-2 font-medium">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="522001"
              className={inputClass("pincode")}
            />

            {errors.pincode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.pincode}
              </p>
            )}

          </div>

        </div>

      </div>
      {/* ============================================================
          Communication Preferences
      ============================================================ */}

      <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold text-slate-800">
            Communication Preferences
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Select the preferred method for contacting the donor.
          </p>

        </div>

        <div className="p-6">

          <label className="block mb-2 font-medium">
            Preferred Communication
          </label>

          <select
            name="preferred_communication"
            value={formData.preferred_communication}
            onChange={handleChange}
            className={inputClass("preferred_communication")}
          >

            <option value="PHONE">
              📞 Phone Call
            </option>

            <option value="SMS">
              💬 SMS
            </option>

            <option value="WHATSAPP">
              🟢 WhatsApp
            </option>

            <option value="EMAIL">
              📧 Email
            </option>

          </select>

        </div>

      </div>

            {/* ============================================================
          Remarks & Status
      ============================================================ */}

      <div className="bg-white rounded-2xl border shadow-sm">

        <div className="border-b px-6 py-4">

          <h2 className="text-lg font-semibold text-slate-800">
            Additional Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Internal remarks and donor status.
          </p>

        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-6">

          {/* Status */}

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass("status")}
            >

              <option value="ACTIVE">
                ✅ Active
              </option>

              <option value="INACTIVE">
                ❌ Inactive
              </option>

            </select>

          </div>

          {/* Remarks */}

          <div className="lg:col-span-2">

            <label className="block mb-2 font-medium">
              Remarks
            </label>

            <textarea
              rows={5}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks about this donor..."
              className={inputClass("remarks")}
            />

          </div>

        </div>

      </div>
      {/* ============================================================
          Form Actions
      ============================================================ */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">

        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate("/admin/donors")}
            className="
              px-6
              py-3
              rounded-xl
              border
              bg-white
              hover:bg-gray-50
              flex
              items-center
              gap-2
            "
          >

            <FaTimes />

            Cancel

          </button>

          <button
            type="submit"
            disabled={submitting}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              text-white
              flex
              items-center
              gap-2
            "
          >

            <FaSave />

            {submitting
              ? "Saving..."
              : submitLabel}

          </button>

        </div>

      </div>

    </form>

  );

}

export default DonorForm;