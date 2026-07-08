import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSection from "../common/FormSection";

function AddressDetails({
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
    <FormSection title="Address Details">

      <div className="grid grid-cols-1 gap-6">

        <FormTextarea
          label="Complete Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter complete residential address"
          rows={4}
          required
          error={errors.address}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <FormInput
          label="District"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="Enter District"
          required
          error={errors.district}
        />

        <FormInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Enter State"
          required
          error={errors.state}
        />

        <FormInput
          label="PIN Code"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter PIN Code"
          maxLength={6}
          required
          error={errors.pincode}
        />

      </div>

    </FormSection>
  );
}

export default AddressDetails;