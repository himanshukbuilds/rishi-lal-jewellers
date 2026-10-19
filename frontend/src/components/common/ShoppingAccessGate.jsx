'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const isPublicStorePath = (path) => path === '/' || ['/about', '/contact', '/faqs', '/terms', '/privacy-policy', '/shipping-policy', '/returns-refunds'].some((route) => path === route || path.startsWith(`${route}/`));

export default function ShoppingAccessGate({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const allowed = user?.role === 'customer';
  const isPublic = isPublicStorePath(pathname || '/');
  const returnTo = `${pathname || '/'}${searchParams?.toString() ? `?${searchParams}` : ''}`;

  useEffect(() => {
    if (!loading && !isPublic && !allowed) {
      const query = new URLSearchParams({ next: returnTo });
      router.replace(`/login?${query.toString()}`);
    }
  }, [loading, isPublic, allowed, returnTo, router]);

  if (isPublic || (allowed && !loading)) return children;
  return <main className="flex min-h-[55vh] items-center justify-center bg-[#F8F5EF] px-6 text-center text-sm text-[#4A0B13]">Preparing your private collection…</main>;
}
