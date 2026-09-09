import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as medicalRecordsApi from "../api/medicalRecords.api";

const HISTORY_KEY = "patient-medical-history";
const REGISTRATIONS_KEY = "registrations";
const QUEUES_KEY = "queues";

export function usePatientMedicalHistory(patientId) {
  return useQuery({
    queryKey: [HISTORY_KEY, patientId],
    queryFn: () => medicalRecordsApi.getPatientMedicalHistory(patientId),
    enabled: !!patientId,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.createMedicalRecord,
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
      queryClient.invalidateQueries({ queryKey: [HISTORY_KEY, record.patientId] });
    },
  });
}
