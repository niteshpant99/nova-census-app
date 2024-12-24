// src/app/providers.tsx
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { api } from '@/lib/api';

export function TRPCReactProvider({
  children,
  headers,
}: {
  children: React.ReactNode;
  headers: Headers;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <api.Provider
      client={api.createClient({
        links: [
          httpBatchLink({
            url: '/api/trpc',
            headers() {
              const heads = new Map(headers);
              heads.set('x-trpc-source', 'react');
              return Object.fromEntries(heads);
            },
          }),
        ],
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}