import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

export const getApplications = () =>
  API.get("/admin/applications");

export default API;