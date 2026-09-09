import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as queuesApi from "../api/queues.api";

const QUEUES_KEY = "queues";
const REGISTRATIONS_KEY = "registrations";

// update antrean pakai polling REST (bukan WebSocket).
const POLL_INTERVAL_MS = 7000;

export function useQueuesList(params) {
  return useQuery({
    queryKey: [QUEUES_KEY, "list", params],
    queryFn: () => queuesApi.listQueues(params),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useCallQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: queuesApi.callQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
    },
  });
}

export function useUpdateQueueStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => queuesApi.updateQueueStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUES_KEY] });
      // registration.status tracks alongside queue.status in the workflow
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] });
    },
  });
}
