import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";

function Declaration({
  formData,
  setFormData,
  errors,
}) {

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };

  return (

    <FormSection title="Declaration">

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">

        <p className="leading-8 text-gray-700">

          I hereby declare that the information furnished in this scholarship application is true and correct to the best of my knowledge. I understand that if any information provided is found to be false, incomplete, or misleading, my application may be rejected or cancelled at any stage.

        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <FormInput
          label="Place"
          name="studentPlace"
          value={formData.studentPlace}
          onChange={handleChange}
          placeholder="Enter Place"
          required
          error={errors.studentPlace}
        />

        <FormInput
          label="Date"
          type="date"
          name="studentDate"
          value={formData.studentDate}
          onChange={handleChange}
          required
          error={errors.studentDate}
        />

      </div>

      <div className="mt-8">

        <label className="flex items-start gap-3">

          <input
            type="checkbox"
            name="declarationAccepted"
            checked={formData.declarationAccepted}
            onChange={handleChange}
            className="mt-1 h-5 w-5"
          />

          <span>

            I agree to the above declaration and certify that all the information submitted is true.

          </span>

        </label>

        {errors.declarationAccepted && (

          <p className="text-red-500 mt-2">

            {errors.declarationAccepted}

          </p>

        )}

      </div>

    </FormSection>

  );

}

export default Declaration;