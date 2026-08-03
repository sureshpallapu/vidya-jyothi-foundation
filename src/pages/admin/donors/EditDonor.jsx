import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import DonorForm from "../../../components/admin/donors/DonorForm";

import {
  getDonorByCode,
  updateDonor,
} from "../../../api/donorApi";

function EditDonor() {

  const navigate = useNavigate();
  const { donorCode } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    donor_type: "Individual",

    full_name: "",
    organization_name: "",

    mobile: "",
    alternate_mobile: "",
    email: "",

    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    state: "Andhra Pradesh",
    pincode: "",

    pan_number: "",
    aadhaar_number: "",
    gst_number: "",

    date_of_birth: "",

    status: "ACTIVE",

    remarks: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Load Donor
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadDonor();

  }, [donorCode]);

  const loadDonor = async () => {

    try {

      setLoading(true);

      const response = await getDonorByCode(donorCode);

      setFormData(response.data.data);

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Unable to Load Donor",
        text:
          error.response?.data?.message ||
          "Failed to fetch donor.",
      });

      navigate("/admin/donors");

    } finally {

      setLoading(false);

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {

    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
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

      await updateDonor(donorCode, formData);

      await Swal.fire({
        icon: "success",
        title: "Donor Updated",
        text: "Donor details updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/donors");

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Unable to update donor.",
      });

    } finally {

      setSubmitting(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10 text-center text-gray-500">
        Loading donor...
      </div>
    );

  }

  return (

    <div className="p-8 space-y-6">

      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={() => navigate("/admin/donors")}
          className="w-11 h-11 rounded-xl border bg-white hover:bg-gray-50 flex items-center justify-center"
        >
          <FaArrowLeft />
        </button>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">

            <FaEdit className="text-yellow-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              Edit Donor
            </h1>

            <p className="text-gray-500">
              Update donor information.
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
        submitLabel="Update Donor"
      />

    </div>

  );

}

export default EditDonor;