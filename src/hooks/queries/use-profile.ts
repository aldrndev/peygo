import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchCurrentProfile, 
  updateProfileMutation,
  type UpdateProfileInput 
} from "@/lib/api/profile";

export const PROFILE_QUERY_KEY = ["profile"] as const;

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchCurrentProfile,
  });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfileMutation(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }
    },
  });
}

/**
 * Hook to invalidate profile cache
 */
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  };
}
