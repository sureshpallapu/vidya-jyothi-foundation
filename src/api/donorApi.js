import api from "./axios"; // your axios instance

const BASE_URL = "/fundraising/donor-master";

/*
|--------------------------------------------------------------------------
| Donors
|--------------------------------------------------------------------------
*/
export const getDonor = (donorCode) =>
  api.get(`${BASE_URL}/${donorCode}`);


export const getDonors = (params = {}) =>
  api.get(BASE_URL, { params });

export const getDonorByCode = (donorCode) =>
  api.get(`${BASE_URL}/${donorCode}`);

export const createDonor = (data) =>
  api.post(BASE_URL, data);

export const updateDonor = (donorCode, data) =>
  api.put(`${BASE_URL}/${donorCode}`, data);

export const archiveDonor = (donorCode) =>
  api.patch(`${BASE_URL}/${donorCode}/archive`);

export const restoreDonor = (donorCode) =>
  api.patch(`${BASE_URL}/${donorCode}/restore`);

/*
|--------------------------------------------------------------------------
| Donor Types
|--------------------------------------------------------------------------
*/

export const getDonorTypes = () =>
  api.get(`${BASE_URL}/types`);