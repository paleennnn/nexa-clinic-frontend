import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard.api";

const REFRESH_INTERVAL_MS = 15000;

export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: dashboardApi.getDashboardSummary,
        refetchInterval: REFRESH_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
}