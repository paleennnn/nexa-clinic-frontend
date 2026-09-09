import axiosClient from "./axiosClient";

// Matches backend: POST /api/auth/login -> { token, user: { id, name, email, role } }
export const login = (email, password) =>
  axiosClient.post("/auth/login", { email, password }).then((res) => res.data);

// POST /api/auth/logout -> stateless on server, just acknowledges
export const logout = () => axiosClient.post("/auth/logout").then((res) => res.data);

// GET /api/auth/me -> { id, name, email, role, isActive, doctor }
export const getMe = () => axiosClient.get("/auth/me").then((res) => res.data);
