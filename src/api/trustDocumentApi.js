import axios from "axios";

const API_URL = "http://localhost:5000/api/trust-documents";

// ============================
// Dashboard
// ============================

export const getDocumentStatistics = () =>
  axios.get(`${API_URL}/statistics`);

// ============================
// Categories
// ============================

export const getDocumentCategories = () =>
  axios.get(`${API_URL}/categories`);

// ============================
// Documents
// ============================

export const getDocuments = () =>
  axios.get(API_URL);

export const getDocument = (id) =>
  axios.get(`${API_URL}/${id}`);

// ============================
// Upload
// ============================

export const createDocument = (formData) =>
  axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ============================
// Update
// ============================

export const updateDocument = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ============================
// Replace File
// ============================

export const replaceDocument = (id, formData) =>
  axios.put(`${API_URL}/${id}/replace`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ============================
// Archive
// ============================

export const archiveDocument = (id) =>
  axios.put(`${API_URL}/${id}/archive`);

// ============================
// Download
// ============================

export const downloadDocument = (id) =>
  axios.get(`${API_URL}/${id}/download`, {
    responseType: "blob",
  });

// ============================
// Preview
// ============================

export const previewDocument = (id) =>
  `${API_URL}/${id}/preview`;