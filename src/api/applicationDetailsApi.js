import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*
|--------------------------------------------------------------------------
| Get Single Application
|--------------------------------------------------------------------------
*/

export const getApplicationDetails = (id) =>
  API.get(`/admin/applications/${id}`);

export default API;