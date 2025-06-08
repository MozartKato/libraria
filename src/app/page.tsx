'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In client components, we need to use document.cookie instead of next/headers
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    
    if (token) {
      router.push('/pages/dashboard');
    }
  }, [router]);

  return(
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg">This is a simple Next.js application.</p>
      <button>Login</button>
    </main>
  )
}
