'use client';

import Header from '@/components/Header/Header';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/login') || pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <main>
        {children}
      </main>
    </>
  );
}
