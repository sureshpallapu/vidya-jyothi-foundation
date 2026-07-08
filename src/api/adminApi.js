import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboardStatistics = () =>
  API.get("/admin/dashboard");

export default API;