import FormSection from "../common/FormSection";
import FormFileInput from "../common/FormFileInput";

import scholarshipDocuments from "../../data/scholarshipDocuments";

function DocumentUpload({
  formData,
  setFormData,
  errors,
}) {

  const handleFileChange = (e) => {

    const { name } = e.target;

    const file = e.target.files[0];

    setFormData((prev) => ({

      ...prev,

      documents: {

        ...prev.documents,

        [name]: file,

      },

    }));

  };

  return (

    <FormSection title="Upload Documents">

      <div className="grid gap-6">

        {scholarshipDocuments.map((document) => (

          <FormFileInput
            key={document.id}
            label={document.label}
            name={document.name}
            accept={document.accept}
            required={document.required}
            onChange={handleFileChange}
            error={errors[document.name]}
          />

        ))}

      </div>

    </FormSection>

  );

}

export default DocumentUpload;