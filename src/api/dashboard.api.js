import axiosClient from "./axiosClient";

// GET /api/dashboard/summary -> { totalPatients, newPatientsToday, totalQueuesToday, waitingToday, doneToday }
export const getDashboardSummary = () =>
  axiosClient.get("/dashboard/summary").then((res) => res.data);