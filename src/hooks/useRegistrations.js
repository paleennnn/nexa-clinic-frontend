import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as registrationsApi from "../api/registrations.api";

const REGISTRATIONS_KEY = "registrations";
const QUEUES_KEY = "queues"; // creating/updating a registration affects queue data too

export function useRegistrationsList(params) {
  return useQuery({
    queryKey: [REGISTRATIONS_KEY, "list", params],
    queryFn: () => registrationsApi.listRegistrations(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrationsApi.createRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => registrationsApi.updateRegistration(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
    },
  });
}
