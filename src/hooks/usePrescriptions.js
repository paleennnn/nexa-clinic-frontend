import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as prescriptionsApi from "../api/prescriptions.api";

const HISTORY_KEY = "patient-medical-history";

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prescriptionsApi.createPrescription,
    onSuccess: () => {
      // Any patient's history could contain the record this was attached to —
      // simplest correct invalidation is to refresh all cached histories.
      queryClient.invalidateQueries({ queryKey: [HISTORY_KEY] });
    },
  });
}
