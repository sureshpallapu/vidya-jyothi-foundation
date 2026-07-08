import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";

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

  return (
    <FormSection title="Education Details">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="College Name"
          name="collegeName"
          value={formData.collegeName}
          onChange={handleChange}
          placeholder="Enter College Name"
          required
          error={errors.collegeName}
        />

        <FormInput
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="Example: B.Tech, B.Sc, Degree"
          required
          error={errors.course}
        />

        <FormInput
          label="Study Year"
          name="studyYear"
          value={formData.studyYear}
          onChange={handleChange}
          placeholder="Example: 1st Year"
          required
          error={errors.studyYear}
        />

        <FormInput
          label="Previous Qualification"
          name="previousQualification"
          value={formData.previousQualification}
          onChange={handleChange}
          placeholder="Example: Intermediate"
          required
          error={errors.previousQualification}
        />

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