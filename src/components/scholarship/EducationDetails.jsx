import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";


import {
  COURSES,
  STUDY_YEARS,
  QUALIFICATIONS,
} from "../../data/educationOptions";

import { toTitleCase } from "../../utils/textFormatter";


function EducationDetails({
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

  const handleBlur = (e) => {

  const { name, value } = e.target;

  /*
  |--------------------------------------------------------------------------
  | Convert Selected Fields to Title Case
  |--------------------------------------------------------------------------
  */

  if (name === "collegeName") {

    setFormData((prev) => ({

      ...prev,

      [name]: toTitleCase(value),

    }));

  }

};

  return (
    <FormSection title="Education Details">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
  label="College Name"
  name="collegeName"
  value={formData.collegeName}
  onChange={handleChange}
  onBlur={handleBlur}
  placeholder="Enter College Name"
  required
  error={errors.collegeName}
/>

        <div>

  <label className="block mb-2 font-medium">

    Course <span className="text-red-500">*</span>

  </label>

  <select
    name="course"
    value={formData.course}
    onChange={handleChange}
    className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors.course
        ? "border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
    }`}
  >

    <option value="">

      Select Course

    </option>

    {COURSES.map((course) => (

      <option
        key={course}
        value={course}
      >

        {course}

      </option>

    ))}

  </select>

  {errors.course && (

    <p className="text-red-500 text-sm mt-1">

      {errors.course}

    </p>

  )}

</div>

        <div>

  <label className="block mb-2 font-medium">

    Study Year <span className="text-red-500">*</span>

  </label>

  <select
    name="studyYear"
    value={formData.studyYear}
    onChange={handleChange}
    className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors.studyYear
        ? "border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
    }`}
  >

    <option value="">

      Select Study Year

    </option>

    {STUDY_YEARS.map((year) => (

      <option
        key={year}
        value={year}
      >

        {year}

      </option>

    ))}

  </select>

  {errors.studyYear && (

    <p className="text-red-500 text-sm mt-1">

      {errors.studyYear}

    </p>

  )}

</div>

     <div>

  <label className="block mb-2 font-medium">

    Previous Qualification <span className="text-red-500">*</span>

  </label>

  <select
    name="previousQualification"
    value={formData.previousQualification}
    onChange={handleChange}
    className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors.previousQualification
        ? "border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
    }`}
  >

    <option value="">

      Select Previous Qualification

    </option>

    {QUALIFICATIONS.map((qualification) => (

      <option
        key={qualification}
        value={qualification}
      >

        {qualification}

      </option>

    ))}

  </select>

  {errors.previousQualification && (

    <p className="text-red-500 text-sm mt-1">

      {errors.previousQualification}

    </p>

  )}

</div>
        <FormInput
          label="Previous Percentage"
          name="previousPercentage"
          type="number"
          value={formData.previousPercentage}
          onChange={handleChange}
          placeholder="Example: 89.50"
          required
          error={errors.previousPercentage}
        />

      </div>

    </FormSection>
  );
}

export default EducationDetails;