import axiosClient from "./axiosClient";

// GET /api/doctors -> Doctor[] (no pagination), each with nested { user, poli }
export const listDoctors = () => axiosClient.get("/doctors").then((res) => res.data);

export const getDoctor = (id) =>
  axiosClient.get(`/doctors/${id}`).then((res) => res.data);

// POST /api/doctors -> ADMIN only. body: { name, email, password, poliId, sipNumber?, specialization? }
// Creates the underlying User (role=DOKTER) + Doctor profile together.
export const createDoctor = (payload) =>
  axiosClient.post("/doctors", payload).then((res) => res.data);

// PUT /api/doctors/:id -> ADMIN only. body: partial { name?, poliId?, sipNumber?, specialization? }
// Note: email/password cannot be changed via update — backend validator doesn't accept them.
export const updateDoctor = (id, payload) =>
  axiosClient.put(`/doctors/${id}`, payload).then((res) => res.data);

// DELETE /api/doctors/:id -> ADMIN only. Deactivates the user account (soft), not a hard delete.
export const deleteDoctor = (id) =>
  axiosClient.delete(`/doctors/${id}`).then((res) => res.data);
