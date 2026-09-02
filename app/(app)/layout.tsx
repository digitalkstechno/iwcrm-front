'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CRMProvider } from '@/lib/crm-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LogoutConfirmModal } from '@/components/ui/LogoutConfirmModal';
import { ConfirmDialogModal } from '@/components/ui/ConfirmDialogModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useCRM } from '@/lib/crm-context';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { sidebarCollapsed } = useCRM();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Fixed Top Header */}
      <Header />

      {/* Main App Content View Container */}
      <main className={`pt-20 pb-12 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <LogoutConfirmModal />
      <ConfirmDialogModal />
      <ToastContainer />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </CRMProvider>
  );
}

