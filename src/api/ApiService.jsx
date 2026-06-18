import axios from "axios";

// Base URL points at the backend. Override with VITE_API_URL in a .env file.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.gastro-analytics.uz",
});

// Attach the JWT (if present) to every request automatically.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
