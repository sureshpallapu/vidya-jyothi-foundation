import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const submitApplication = (data) =>
  API.post("/scholarship/apply", data);

export const uploadDocuments = (
  applicationId,
  formData
) =>
  API.post(
    `/scholarship/${applicationId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const uploadScholarshipDocuments = (applicationId, formData) =>
  API.post(
    `/scholarship/${applicationId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const checkApplicationStatus = (data) =>
  API.post(
    "/scholarship/status",
    data
  );