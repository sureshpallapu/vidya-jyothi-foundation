import { useEffect } from "react";
import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";

function Declaration({
  formData,
  setFormData,
  errors,
}) {
  /*
  |--------------------------------------------------------------------------
  | Set Today's Date Automatically
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    // Get today's date in local timezone as YYYY-MM-DD
    const now = new Date();

    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    // Always use today's date for the declaration
    setFormData((prev) => ({
      ...prev,
      studentDate: today,
    }));
  }, [setFormData]);

  /*
  |--------------------------------------------------------------------------
  | Handle Input Changes
  |--------------------------------------------------------------------------
  */

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
      {/* Declaration Message */}

      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6">
        <p className="leading-8 text-gray-700">
          I hereby declare that the information furnished in this
          scholarship application is true and correct to the best of my
          knowledge. I understand that if any information provided is
          found to be false, incomplete, or misleading, my application
          may be rejected or cancelled at any stage.
        </p>
      </div>

      {/* Place and Date */}

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

        {/* Automatic Declaration Date */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Declaration Date
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="relative">
            <input
              type="date"
              name="studentDate"
              value={formData.studentDate || ""}
              readOnly
              className="
                w-full
                px-4
                py-3
                border
                border-gray-300
                rounded-lg
                bg-gray-100
                text-gray-700
                cursor-not-allowed
                outline-none
              "
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Today's date is automatically selected and cannot be changed.
          </p>

          {errors.studentDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.studentDate}
            </p>
          )}
        </div>
      </div>

      {/* Declaration Acceptance */}

      <div className="mt-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="declarationAccepted"
            checked={formData.declarationAccepted || false}
            onChange={handleChange}
            className="mt-1 h-5 w-5 cursor-pointer"
          />

          <span className="text-gray-700 leading-6">
            I agree to the above declaration and certify that all the
            information submitted is true.
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