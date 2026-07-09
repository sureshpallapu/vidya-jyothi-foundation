import axios from "axios";

const API =
  "http://localhost:5000/api/admin";

/*
|--------------------------------------------------------------------------
| Get All Scholarship Cycles
|--------------------------------------------------------------------------
*/

export const getScholarshipCycles = () =>
  axios.get(`${API}/cycles`);

/*
|--------------------------------------------------------------------------
| Get Scholarship Cycle
|--------------------------------------------------------------------------
*/

export const getScholarshipCycle = (id) =>
  axios.get(`${API}/cycles/${id}`);

/*
|--------------------------------------------------------------------------
| Create Scholarship Cycle
|--------------------------------------------------------------------------
*/

export const createScholarshipCycle = (data) =>
  axios.post(`${API}/cycles`, data);

/*
|--------------------------------------------------------------------------
| Update Scholarship Cycle
|--------------------------------------------------------------------------
*/

export const updateScholarshipCycle = (
  id,
  data
) =>
  axios.put(
    `${API}/cycles/${id}`,
    data
  );

/*
|--------------------------------------------------------------------------
| Activate Scholarship Cycle
|--------------------------------------------------------------------------
*/

export const activateScholarshipCycle = (
  id
) =>
  axios.put(
    `${API}/cycles/${id}/activate`
  );

/*
|--------------------------------------------------------------------------
| Delete Scholarship Cycle
|--------------------------------------------------------------------------
*/

export const deleteScholarshipCycle = (
  id
) =>
  axios.delete(
    `${API}/cycles/${id}`
  );