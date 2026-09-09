import axiosClient from "./axiosClient";

// POST /api/prescriptions -> DOKTER only. body: { medicalRecordId, items: [...] }
// For adding a prescription to a record that didn't get one at exam time —
// fails with 409 if that record already has a prescription.
export const createPrescription = (payload) =>
  axiosClient.post("/prescriptions", payload).then((res) => res.data);

export const getPrescription = (id) =>
  axiosClient.get(`/prescriptions/${id}`).then((res) => res.data);
