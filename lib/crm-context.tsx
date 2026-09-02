'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Lead,
  Dealer,
  Staff,
  ActivityItem,
  FollowUpItem,
  NotificationItem,
  CRMSettings,
  LeadStatus,
  LeadPriority,
} from './types';
import {
  INITIAL_LEADS,
  INITIAL_DEALERS,
  INITIAL_STAFF,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from './initial-data';
import api from './axios';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface CRMContextType {
  // Navigation
  activeTab: 'dashboard' | 'leads' | 'dealers' | 'staff' | 'reports' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'leads' | 'dealers' | 'staff' | 'reports' | 'settings') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Data
  leads: Lead[];
  dealers: Dealer[];
  staff: Staff[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  settings: CRMSettings;
  toasts: Toast[];

  // Lead Operations
  addLead: (lead: Omit<Lead, 'id' | 'leadCode' | 'createdDate' | 'lastFollowUp'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  assignLead: (leadId: string, staffId: string, notes?: string, priority?: LeadPriority) => void;
  convertLeadToDealer: (leadId: string, dealerData?: Partial<Dealer>) => Dealer | null;
  addLeadNote: (leadId: string, content: string) => void;
  addLeadActivity: (leadId: string, activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  addLeadFollowUp: (followUp: Omit<FollowUpItem, 'id'>) => void;
  completeFollowUp: (followUpId: string, completed?: boolean) => void;

  // Dealer Operations
  addDealer: (dealer: Omit<Dealer, 'id' | 'dealerCode' | 'joinedDate' | 'lastActivity'>) => Dealer;
  updateDealer: (id: string, updates: Partial<Dealer>) => void;
  deleteDealer: (id: string) => void;
  addDealerNote: (dealerId: string, content: string) => void;

  // Staff Operations
  addStaff: (staffMember: Omit<Staff, 'id' | 'employeeId' | 'joinedDate'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Notification Operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<CRMSettings>) => void;

  // Toast
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Quick Action / Modals
  openModal: string | null;
  modalData: any;
  setOpenModal: (modalName: string | null, data?: any) => void;
  closeModal: () => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Reset
  resetToSampleData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LEADS: 'nexus_crm_leads_v2',
  DEALERS: 'nexus_crm_dealers_v2',
  STAFF: 'nexus_crm_staff_v2',
  ACTIVITIES: 'nexus_crm_activities_v2',
  NOTIFICATIONS: 'nexus_crm_notifications_v2',
  SETTINGS: 'nexus_crm_settings_v2',
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'dealers' | 'staff' | 'reports' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window === 'undefined') return INITIAL_LEADS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [dealers, setDealers] = useState<Dealer[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DEALERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEALERS);
      return stored ? JSON.parse(stored) : INITIAL_DEALERS;
    } catch {
      return INITIAL_DEALERS;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    if (typeof window === 'undefined') return INITIAL_STAFF;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
      return stored ? JSON.parse(stored) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState<CRMSettings>(() => {
    if (typeof window === 'undefined') return INITIAL_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [openModal, setOpenModalState] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Save changes to LocalStorage
  const saveLeads = useCallback((data: Lead[]) => {
    setLeads(data);
    try { localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveDealers = useCallback((data: Dealer[]) => {
    setDealers(data);
    try { localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveStaff = useCallback((data: Staff[]) => {
    setStaff(data);
    try { localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(data)); } catch (e) {}
  }, []);

  // Fetch data from API using Axios on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, dealersData, staffData] = await Promise.all([
          api.get('/api/leads').catch(() => null),
          api.get('/api/dealers').catch(() => null),
          api.get('/api/staff').catch(() => null)
        ]);
        if (leadsData && Array.isArray(leadsData)) saveLeads(leadsData);
        if (dealersData && Array.isArray(dealersData)) saveDealers(dealersData);
        if (staffData && Array.isArray(staffData)) saveStaff(staffData);
      } catch (error) {
        console.error('Failed to fetch initial CRM data:', error);
      }
    };
    fetchData();
  }, [saveLeads, saveDealers, saveStaff]);

  const saveActivities = useCallback((data: ActivityItem[]) => {
    setActivities(data);
    try { localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveNotifications = useCallback((data: NotificationItem[]) => {
    setNotifications(data);
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveSettings = useCallback((data: CRMSettings) => {
    setSettings(data);
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data)); } catch (e) {}
  }, []);

  // Toast Helpers
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modal Helpers
  const setOpenModal = useCallback((modalName: string | null, data?: any) => {
    setOpenModalState(modalName);
    setModalData(data || null);
  }, []);

  const closeModal = useCallback(() => {
    setOpenModalState(null);
    setModalData(null);
  }, []);

  // Lead Handlers
  const addLead = useCallback(
    (leadInput: Omit<Lead, 'id' | 'leadCode' | 'createdDate' | 'lastFollowUp'>) => {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const newLead: Lead = {
        ...leadInput,
        id: 'lead-' + Date.now(),
        leadCode: `LD-${codeNum}`,
        createdDate: new Date().toISOString().split('T')[0],
        lastFollowUp: 'Just now',
        activities: [
          {
            id: 'act-' + Date.now(),
            type: 'created',
            title: `Lead ${leadInput.name} created`,
            description: `Source: ${leadInput.source}. Assigned to ${leadInput.assignedStaffName || 'Unassigned'}.`,
            timestamp: 'Just now',
            authorName: 'CRM User',
          },
        ],
        notes: leadInput.notes || [],
        followUps: leadInput.followUps || [],
        documents: leadInput.documents || [],
      };

      const nextLeads = [newLead, ...leads];
      saveLeads(nextLeads);

      // Append to global activities
      const newActivity: ActivityItem = {
        id: 'act-g-' + Date.now(),
        type: 'created',
        title: `New lead created: ${newLead.name}`,
        description: `${newLead.company} · Source: ${newLead.source}`,
        timestamp: 'Just now',
        authorName: 'Admin',
      };
      saveActivities([newActivity, ...activities]);

      // Update staff assigned count if staff assigned
      if (newLead.assignedStaffId) {
        const nextStaff = staff.map((s) =>
          s.id === newLead.assignedStaffId
            ? { ...s, assignedLeadsCount: s.assignedLeadsCount + 1 }
            : s
        );
        saveStaff(nextStaff);
      }

      showToast({
        type: 'success',
        title: 'Lead Created',
        message: `${newLead.name} (${newLead.leadCode}) has been added to pipeline.`,
      });

      return newLead;
    },
    [leads, activities, staff, saveLeads, saveActivities, saveStaff, showToast]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<Lead>) => {
      const current = leads.find((l) => l.id === id);
      if (!current) return;

      let extraActivity: ActivityItem | null = null;
      if (updates.status && updates.status !== current.status) {
        extraActivity = {
          id: 'act-' + Date.now(),
          type: 'status_change',
          title: `Status changed to ${updates.status}`,
          description: `Moved from ${current.status} to ${updates.status}.`,
          timestamp: 'Just now',
          authorName: 'CRM User',
          meta: { fromStatus: current.status, toStatus: updates.status },
        };
      }

      const nextLeads = leads.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates };
          if (extraActivity) {
            updated.activities = [extraActivity, ...(updated.activities || [])];
          }
          return updated;
        }
        return l;
      });

      saveLeads(nextLeads);

      if (extraActivity) {
        saveActivities([
          {
            id: 'act-g-' + Date.now(),
            type: 'status_change',
            title: `Lead #${current.leadCode} status changed to ${updates.status}`,
            description: `${current.name} (${current.company})`,
            timestamp: 'Just now',
            authorName: 'CRM User',
          },
          ...activities,
        ]);
      }

      showToast({
        type: 'info',
        title: 'Lead Updated',
        message: `Changes saved for ${current.name}.`,
      });
    },
    [leads, activities, saveLeads, saveActivities, showToast]
  );

  const deleteLead = useCallback(
    (id: string) => {
      const target = leads.find((l) => l.id === id);
      const nextLeads = leads.filter((l) => l.id !== id);
      saveLeads(nextLeads);
      showToast({
        type: 'warning',
        title: 'Lead Deleted',
        message: target ? `Lead #${target.leadCode} was removed.` : 'Lead removed.',
      });
    },
    [leads, saveLeads, showToast]
  );

  const assignLead = useCallback(
    (leadId: string, staffId: string, notes?: string, priority?: LeadPriority) => {
      const assignedMember = staff.find((s) => s.id === staffId);
      const targetLead = leads.find((l) => l.id === leadId);
      if (!targetLead || !assignedMember) return;

      const assignActivity: ActivityItem = {
        id: 'act-asgn-' + Date.now(),
        type: 'assigned',
        title: `Lead assigned to ${assignedMember.name}`,
        description: notes || `Reassigned with ${priority || targetLead.priority} priority.`,
        timestamp: 'Just now',
        authorName: 'Manager',
        meta: { assignedTo: assignedMember.name },
      };

      const nextLeads = leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            assignedStaffId: assignedMember.id,
            assignedStaffName: assignedMember.name,
            assignedStaffAvatar: assignedMember.photo,
            priority: priority || l.priority,
            activities: [assignActivity, ...(l.activities || [])],
          };
        }
        return l;
      });

      saveLeads(nextLeads);

      saveActivities([
        {
          id: 'act-g-asgn-' + Date.now(),
          type: 'assigned',
          title: `Lead #${targetLead.leadCode} assigned to ${assignedMember.name}`,
          description: targetLead.company,
          timestamp: 'Just now',
          authorName: 'Manager',
        },
        ...activities,
      ]);

      // Add Notification
      saveNotifications([
        {
          id: 'notif-' + Date.now(),
          title: 'Lead Assigned',
          message: `${targetLead.name} (${targetLead.company}) has been assigned to you.`,
          timestamp: 'Just now',
          read: false,
          type: 'lead',
          linkTab: 'leads',
          linkId: targetLead.id,
        },
        ...notifications,
      ]);

      showToast({
        type: 'success',
        title: 'Lead Assigned',
        message: `${targetLead.name} successfully assigned to ${assignedMember.name}.`,
      });
    },
    [leads, staff, activities, notifications, saveLeads, saveActivities, saveNotifications, showToast]
  );

  const convertLeadToDealer = useCallback(
    (leadId: string, customDealerData?: Partial<Dealer>): Dealer | null => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return null;

      const dealerNum = Math.floor(1000 + Math.random() * 9000);
      const newDealer: Dealer = {
        id: 'dealer-' + Date.now(),
        dealerCode: `DLR-${dealerNum}`,
        name: customDealerData?.name || lead.company || `${lead.name} Dealership`,
        company: lead.company || `${lead.name} Enterprises`,
        contactPerson: lead.name,
        phone: lead.phone,
        email: lead.email,
        location: customDealerData?.location || lead.location || 'Seattle, WA',
        region: customDealerData?.region || 'Northwest',
        assignedStaffId: lead.assignedStaffId || 'staff-1',
        assignedStaffName: lead.assignedStaffName || 'John Doe',
        assignedStaffAvatar: lead.assignedStaffAvatar,
        totalLeads: 1,
        convertedLeads: 1,
        status: 'Active',
        lastActivity: 'Just now',
        joinedDate: new Date().toISOString().split('T')[0],
        tier: customDealerData?.tier || 'Silver',
        revenue: customDealerData?.revenue || 250000,
        rating: 5.0,
        notes: [
          {
            id: 'dn-' + Date.now(),
            authorName: 'Conversion Engine',
            authorRole: 'System',
            content: `Converted from Lead #${lead.leadCode} (${lead.name}). Original source: ${lead.source}.`,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            pinned: true,
          },
        ],
        documents: lead.documents || [],
      };

      // Add to dealers
      saveDealers([newDealer, ...dealers]);

      // Update lead status to Converted
      const convertActivity: ActivityItem = {
        id: 'act-conv-' + Date.now(),
        type: 'converted',
        title: 'Lead Converted to Dealer',
        description: `Successfully converted into Dealer Partner: ${newDealer.name} (${newDealer.dealerCode}).`,
        timestamp: 'Just now',
        authorName: 'CRM User',
      };

      const nextLeads = leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            status: 'Converted' as LeadStatus,
            convertedToDealerId: newDealer.id,
            activities: [convertActivity, ...(l.activities || [])],
          };
        }
        return l;
      });
      saveLeads(nextLeads);

      // Global activity
      saveActivities([
        {
          id: 'act-g-conv-' + Date.now(),
          type: 'converted',
          title: `Lead #${lead.leadCode} converted by ${newDealer.name}.`,
          description: `New Authorized Dealer created with code ${newDealer.dealerCode}.`,
          timestamp: 'Just now',
          authorName: lead.assignedStaffName || 'Sales Rep',
        },
        ...activities,
      ]);

      // Update staff conversion metrics
      if (lead.assignedStaffId) {
        const nextStaff = staff.map((s) => {
          if (s.id === lead.assignedStaffId) {
            const nextConverted = s.convertedLeadsCount + 1;
            const nextRate = Math.round((nextConverted / Math.max(1, s.assignedLeadsCount)) * 100);
            return {
              ...s,
              convertedLeadsCount: nextConverted,
              conversionRate: nextRate,
            };
          }
          return s;
        });
        saveStaff(nextStaff);
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (e) {}

      showToast({
        type: 'success',
        title: 'Lead Converted to Dealer!',
        message: `${lead.name} has been converted into Dealer #${newDealer.dealerCode}.`,
      });

      return newDealer;
    },
    [leads, dealers, activities, staff, saveDealers, saveLeads, saveActivities, saveStaff, showToast]
  );

  const addLeadNote = useCallback(
    (leadId: string, content: string) => {
      const newNote = {
        id: 'n-' + Date.now(),
        authorName: 'CRM Admin',
        authorRole: 'Manager',
        content,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      const nextLeads = leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            notes: [newNote, ...(l.notes || [])],
            activities: [
              {
                id: 'act-' + Date.now(),
                type: 'note' as const,
                title: 'Note added',
                description: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
                timestamp: 'Just now',
                authorName: 'CRM Admin',
              },
              ...(l.activities || []),
            ],
          };
        }
        return l;
      });

      saveLeads(nextLeads);
      showToast({
        type: 'success',
        title: 'Note Added',
        message: 'New note saved to lead profile.',
      });
    },
    [leads, saveLeads, showToast]
  );

  const addLeadActivity = useCallback(
    (leadId: string, activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
      const newActivity: ActivityItem = {
        ...activity,
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
      };

      const nextLeads = leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            lastFollowUp: 'Just now',
            activities: [newActivity, ...(l.activities || [])],
          };
        }
        return l;
      });

      saveLeads(nextLeads);
      showToast({
        type: 'info',
        title: 'Activity Logged',
        message: `${activity.title} recorded.`,
      });
    },
    [leads, saveLeads, showToast]
  );

  const addLeadFollowUp = useCallback(
    (followUp: Omit<FollowUpItem, 'id'>) => {
      const newFollowUp: FollowUpItem = {
        ...followUp,
        id: 'fu-' + Date.now(),
      };

      if (followUp.leadId) {
        const nextLeads = leads.map((l) => {
          if (l.id === followUp.leadId) {
            return {
              ...l,
              followUps: [newFollowUp, ...(l.followUps || [])],
              activities: [
                {
                  id: 'act-' + Date.now(),
                  type: 'follow_up' as const,
                  title: `Follow-up scheduled: ${followUp.type}`,
                  description: `${followUp.date} at ${followUp.time} with ${followUp.assignedStaffName}.`,
                  timestamp: 'Just now',
                  authorName: 'CRM User',
                },
                ...(l.activities || []),
              ],
            };
          }
          return l;
        });
        saveLeads(nextLeads);
      }

      saveNotifications([
        {
          id: 'notif-fu-' + Date.now(),
          title: `Upcoming Follow-up: ${followUp.type}`,
          message: `${followUp.leadName || 'Client'} on ${followUp.date} at ${followUp.time}`,
          timestamp: 'Just now',
          read: false,
          type: 'followup',
          linkTab: 'leads',
          linkId: followUp.leadId,
        },
        ...notifications,
      ]);

      showToast({
        type: 'success',
        title: 'Follow-up Scheduled',
        message: `${followUp.type} scheduled for ${followUp.date} at ${followUp.time}.`,
      });
    },
    [leads, notifications, saveLeads, saveNotifications, showToast]
  );

  const completeFollowUp = useCallback(
    (followUpId: string, completed = true) => {
      const nextLeads = leads.map((l) => {
        if (l.followUps && l.followUps.some((f) => f.id === followUpId)) {
          return {
            ...l,
            followUps: l.followUps.map((f) => (f.id === followUpId ? { ...f, completed } : f)),
          };
        }
        return l;
      });
      saveLeads(nextLeads);
      showToast({
        type: 'info',
        title: completed ? 'Follow-up Completed' : 'Follow-up Reopened',
        message: 'Follow-up task updated.',
      });
    },
    [leads, saveLeads, showToast]
  );

  // Dealer Handlers
  const addDealer = useCallback(
    (dealerInput: Omit<Dealer, 'id' | 'dealerCode' | 'joinedDate' | 'lastActivity'>) => {
      const dealerNum = Math.floor(1000 + Math.random() * 9000);
      const newDealer: Dealer = {
        ...dealerInput,
        id: 'dealer-' + Date.now(),
        dealerCode: `DLR-${dealerNum}`,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActivity: 'Just now',
        totalLeads: dealerInput.totalLeads || 0,
        convertedLeads: dealerInput.convertedLeads || 0,
        rating: dealerInput.rating || 4.8,
        tier: dealerInput.tier || 'Silver',
        revenue: dealerInput.revenue || 500000,
        notes: dealerInput.notes || [],
        activities: dealerInput.activities || [],
        documents: dealerInput.documents || [],
      };

      saveDealers([newDealer, ...dealers]);

      saveActivities([
        {
          id: 'act-g-dlr-' + Date.now(),
          type: 'created',
          title: `New Dealer Added: ${newDealer.name}`,
          description: `${newDealer.location} · Assigned: ${newDealer.assignedStaffName || 'None'}`,
          timestamp: 'Just now',
          authorName: 'CRM Admin',
        },
        ...activities,
      ]);

      showToast({
        type: 'success',
        title: 'Dealer Added',
        message: `${newDealer.name} (${newDealer.dealerCode}) created.`,
      });

      return newDealer;
    },
    [dealers, activities, saveDealers, saveActivities, showToast]
  );

  const updateDealer = useCallback(
    (id: string, updates: Partial<Dealer>) => {
      const target = dealers.find((d) => d.id === id);
      const nextDealers = dealers.map((d) => (d.id === id ? { ...d, ...updates } : d));
      saveDealers(nextDealers);
      showToast({
        type: 'info',
        title: 'Dealer Updated',
        message: `Changes saved for ${target?.name || 'dealer'}.`,
      });
    },
    [dealers, saveDealers, showToast]
  );

  const deleteDealer = useCallback(
    (id: string) => {
      const target = dealers.find((d) => d.id === id);
      const nextDealers = dealers.filter((d) => d.id !== id);
      saveDealers(nextDealers);
      showToast({
        type: 'warning',
        title: 'Dealer Deleted',
        message: target ? `${target.name} removed.` : 'Dealer removed.',
      });
    },
    [dealers, saveDealers, showToast]
  );

  const addDealerNote = useCallback(
    (dealerId: string, content: string) => {
      const newNote = {
        id: 'dn-' + Date.now(),
        authorName: 'Sarah J.',
        authorRole: 'Sales Director',
        content,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      const nextDealers = dealers.map((d) => {
        if (d.id === dealerId) {
          return {
            ...d,
            notes: [newNote, ...(d.notes || [])],
          };
        }
        return d;
      });

      saveDealers(nextDealers);
      showToast({
        type: 'success',
        title: 'Note Added',
        message: 'Dealer note saved successfully.',
      });
    },
    [dealers, saveDealers, showToast]
  );

  // Staff Handlers
  const addStaff = useCallback(
    (staffInput: Omit<Staff, 'id' | 'employeeId' | 'joinedDate'>) => {
      const empNum = String(staff.length + 10).padStart(3, '0');
      const newStaff: Staff = {
        ...staffInput,
        id: 'staff-' + Date.now(),
        employeeId: `EMP-${empNum}`,
        joinedDate: new Date().toISOString().split('T')[0],
        assignedLeadsCount: staffInput.assignedLeadsCount || 0,
        convertedLeadsCount: staffInput.convertedLeadsCount || 0,
        conversionRate: staffInput.conversionRate || 0,
        performanceScore: staffInput.performanceScore || 85,
        pendingFollowUps: staffInput.pendingFollowUps || 0,
        attendanceRate: staffInput.attendanceRate || 95,
      };

      saveStaff([newStaff, ...staff]);

      saveActivities([
        {
          id: 'act-g-stf-' + Date.now(),
          type: 'created',
          title: `New Staff Onboarded: ${newStaff.name}`,
          description: `${newStaff.role} (${newStaff.department})`,
          timestamp: 'Just now',
          authorName: 'HR Management',
        },
        ...activities,
      ]);

      showToast({
        type: 'success',
        title: 'Staff Member Added',
        message: `${newStaff.name} (${newStaff.employeeId}) has been added to the team.`,
      });

      return newStaff;
    },
    [staff, activities, saveStaff, saveActivities, showToast]
  );

  const updateStaff = useCallback(
    (id: string, updates: Partial<Staff>) => {
      const target = staff.find((s) => s.id === id);
      const nextStaff = staff.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveStaff(nextStaff);
      showToast({
        type: 'info',
        title: 'Staff Updated',
        message: `Changes saved for ${target?.name || 'employee'}.`,
      });
    },
    [staff, saveStaff, showToast]
  );

  const deleteStaff = useCallback(
    (id: string) => {
      const target = staff.find((s) => s.id === id);
      const nextStaff = staff.filter((s) => s.id !== id);
      saveStaff(nextStaff);
      showToast({
        type: 'warning',
        title: 'Staff Removed',
        message: target ? `${target.name} has been removed.` : 'Staff removed.',
      });
    },
    [staff, saveStaff, showToast]
  );

  // Notification Handlers
  const markNotificationRead = useCallback(
    (id: string) => {
      const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(next);
    },
    [notifications, saveNotifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(next);
    showToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  }, [notifications, saveNotifications, showToast]);

  const clearNotification = useCallback(
    (id: string) => {
      const next = notifications.filter((n) => n.id !== id);
      saveNotifications(next);
    },
    [notifications, saveNotifications]
  );

  // Settings Handlers
  const updateSettings = useCallback(
    (newSettings: Partial<CRMSettings>) => {
      const updated = { ...settings, ...newSettings };
      saveSettings(updated);
      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your system preferences have been updated.',
      });
    },
    [settings, saveSettings, showToast]
  );

  // Reset to Sample Data
  const resetToSampleData = useCallback(() => {
    saveLeads(INITIAL_LEADS);
    saveDealers(INITIAL_DEALERS);
    saveStaff(INITIAL_STAFF);
    saveActivities(INITIAL_ACTIVITIES);
    saveNotifications(INITIAL_NOTIFICATIONS);
    saveSettings(INITIAL_SETTINGS);
    showToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Restored initial production demo dataset.',
    });
  }, [saveLeads, saveDealers, saveStaff, saveActivities, saveNotifications, saveSettings, showToast]);

  return (
    <CRMContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        leads,
        dealers,
        staff,
        activities,
        notifications,
        settings,
        toasts,
        addLead,
        updateLead,
        deleteLead,
        assignLead,
        convertLeadToDealer,
        addLeadNote,
        addLeadActivity,
        addLeadFollowUp,
        completeFollowUp,
        addDealer,
        updateDealer,
        deleteDealer,
        addDealerNote,
        addStaff,
        updateStaff,
        deleteStaff,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        updateSettings,
        showToast,
        dismissToast,
        openModal,
        modalData,
        setOpenModal,
        closeModal,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        resetToSampleData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
