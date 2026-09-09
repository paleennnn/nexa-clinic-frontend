import axiosClient from "./axiosClient";

// GET /api/registrations?date=&status=&page=&limit= -> { items, pagination }
export const listRegistrations = ({ date, status, page, limit }) =>
  axiosClient
    .get("/registrations", { params: { date: date || undefined, status: status || undefined, page, limit } })
    .then((res) => res.data);

export const getRegistration = (id) =>
  axiosClient.get(`/registrations/${id}`).then((res) => res.data);

// POST /api/registrations -> ADMIN/PETUGAS_PENDAFTARAN only.
// body: { patientId, doctorId, poliId, visitDate, paymentType, chiefComplaint }
// Backend auto-creates the Queue entry in the same transaction.
export const createRegistration = (payload) =>
  axiosClient.post("/registrations", payload).then((res) => res.data);

// PUT /api/registrations/:id -> ADMIN/PETUGAS_PENDAFTARAN only.
// body: partial { status?, doctorId?, poliId?, visitDate?, paymentType?, chiefComplaint? }
// Non-admin cannot move `status` backward — backend returns 400 if attempted.
export const updateRegistration = (id, payload) =>
  axiosClient.put(`/registrations/${id}`, payload).then((res) => res.data);
