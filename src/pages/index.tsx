import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.push('/dashboard');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}