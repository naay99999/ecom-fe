import { QueryClient } from "@tanstack/react-query";

const MAX_QUERY_RETRIES = 2;

export function shouldRetryQuery(failureCount, error) {
  if (failureCount >= MAX_QUERY_RETRIES) return false;

  const status = error?.status;
  return status === undefined || status === 429 || status >= 500;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: shouldRetryQuery,
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const queryClient = createQueryClient();
