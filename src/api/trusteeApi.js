import axios from "axios";

const API_URL = "http://localhost:5000/api/trustees";

/*
|--------------------------------------------------------------------------
| Get All Trustees
|--------------------------------------------------------------------------
*/
export const getTrustees = () => {
  return axios.get(API_URL);
};

/*
|--------------------------------------------------------------------------
| Get Single Trustee
|--------------------------------------------------------------------------
*/
export const getTrusteeById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

/*
|--------------------------------------------------------------------------
| Create Trustee
|--------------------------------------------------------------------------
*/
export const createTrustee = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Trustee
|--------------------------------------------------------------------------
*/
export const updateTrustee = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/*
|--------------------------------------------------------------------------
| Activate / Deactivate Trustee
|--------------------------------------------------------------------------
*/
export const updateTrusteeStatus = (id, isActive) => {
  return axios.patch(`${API_URL}/${id}/status`, {
    is_active: isActive,
  });
};

/*
|--------------------------------------------------------------------------
| Get Public Trustees
|--------------------------------------------------------------------------
*/
export const getPublicTrustees = () => {
  return axios.get(`${API_URL}/public`);
};