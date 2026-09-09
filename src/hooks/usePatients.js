import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as patientsApi from "../api/patients.api";

const PATIENTS_KEY = "patients";

export function usePatientsList(params) {
  return useQuery({
    queryKey: [PATIENTS_KEY, "list", params],
    queryFn: () => patientsApi.listPatients(params),
    placeholderData: (prev) => prev, // keep previous page visible while the next page loads
  });
}

export function usePatientDetail(id) {
  return useQuery({
    queryKey: [PATIENTS_KEY, "detail", id],
    queryFn: () => patientsApi.getPatient(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY, "list"] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => patientsApi.updatePatient(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY, "detail", variables.id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY, "list"] });
    },
  });
}
