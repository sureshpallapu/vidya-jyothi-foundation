import api from "./axios";

const BASE_URL = "/fundraising/donations";

/*
|--------------------------------------------------------------------------
| Donations
|--------------------------------------------------------------------------
*/

export const getDonations = (params = {}) =>
  api.get(BASE_URL, { params });

export const getDonation = (donationCode) =>
  api.get(`${BASE_URL}/${donationCode}`);

export const createDonation = (data) =>
  api.post(BASE_URL, data);

export const updateDonation = (donationCode, data) =>
  api.put(`${BASE_URL}/${donationCode}`, data);

/*
|--------------------------------------------------------------------------
| Status Actions
|--------------------------------------------------------------------------
*/

export const cancelDonation = (donationCode) =>
  api.patch(`${BASE_URL}/${donationCode}/cancel`);

export const archiveDonation = (donationCode) =>
  api.patch(`${BASE_URL}/${donationCode}/archive`);

export const restoreDonation = (donationCode) =>
  api.patch(`${BASE_URL}/${donationCode}/restore`);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getDonationStatistics = () =>
  api.get(`${BASE_URL}/statistics`);



export const getDonationTypes = () =>
  api.get(`${BASE_URL}/master/donation-types`);

export const getPaymentModes = () =>
  api.get(`${BASE_URL}/master/payment-modes`);

/*
|--------------------------------------------------------------------------
| Donor History
|--------------------------------------------------------------------------
*/

export const getDonationHistory = (donorId) =>
  api.get(`${BASE_URL}/donor/${donorId}/history`);

export const getDonationSummary = (donorId) =>
  api.get(`${BASE_URL}/donor/${donorId}/summary`);


/*
|--------------------------------------------------------------------------
| Receipt
|--------------------------------------------------------------------------
*/

export const generateReceipt = (data) =>
  api.post("/fundraising/receipts", data);