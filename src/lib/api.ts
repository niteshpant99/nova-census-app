// src/lib/api.ts (if not already exists)
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@/server/api/root';
import superjson from 'superjson';

export const api = createTRPCNext<typeof AppRouter>({
  config() {
    return {
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      },
    };
  },
  ssr: false,
});

export type RouterInputs = typeof AppRouter['_def']['record']['router']['queries'];
export type RouterOutputs = typeof AppRouter['_def']['record']['router']['queries'];