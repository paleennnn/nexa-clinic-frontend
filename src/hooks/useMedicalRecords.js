import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as medicalRecordsApi from "../api/medicalRecords.api";

const HISTORY_KEY = "patient-medical-history";
const REGISTRATIONS_KEY = "registrations";
const QUEUES_KEY = "queues";
const MEDICAL_RECORDS_KEY = "medical-records";

export function usePatientMedicalHistory(patientId) {
  return useQuery({
    queryKey: [HISTORY_KEY, patientId],
    queryFn: () => medicalRecordsApi.getPatientMedicalHistory(patientId),
    enabled: !!patientId,
  });
}

export function useMedicalRecordsList(params) {
  return useQuery({
    queryKey: [MEDICAL_RECORDS_KEY, "list", params],
    queryFn: () => medicalRecordsApi.listMedicalRecords(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: medicalRecordsApi.createMedicalRecord,
    onSuccess: (record) => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MEDICAL_RECORDS_KEY] });
      queryClient.invalidateQueries({ queryKey: [HISTORY_KEY, record.patientId] });
    },
  });
}
