import axiosClient from "./axiosClient";

// GET /api/poli -> Poli[] (no pagination)
export const listPoli = () => axiosClient.get("/poli").then((res) => res.data);

export const getPoli = (id) =>
  axiosClient.get(`/poli/${id}`).then((res) => res.data);

// POST /api/poli -> ADMIN only. body: { name, code }
export const createPoli = (payload) =>
  axiosClient.post("/poli", payload).then((res) => res.data);

// PUT /api/poli/:id -> ADMIN only. body: partial { name?, code? }
export const updatePoli = (id, payload) =>
  axiosClient.put(`/poli/${id}`, payload).then((res) => res.data);

// DELETE /api/poli/:id -> ADMIN only. 409 if doctors/registrations still reference it.
export const deletePoli = (id) =>
  axiosClient.delete(`/poli/${id}`).then((res) => res.data);
