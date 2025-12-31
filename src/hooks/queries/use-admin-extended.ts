import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminReports, type AdminReportsData } from "@/lib/api/admin-reports";
import { 
  fetchAdminSettings, 
  updateSettingMutation,
} from "@/lib/api/admin-settings";
import type { Setting } from "@/types/database";

export const ADMIN_REPORTS_KEY = ["admin-reports"] as const;
export const ADMIN_SETTINGS_KEY = ["admin-settings"] as const;

/**
 * Hook to fetch admin reports
 */
export function useAdminReports() {
  return useQuery<AdminReportsData | null>({
    queryKey: ADMIN_REPORTS_KEY,
    queryFn: fetchAdminReports,
  });
}

/**
 * Hook to fetch admin settings
 */
export function useAdminSettings() {
  return useQuery<Setting[]>({
    queryKey: ADMIN_SETTINGS_KEY,
    queryFn: fetchAdminSettings,
  });
}

/**
 * Hook to update a setting
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      updateSettingMutation(key, value),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEY });
      }
    },
  });
}

/**
 * Hook to invalidate admin reports cache
 */
export function useInvalidateAdminReports() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_REPORTS_KEY });
  };
}
