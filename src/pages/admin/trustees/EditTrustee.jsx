import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUserEdit, FaSpinner } from "react-icons/fa";

import TrusteeForm from "../../../components/admin/trustees/TrusteeForm";
import { getTrusteeById, updateTrustee } from "../../../api/trusteeApi";

function EditTrustee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    trustee_code: "",
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
    state: "",
    pincode: "",

    designation: "",
    joined_date: "",
    tenure_start_date: "",
    tenure_end_date: "",

    profession: "",
    qualification: "",

    profile_image: null,
    existing_profile_image: "",

    short_bio: "",

    display_order: 0,
    show_on_website: true,
    is_active: true,
  });

  /*
  |--------------------------------------------------------------------------
  | Format Date for HTML Date Input
  |--------------------------------------------------------------------------
  */
  const formatDateForInput = (date) => {
    if (!date) return "";
    return String(date).split("T")[0];
  };

  /*
  |--------------------------------------------------------------------------
  | Load Existing Trustee
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const loadTrustee = async () => {
      try {
        setLoading(true);

        const response = await getTrusteeById(id);
        const trustee = response.data.data;

        if (!trustee) {
          throw new Error("Trustee not found.");
        }

        setFormData({
          trustee_code: trustee.trustee_code || "",
          full_name: trustee.full_name || "",
          father_or_spouse_name: trustee.father_or_spouse_name || "",
          date_of_birth: formatDateForInput(trustee.date_of_birth),
          gender: trustee.gender || "",

          mobile_number: trustee.mobile_number || "",
          alternate_mobile_number: trustee.alternate_mobile_number || "",
          email: trustee.email || "",

          aadhaar_number: trustee.aadhaar_number || "",
          pan_number: trustee.pan_number || "",

          address_line1: trustee.address_line1 || "",
          address_line2: trustee.address_line2 || "",
          city: trustee.city || "",
          district: trustee.district || "",
          state: trustee.state || "",
          pincode: trustee.pincode || "",

          designation: trustee.designation || "",
          joined_date: formatDateForInput(trustee.joined_date),
          tenure_start_date: formatDateForInput(trustee.tenure_start_date),
          tenure_end_date: formatDateForInput(trustee.tenure_end_date),

          profession: trustee.profession || "",
          qualification: trustee.qualification || "",

          // profile_image stays null:
          // - No new file selected -> backend keeps old photo.
          // - New file selected -> backend replaces old photo.
          profile_image: null,
          existing_profile_image: trustee.profile_image || "",

          short_bio: trustee.short_bio || "",

          display_order: trustee.display_order ?? 0,
          show_on_website: Number(trustee.show_on_website) === 1,
          is_active: Number(trustee.is_active) === 1,
        });
      } catch (error) {
        console.error("Load trustee error:", error);

        await Swal.fire({
          icon: "error",
          title: "Unable to Load Trustee",
          text:
            error.response?.data?.message ||
            "Failed to load trustee details.",
        });

        navigate("/admin/trustees");
      } finally {
        setLoading(false);
      }
    };

    loadTrustee();
  }, [id, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Validate Form
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

    if (
      formData.tenure_start_date &&
      formData.tenure_end_date &&
      formData.tenure_end_date < formData.tenure_start_date
    ) {
      newErrors.tenure_end_date =
        "Tenure end date cannot be before tenure start date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | Update Trustee
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // Profile Image — only append when a NEW file was selected;
        // otherwise the backend preserves the existing photo.
        if (key === "profile_image") {
          if (value instanceof File) {
            data.append("profile_image", value);
          }
          return;
        }

        // Frontend-only field, not sent to the backend.
        if (key === "existing_profile_image") {
          return;
        }

        if (typeof value === "boolean") {
          data.append(key, value ? "1" : "0");
          return;
        }

        data.append(key, value ?? "");
      });

      await updateTrustee(id, data);

      await Swal.fire({
        icon: "success",
        title: "Trustee Updated",
        text: "Trustee information has been updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate(`/admin/trustees/${id}`);
    } catch (error) {
      console.error("Update trustee error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Update Trustee",
        text: error.response?.data?.message || "Failed to update trustee.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <FaSpinner className="animate-spin text-3xl text-violet-500 mb-4" />
        <p className="font-medium">Loading trustee details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(`/admin/trustees/${id}`)}
          title="Back to Trustee"
          className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center">
            <FaUserEdit className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Edit Trustee
            </h1>
            <p className="text-gray-500 mt-1">
              Update trustee information, profile and website settings.
            </p>
          </div>
        </div>
      </div>

      {/* Trustee Form */}
      <TrusteeForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Update Trustee"
        isEdit
      />
    </div>
  );
}

export default EditTrustee;