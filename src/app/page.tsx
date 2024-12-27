'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard or login
    router.push('/dashboard');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}