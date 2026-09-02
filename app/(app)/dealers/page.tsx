'use client';

import { DealersView } from '@/components/dealers/DealersView';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { DealerDetailModal } from '@/components/dealers/DealerDetailModal';
import { DealerFormModal } from '@/components/dealers/DealerFormModal';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ToastContainer } from '@/components/ui/Toast';

export default function DealersPage() {
  return (
    <>
      <DealersView />
      <GlobalSearchModal />
      <DealerDetailModal />
      <DealerFormModal />
      <QuickActionModal />
      <ToastContainer />
    </>
  );
}
