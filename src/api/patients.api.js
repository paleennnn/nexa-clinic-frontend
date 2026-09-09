import axiosClient from "./axiosClient";

// GET /api/patients?search=&page=&limit= -> { items, pagination: { page, limit, total, totalPages } }
export const listPatients = ({ search, page, limit }) =>
  axiosClient
    .get("/patients", { params: { search: search || undefined, page, limit } })
    .then((res) => res.data);

// GET /api/patients/:id -> patient
export const getPatient = (id) =>
  axiosClient.get(`/patients/${id}`).then((res) => res.data);

// POST /api/patients -> created patient
export const createPatient = (payload) =>
  axiosClient.post("/patients", payload).then((res) => res.data);

// PUT /api/patients/:id -> updated patient
export const updatePatient = (id, payload) =>
  axiosClient.put(`/patients/${id}`, payload).then((res) => res.data);

// DELETE /api/patients/:id -> soft delete
export const deletePatient = (id) =>
  axiosClient.delete(`/patients/${id}`).then((res) => res.data);
