'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // Set initial authentication for demo
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'sarah.jenkins@nexus.io');
      router.push('/dashboard');
    }
  }, [router]);

  return null;
}

