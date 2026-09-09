import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as doctorsApi from "../api/doctors.api";

const DOCTORS_KEY = "doctors";

export function useDoctorsList() {
  return useQuery({
    queryKey: [DOCTORS_KEY, "list"],
    queryFn: doctorsApi.listDoctors,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.createDoctor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => doctorsApi.updateDoctor(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
}

export function useDeactivateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.deleteDoctor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
}
