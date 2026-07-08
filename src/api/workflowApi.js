import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const updateWorkflow = (
  applicationId,
  data
) =>
  API.put(
    `/admin/applications/${applicationId}/workflow`,
    data
  );

export default API;