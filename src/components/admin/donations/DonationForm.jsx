import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave, FaTimes } from "react-icons/fa";

import { getDonors } from "../../../api/donorApi";
import {
  getDonationTypes,
  getPaymentModes,
  createDonation,
} from "../../../api/donationApi";

/*
|--------------------------------------------------------------------------
| Financial Year Helper
|--------------------------------------------------------------------------
| India's financial year runs April -> March. Given a donation date,
| returns a string like "2026-27".
*/

const computeFinancialYear = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12

  const startYear = month >= 4 ? year : year - 1;
  const endYear = (startYear + 1) % 100;

  return `${startYear}-${String(endYear).padStart(2, "0")}`;
};

const today = () => new Date().toISOString().split("T")[0];

const INITIAL_FORM = {
  donor_id: "",
  donation_date: today(),
  donation_type_id: "",
  payment_mode_id: "",
  amount: "",
  financial_year: computeFinancialYear(today()),
  reference_number: "",
  cheque_number: "",
  cheque_date: "",
  bank_name: "",
  branch_name: "",
  transaction_id: "",
  upi_reference: "",
  remarks: "",
  is_anonymous: false,
  receipt_required: true,
  tax_exemption: true,
};

export default function DonationForm({
  editMode = false,
  initialValues = null,
  onSubmit,
}) {  const navigate = useNavigate();

  /* ==========================================================
      State
  ========================================================== */

  const [donors, setDonors] = useState([]);
  
  
  const anonymousDonor = useMemo(() => {
    return donors.find(
        donor => donor.donor_type_id === 6
    ) || null;
}, [donors]);const [donationTypes, setDonationTypes] = useState([]);
const [previousDonor, setPreviousDonor] = useState(null);

console.log("Anonymous Donor:", anonymousDonor);

  const [paymentModes, setPaymentModes] = useState([]);

  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
useEffect(() => {

  if (!editMode || !initialValues) return;

  setFormData({
    donor_id: initialValues.donor_id || "",
    donation_date: initialValues.donation_date
      ? initialValues.donation_date.substring(0, 10)
      : today(),

    donation_type_id: initialValues.donation_type_id || "",
    payment_mode_id: initialValues.payment_mode_id || "",
    amount: initialValues.amount || "",
    financial_year:
      initialValues.financial_year ||
      computeFinancialYear(today()),

    reference_number: initialValues.reference_number || "",
    cheque_number: initialValues.cheque_number || "",
    cheque_date: initialValues.cheque_date
      ? initialValues.cheque_date.substring(0, 10)
      : "",

    bank_name: initialValues.bank_name || "",
    branch_name: initialValues.branch_name || "",
    transaction_id: initialValues.transaction_id || "",
    upi_reference: initialValues.upi_reference || "",
    remarks: initialValues.remarks || "",

    is_anonymous: Boolean(initialValues.is_anonymous),
    receipt_required: Boolean(initialValues.receipt_required),
    tax_exemption: Boolean(initialValues.tax_exemption),
  });

}, [editMode, initialValues]);


  
  /* ==========================================================
      Load Lookups
  ========================================================== */

  useEffect(() => {
  const loadLookups = async () => {
    try {
      setLoadingLookups(true);

      const [donorsRes, typesRes, modesRes] = await Promise.all([
        getDonors(),
        getDonationTypes(),
        getPaymentModes(),
      ]);

      

setDonors(donorsRes?.data?.data?.data || []);

setDonationTypes(typesRes?.data?.data || []);

setPaymentModes(modesRes?.data?.data || []);
    } catch (error) {
      console.error("Unable to load form data", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Form",
        text: "Some dropdown data could not be loaded. Please refresh.",
      });
    } finally {
      setLoadingLookups(false);
    }
  };

  loadLookups();
}, []);

  /* ==========================================================
      Derived: Selected Payment Mode
  ========================================================== */

  const selectedPaymentMode = useMemo(() => {
    return paymentModes.find(
      (mode) => String(mode.id) === String(formData.payment_mode_id)
    );
  }, [paymentModes, formData.payment_mode_id]);

  const modeName = (selectedPaymentMode?.mode_name || "").toLowerCase();

  const showChequeFields = modeName.includes("cheque");
  const showBankFields =
    modeName.includes("cheque") ||
    modeName.includes("bank") ||
    modeName.includes("neft") ||
    modeName.includes("rtgs");
  const showTransactionId =
    modeName.includes("bank") ||
    modeName.includes("neft") ||
    modeName.includes("rtgs") ||
    modeName.includes("online") ||
    modeName.includes("card");
  const showUpiReference = modeName.includes("upi");

  /* ==========================================================
      Handlers
  ========================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "donation_date") {
        next.financial_year = computeFinancialYear(value);
      }

      if (name === "payment_mode_id") {
        next.cheque_number = "";
        next.cheque_date = "";
        next.bank_name = "";
        next.branch_name = "";
        next.transaction_id = "";
        next.upi_reference = "";
        next.reference_number = "";
      }

      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Switching payment mode resets cheque/bank/UPI/transaction fields
    // above, so any errors already shown against those fields are stale
    // and must be cleared too - otherwise a "required" message can keep
    // showing under a field the new mode doesn't even need anymore.
    if (name === "payment_mode_id") {
      setErrors((prev) => {
        const cleared = { ...prev };

        delete cleared.cheque_number;
        delete cleared.cheque_date;
        delete cleared.bank_name;
        delete cleared.branch_name;
        delete cleared.transaction_id;
        delete cleared.upi_reference;

        return cleared;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.donor_id) nextErrors.donor_id = "Donor is required.";
    if (!formData.donation_type_id)
      nextErrors.donation_type_id = "Donation type is required.";
    if (!formData.payment_mode_id)
      nextErrors.payment_mode_id = "Payment mode is required.";
    if (!formData.donation_date)
      nextErrors.donation_date = "Donation date is required.";
    if (!formData.amount || Number(formData.amount) <= 0)
      nextErrors.amount = "Enter a valid amount greater than 0.";

    // Cheque Validation
    if (showChequeFields) {
      if (!formData.cheque_number)
        nextErrors.cheque_number = "Cheque Number is required.";

      if (!formData.cheque_date)
        nextErrors.cheque_date = "Cheque Date is required.";
    }

    // Bank Validation
    if (showBankFields) {
      if (!formData.bank_name)
        nextErrors.bank_name = "Bank Name is required.";
    }

    // UPI Validation
    if (showUpiReference) {
      if (!formData.upi_reference)
        nextErrors.upi_reference = "UPI Reference is required.";
    }

    // Transaction Validation
    if (showTransactionId) {
      if (!formData.transaction_id)
        nextErrors.transaction_id = "Transaction ID is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

     const payload = {
  ...formData,

  donor_id: Number(formData.donor_id),
  donation_type_id: Number(formData.donation_type_id),
  payment_mode_id: Number(formData.payment_mode_id),
  amount: Number(formData.amount),

  reference_number: formData.reference_number || null,
  cheque_number: formData.cheque_number || null,
  cheque_date: formData.cheque_date || null,
  bank_name: formData.bank_name || null,
  branch_name: formData.branch_name || null,
  transaction_id: formData.transaction_id || null,
  upi_reference: formData.upi_reference || null,
  remarks: formData.remarks || null,
};

if (editMode) {

  await onSubmit(payload);

} else {

  const response = await createDonation(payload);

  Swal.fire({
    icon: "success",
    title: "Donation Saved",
    text: `Donation ${
      response?.data?.data?.donation_code || ""
    } recorded successfully.`,
    timer: 1800,
    showConfirmButton: false,
  });

  navigate("/admin/donations");

  return;
}
      Swal.fire({
        icon: "success",
        title: "Donation Saved",
        text: `Donation ${
          response?.data?.data?.donation_code || ""
        } recorded successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/donations");
    } catch (error) {

        console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
      const apiErrors = error.response?.data?.errors;

      if (Array.isArray(apiErrors) && apiErrors.length) {
        Swal.fire({
          icon: "error",
          title: "Validation Failed",
          html: apiErrors.map((msg) => `<p>${msg}</p>`).join(""),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unable to Save",
          text:
            error.response?.data?.message ||
            "Something went wrong while saving the donation.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================================
      Styles
  ========================================================== */

  const inputClass = (name) =>
    `w-full rounded-lg border px-4 py-2 outline-none transition ${
      errors[name]
        ? "border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
    }`;

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
    ) : null;

  /* ==========================================================
      Render
  ========================================================== */

  return (
    
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6"
    >
<h2 className="text-2xl font-bold mb-6">
  {editMode
    ? "Edit Donation"
    : "Add Donation"}
</h2>
      {/* ============================================================
          Basic Information
      ============================================================ */}
<div className="flex items-center justify-between mb-6">

    <div>

        <h1 className="text-3xl font-bold">

            {editMode ? "Edit Donation" : "Add Donation"}

        </h1>

        <p className="text-gray-500">

            {editMode
                ? `Donation Code : ${initialValues?.donation_code}`
                : "Create a new donation"}

        </p>

    </div>

    <div className="flex gap-3">

        <button
            type="button"
            onClick={() => navigate("/admin/donations")}
            className="border px-4 py-2 rounded-lg"
        >
            Back
        </button>

        {editMode && (
            <button
                type="button"
                onClick={() =>
                    navigate(`/admin/donations/${initialValues?.donation_code}`)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                View
            </button>
        )}

    </div>

</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Donor */}

        <div>
          <label className="block font-medium mb-2">
            Donor <span className="text-red-500">*</span>
          </label>

          <select
            name="donor_id"
            value={formData.donor_id}
            onChange={handleChange}
          disabled={loadingLookups || formData.is_anonymous}
            className={inputClass("donor_id")}
          >
            <option value="">
              {loadingLookups ? "Loading donors..." : "Select Donor"}
            </option>

            {donors
  .filter((donor) => donor.donor_type_id !== 6)
  .map((donor) => (
              <option key={donor.id} value={donor.id}>
                {donor.full_name} ({donor.donor_code})
              </option>
            ))}
           
          </select>
 {formData.is_anonymous && (
  <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3">
    <p className="text-sm text-blue-700">
      This donation will be recorded under <strong>Anonymous Donor</strong>.
      Donor selection is disabled while Anonymous Donation is enabled.
    </p>
  </div>
)}
          <FieldError name="donor_id" />
        </div>

        {/* Donation Date */}

        <div>
          <label className="block font-medium mb-2">Donation Date</label>

          <input
            type="date"
            name="donation_date"
            max={today()}
            value={formData.donation_date}
            onChange={handleChange}
            className={inputClass("donation_date")}
          />

          <FieldError name="donation_date" />
        </div>

        {/* Donation Type */}

        <div>
          <label className="block font-medium mb-2">
            Donation Type <span className="text-red-500">*</span>
          </label>

          <select
            name="donation_type_id"
            value={formData.donation_type_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className={inputClass("donation_type_id")}
          >
            <option value="">
              {loadingLookups
                ? "Loading donation types..."
                : "Select Donation Type"}
            </option>

            {donationTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type_name}
              </option>
            ))}
          </select>

          <FieldError name="donation_type_id" />
        </div>

        {/* Payment Mode */}

        <div>
          <label className="block font-medium mb-2">
            Payment Mode <span className="text-red-500">*</span>
          </label>

          <select
            name="payment_mode_id"
            value={formData.payment_mode_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className={inputClass("payment_mode_id")}
          >
            <option value="">
              {loadingLookups
                ? "Loading payment modes..."
                : "Select Payment Mode"}
            </option>

            {paymentModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.mode_name}
              </option>
            ))}
          </select>

          <FieldError name="payment_mode_id" />
        </div>

        {/* Amount */}

        <div>
          <label className="block font-medium mb-2">
            Amount <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            step="0.01"
            name="amount"
            min="1"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass("amount")}
          />

          <FieldError name="amount" />
        </div>

        {/* Financial Year */}

        <div>
          <label className="block font-medium mb-2">Financial Year</label>

          <input
            readOnly
            value={formData.financial_year}
            className="w-full bg-gray-100 border rounded-lg px-4 py-2 text-gray-600"
          />
        </div>
      </div>

      {/* ============================================================
          Payment Details (mode-specific)
      ============================================================ */}

      <div className="mt-8 border rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-5">Payment Details</h3>

        {!formData.payment_mode_id ? (
          <p className="text-sm text-gray-500">
            Select a payment mode above to enter its details.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reference Number - always available */}

            <div>
              <label className="block font-medium mb-2">
                Reference Number
              </label>

              <input
                type="text"
                name="reference_number"
                value={formData.reference_number}
                onChange={handleChange}
                placeholder="Transaction / Receipt Reference"
                className={inputClass("reference_number")}
              />
              <FieldError name="reference_number" />
            </div>

            {showTransactionId && (
              <div>
                <label className="block font-medium mb-2">
                  Transaction ID
                </label>

                <input
                  type="text"
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleChange}
                  className={inputClass("transaction_id")}
                />
                <FieldError name="transaction_id" />
              </div>
            )}

            {showUpiReference && (
              <div>
                <label className="block font-medium mb-2">
                  UPI Reference
                </label>

                <input
                  type="text"
                  name="upi_reference"
                  value={formData.upi_reference}
                  onChange={handleChange}
                  className={inputClass("upi_reference")}
                />
                <FieldError name="upi_reference" />
              </div>
            )}

            {showChequeFields && (
              <>
                <div>
                  <label className="block font-medium mb-2">
                    Cheque Number
                  </label>

                  <input
                    type="text"
                    name="cheque_number"
                    value={formData.cheque_number}
                    onChange={handleChange}
                    className={inputClass("cheque_number")}
                  />
                  <FieldError name="cheque_number" />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Cheque Date
                  </label>

                  <input
                    type="date"
                    name="cheque_date"
                    value={formData.cheque_date}
                    onChange={handleChange}
                    className={inputClass("cheque_date")}
                  />
                  <FieldError name="cheque_date" />
                </div>
              </>
            )}

            {showBankFields && (
              <>
                <div>
                  <label className="block font-medium mb-2">
                    Bank Name
                  </label>

                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className={inputClass("bank_name")}
                  />
                  <FieldError name="bank_name" />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Branch Name
                  </label>

                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    className={inputClass("branch_name")}
                  />
                  <FieldError name="branch_name" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
          Additional Information
      ============================================================ */}

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-5">
          Additional Information
        </h3>

        <label className="block font-medium mb-2">Remarks</label>

        <textarea
          rows="4"
          maxLength={500}
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Optional remarks about this donation..."
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
        />
        <div className="text-right text-sm text-gray-500">
          {formData.remarks.length}/500
        </div>

        <div className="flex flex-wrap gap-8 mt-5">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
onChange={(e) => {
  const checked = e.target.checked;

  if (checked) {
    // Remember current donor
    setPreviousDonor(formData.donor_id);

    setFormData((prev) => ({
      ...prev,
      is_anonymous: true,
      donor_id: anonymousDonor?.id || "",
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      is_anonymous: false,
      donor_id: previousDonor || "",
    }));
  }
}}            />
            Anonymous Donation
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="receipt_required"
              checked={formData.receipt_required}
              onChange={handleChange}
            />
            Receipt Required
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="tax_exemption"
              checked={formData.tax_exemption}
              onChange={handleChange}
            />
            Tax Exemption
          </label>
        </div>
      </div>

      {/* ============================================================
          Buttons
      ============================================================ */}

      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          onClick={() => navigate("/admin/donations")}
          className="px-6 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <FaTimes />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition"
        >
          <FaSave />
{submitting
  ? (editMode ? "Updating..." : "Saving...")
  : (editMode ? "Update Donation" : "Save Donation")}        </button>
      </div>
    
    </form>
  );
}