import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1 minute
        gcTime: 5 * 60_000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Alias for SSR prefetching pattern
export const getQueryClient = createQueryClient;
