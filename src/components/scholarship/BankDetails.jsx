import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";

function BankDetails({
  formData,
  setFormData,
  errors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormSection title="Bank Details">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Enter Bank Name"
          required
          error={errors.bankName}
        />

        <FormInput
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter Account Number"
          required
          error={errors.accountNumber}
        />

        <FormInput
          label="Confirm Account Number"
          name="confirmAccountNumber"
          value={formData.confirmAccountNumber}
          onChange={handleChange}
          placeholder="Re-enter Account Number"
          required
          error={errors.confirmAccountNumber}
        />

        <FormInput
          label="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="Example: SBIN0001234"
          required
          error={errors.ifscCode}
        />

      </div>

    </FormSection>
  );
}

export default BankDetails;