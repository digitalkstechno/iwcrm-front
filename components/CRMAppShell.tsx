'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { LeadsView } from '@/components/leads/LeadsView';
import { DealersView } from '@/components/dealers/DealersView';
import { StaffView } from '@/components/staff/StaffView';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/settings/SettingsView';

// Modals
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { ConvertLeadModal } from '@/components/leads/ConvertLeadModal';
import { LeadAssignModal } from '@/components/leads/LeadAssignModal';
import { FollowUpModal } from '@/components/leads/FollowUpModal';
import { DealerDetailModal } from '@/components/dealers/DealerDetailModal';
import { DealerFormModal } from '@/components/dealers/DealerFormModal';
import { StaffDetailModal } from '@/components/staff/StaffDetailModal';
import { StaffFormModal } from '@/components/staff/StaffFormModal';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { LogoutConfirmModal } from '@/components/ui/LogoutConfirmModal';
import { ToastContainer } from '@/components/ui/Toast';

export const CRMAppShell: React.FC = () => {
  const { activeTab, sidebarCollapsed } = useCRM();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Fixed Top Header */}
      <Header />

      {/* Main App Content View Container */}
      <main
        id="main-app-content"
        className={`pt-20 pb-12 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="w-full">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'leads' && <LeadsView />}
          {activeTab === 'dealers' && <DealersView />}
          {activeTab === 'staff' && <StaffView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Global Modals & Notifications Layer */}
      <GlobalSearchModal />
      <LeadDetailModal />
      <LeadFormModal />
      <ConvertLeadModal />
      <LeadAssignModal />
      <FollowUpModal />
      <DealerDetailModal />
      <DealerFormModal />
      <StaffDetailModal />
      <StaffFormModal />
      <QuickActionModal />
      <LogoutConfirmModal />
      <ToastContainer />
    </div>
  );
};
