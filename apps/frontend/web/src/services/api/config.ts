import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Add authorization token or other headers here
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors
        return Promise.reject(error);
    }
);
