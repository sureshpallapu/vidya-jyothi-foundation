import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaHandHoldingHeart } from "react-icons/fa";

import DonorForm from "../../../components/admin/donors/DonorForm";
import { createDonor } from "../../../api/donorApi";

function AddDonor() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    donor_type_id: "",

    full_name: "",
    display_name: "",

    mobile: "",
    alternate_mobile: "",

    email: "",
    website: "",

    pan_number: "",
    aadhaar_number: "",
    gst_number: "",
    registration_number: "",

    address_line1: "",
    address_line2: "",

    city: "",
    district: "",
    state: "Andhra Pradesh",
    country: "India",
    pincode: "",

    preferred_communication: "PHONE",

    remarks: "",

    status: "ACTIVE",
  });

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.donor_type_id) {
      newErrors.donor_type_id = "Donor Type is required.";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10 digit mobile number.";
    }

    if (
      formData.email &&
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email.";
    }

    if (
      formData.aadhaar_number &&
      !/^\d{12}$/.test(formData.aadhaar_number)
    ) {
      newErrors.aadhaar_number =
        "Aadhaar Number must contain 12 digits.";
    }

    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.pan_number)
    ) {
      newErrors.pan_number = "Invalid PAN Number.";
    }

    if (
      formData.website &&
      !/^https?:\/\/.+/i.test(formData.website)
    ) {
      newErrors.website =
        "Website should start with http:// or https://";
    }

    if (
      formData.pincode &&
      !/^\d{6}$/.test(formData.pincode)
    ) {
      newErrors.pincode = "Invalid Pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await createDonor(formData);

      await Swal.fire({
        icon: "success",
        title: "Donor Created",
        text: "The donor has been created successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/donors");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Create Donor",
        text:
          error.response?.data?.message ||
          "Failed to create donor.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <style>{`
        @keyframes fadeInUp{
          from{opacity:0;transform:translateY(15px);}
          to{opacity:1;transform:translateY(0);}
        }

        @keyframes popIn{
          from{opacity:0;transform:scale(.8);}
          to{opacity:1;transform:scale(1);}
        }
      `}</style>

      {/* Header */}

      <div className="flex items-center gap-4 animate-[fadeInUp_.4s_ease-out]">

        <button
          type="button"
          onClick={() => navigate("/admin/donors")}
          className="w-11 h-11 rounded-xl border bg-white hover:bg-gray-50 flex items-center justify-center"
        >
          <FaArrowLeft />
        </button>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center animate-[popIn_.4s_ease-out]">
            <FaHandHoldingHeart className="text-blue-600" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Add Donor
            </h1>

            <p className="text-gray-500">
              Register a new donor for the trust.
            </p>

          </div>

        </div>

      </div>

      <DonorForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Create Donor"
      />

    </div>
  );
}

export default AddDonor;