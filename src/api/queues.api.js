import axiosClient from "./axiosClient";

// GET /api/queues?date=&poliId=&status= -> Queue[] (no pagination). date defaults to today server-side.
export const listQueues = ({ date, poliId, status }) =>
  axiosClient
    .get("/queues", { params: { date: date || undefined, poliId: poliId || undefined, status: status || undefined } })
    .then((res) => res.data);

// POST /api/queues -> ADMIN/PETUGAS_PENDAFTARAN only. body: { registrationId }
// Rarely needed manually since /registrations creates the queue automatically;
// kept for the rare case a registration exists without one.
export const createQueue = (registrationId) =>
  axiosClient.post("/queues", { registrationId }).then((res) => res.data);

// PUT /api/queues/:id/call -> ADMIN/PETUGAS_PENDAFTARAN/DOKTER.
// 409 if another queue in the same poli is already CALLED.
export const callQueue = (id) =>
  axiosClient.put(`/queues/${id}/call`).then((res) => res.data);

// PUT /api/queues/:id/status -> ADMIN/PETUGAS_PENDAFTARAN/DOKTER. body: { status }
export const updateQueueStatus = (id, status) =>
  axiosClient.put(`/queues/${id}/status`, { status }).then((res) => res.data);
