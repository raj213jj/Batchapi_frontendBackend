import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7153/api",
});

// Attach token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;