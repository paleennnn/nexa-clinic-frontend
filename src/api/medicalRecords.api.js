import axiosClient from "./axiosClient";

// POST /api/medical-records -> DOKTER only.
// body: { registrationId, subjective, bloodPressure, temperature, weight, height,
//         diagnosis, therapyPlan, actions?: [], prescriptionItems?: [] }
// Backend also flips registration.status -> SELESAI and queue.status -> DONE.
export const createMedicalRecord = (payload) =>
  axiosClient.post("/medical-records", payload).then((res) => res.data);

// GET /api/medical-records/:patientId -> MedicalRecord[] (any authenticated role)
export const getPatientMedicalHistory = (patientId) =>
  axiosClient.get(`/medical-records/${patientId}`).then((res) => res.data);
