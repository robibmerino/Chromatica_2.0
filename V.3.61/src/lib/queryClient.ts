import { QueryClient } from '@tanstack/react-query';

const QUERY_STALE_MS = 60 * 1000; // 1 minuto
const QUERY_GC_MS = 5 * 60 * 1000; // 5 minutos

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_MS,
      gcTime: QUERY_GC_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Clave de query para paletas del usuario (permite invalidar desde mutaciones). */
export const palettesQueryKey = (userId: string) => ['palettes', userId] as const;
