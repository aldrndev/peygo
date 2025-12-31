import { useQuery } from "@tanstack/react-query";
import { fetchAdminUserDetail, type AdminUserDetail } from "@/lib/api/admin-user-detail";

export const ADMIN_USER_DETAIL_KEY = ["admin-user-detail"] as const;

/**
 * Hook to fetch admin user detail
 */
export function useAdminUserDetail(userId: string) {
  return useQuery<AdminUserDetail | null>({
    queryKey: [...ADMIN_USER_DETAIL_KEY, userId],
    queryFn: () => fetchAdminUserDetail(userId),
    enabled: !!userId,
  });
}
