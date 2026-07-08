import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getHistory = (id) =>
  API.get(
    `/admin/applications/${id}/history`
  );

export default API;