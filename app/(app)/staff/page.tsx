'use client';

import { StaffView } from '@/components/staff/StaffView';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { StaffDetailModal } from '@/components/staff/StaffDetailModal';
import { StaffFormModal } from '@/components/staff/StaffFormModal';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ToastContainer } from '@/components/ui/Toast';

export default function StaffPage() {
  return (
    <>
      <StaffView />
      <GlobalSearchModal />
      <StaffDetailModal />
      <StaffFormModal />
      <QuickActionModal />
      <ToastContainer />
    </>
  );
}
