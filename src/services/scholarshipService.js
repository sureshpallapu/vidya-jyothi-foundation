import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createScholarshipApplication = (data) => {
  return API.post("/scholarship/apply", data);
};

export const uploadScholarshipDocuments = (
  applicationId,
  formData
) => {
  return API.post(
    `/scholarship/${applicationId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};