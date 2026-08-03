import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;