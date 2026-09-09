import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as poliApi from "../api/poli.api";

const POLI_KEY = "poli";
const DOCTORS_KEY = "doctors";

export function usePoliList() {
  return useQuery({
    queryKey: [POLI_KEY, "list"],
    queryFn: poliApi.listPoli,
  });
}

export function useCreatePoli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: poliApi.createPoli,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [POLI_KEY] }),
  });
}

export function useUpdatePoli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => poliApi.updatePoli(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POLI_KEY] });
      // Doctor list embeds nested { poli: { name, code } } — keep it from going stale.
      queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] });
    },
  });
}

export function useDeletePoli() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: poliApi.deletePoli,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [POLI_KEY] }),
  });
}
