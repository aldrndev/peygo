import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAdminDashboard, 
  fetchAdminUsers, 
  fetchAdminInvoices 
} from "@/lib/api/admin";

export const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"] as const;
export const ADMIN_USERS_KEY = ["admin", "users"] as const;
export const ADMIN_INVOICES_KEY = ["admin", "invoices"] as const;

/**
 * Hook to fetch admin dashboard stats
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: fetchAdminDashboard,
  });
}

/**
 * Hook to fetch admin users list
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: fetchAdminUsers,
  });
}

/**
 * Hook to fetch admin invoices list
 */
export function useAdminInvoices() {
  return useQuery({
    queryKey: ADMIN_INVOICES_KEY,
    queryFn: fetchAdminInvoices,
  });
}

/**
 * Hook to invalidate all admin caches
 */
export function useInvalidateAdminData() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    queryClient.invalidateQueries({ queryKey: ADMIN_INVOICES_KEY });
  };
}
