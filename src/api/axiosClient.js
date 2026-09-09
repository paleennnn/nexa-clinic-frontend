import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const TOKEN_KEY = "nexa_clinic_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend always responds { success, message, data } or { success, message, errors }.
// Unwrap here so callers work with plain data/errors instead of the envelope every time.
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (status === 401) {
      tokenStorage.clear();
      // Full reload (not router navigate) so all in-memory query cache / auth state resets cleanly.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const normalized = {
      status,
      message: payload?.message || "Terjadi kesalahan, silakan coba lagi",
      errors: payload?.errors || {},
    };
    return Promise.reject(normalized);
  }
);

export default axiosClient;
