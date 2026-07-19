import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";

import TrusteeForm from "../../../components/admin/trustees/TrusteeForm";
import { createTrustee } from "../../../api/trusteeApi";

function AddTrustee() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    father_or_spouse_name: "",
    date_of_birth: "",
    gender: "",

    mobile_number: "",
    alternate_mobile_number: "",
    email: "",

    aadhaar_number: "",
    pan_number: "",

    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    state: "Andhra Pradesh",
    pincode: "",

    designation: "",
    joined_date: "",
    tenure_start_date: "",
    tenure_end_date: "",

    profession: "",
    qualification: "",

    profile_image: null,
    short_bio: "",

    display_order: 0,
    show_on_website: true,
    is_active: true,
  });

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Enter a valid 10 digit mobile number.";
    }

    if (!formData.designation) {
      newErrors.designation = "Designation is required.";
    }

    if (
      formData.aadhaar_number &&
      !/^\d{12}$/.test(formData.aadhaar_number)
    ) {
      newErrors.aadhaar_number = "Aadhaar number must contain 12 digits.";
    }

    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.pan_number)
    ) {
      newErrors.pan_number = "Enter a valid PAN number.";
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

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profile_image") {
          if (value instanceof File) {
            data.append(key, value);
          }
          return;
        }

        if (typeof value === "boolean") {
          data.append(key, value ? "1" : "0");
          return;
        }

        data.append(key, value ?? "");
      });

      await createTrustee(data);

      await Swal.fire({
        icon: "success",
        title: "Trustee Created",
        text: "The trustee has been added successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/trustees");
    } catch (error) {
      console.error("Create trustee error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Create Trustee",
        text: error.response?.data?.message || "Failed to create trustee.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8) rotate(-6deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>

      <div className="flex items-center gap-4 animate-[fadeInUp_0.4s_ease-out]">
        <button
          type="button"
          onClick={() => navigate("/admin/trustees")}
          title="Back to Trustees"
          className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-90 flex items-center justify-center transition-all duration-150"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center animate-[popIn_0.4s_ease-out_0.1s_backwards]">
            <FaUserPlus className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Add Trustee
            </h1>
            <p className="text-gray-500 mt-1">
              Create a new trustee profile and configure website visibility.
            </p>
          </div>
        </div>
      </div>

      <TrusteeForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Create Trustee"
      />
    </div>
  );
}

export default AddTrustee;