'use client';

import { LeadsView } from '@/components/leads/LeadsView';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { ConvertLeadModal } from '@/components/leads/ConvertLeadModal';
import { LeadAssignModal } from '@/components/leads/LeadAssignModal';
import { FollowUpModal } from '@/components/leads/FollowUpModal';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ToastContainer } from '@/components/ui/Toast';

export default function LeadsPage() {
  return (
    <>
      <LeadsView />
      <GlobalSearchModal />
      <LeadDetailModal />
      <LeadFormModal />
      <ConvertLeadModal />
      <LeadAssignModal />
      <FollowUpModal />
      <QuickActionModal />
      <ToastContainer />
    </>
  );
}
