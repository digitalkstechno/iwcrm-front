export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Qualified'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type LeadSource =
  | 'Website Form'
  | 'Trade Show'
  | 'Referral'
  | 'Cold Call'
  | 'Social Media'
  | 'Google Search'
  | 'Partner'
  | 'Email Campaign';

export type DealerStatus = 'Active' | 'Inactive' | 'Pending' | 'Blocked';

export type StaffStatus = 'Active' | 'Inactive' | 'On Leave';

export type StaffRole =
  | 'Sales Director'
  | 'Regional Manager'
  | 'Senior Account Exec'
  | 'Sales Representative'
  | 'CRM Specialist'
  | 'Support Lead';

export interface ActivityItem {
  id: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note' | 'status_change' | 'assigned' | 'converted' | 'follow_up' | 'created';
  title: string;
  description: string;
  timestamp: string;
  authorName: string;
  authorAvatar?: string;
  meta?: {
    fromStatus?: string;
    toStatus?: string;
    assignedTo?: string;
    duration?: string;
    outcome?: string;
  };
}

export interface FollowUpItem {
  id: string;
  leadId?: string;
  leadName?: string;
  dealerId?: string;
  dealerName?: string;
  type: 'Call' | 'Meeting' | 'Email' | 'WhatsApp' | 'Demo' | 'Contract Review';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  assignedStaffId: string;
  assignedStaffName: string;
  notes: string;
  completed: boolean;
  priority: LeadPriority;
}

export interface NoteItem {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  pinned?: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

export interface Lead {
  id: string;
  leadCode: string; // e.g., LD-8492
  name: string;
  company: string;
  phone: string;
  email: string;
  source: LeadSource;
  assignedStaffId: string;
  assignedStaffName: string;
  assignedStaffAvatar?: string;
  status: LeadStatus;
  priority: LeadPriority;
  createdDate: string;
  lastFollowUp: string;
  estimatedValue?: number;
  location?: string;
  industry?: string;
  website?: string;
  notes?: NoteItem[];
  activities?: ActivityItem[];
  followUps?: FollowUpItem[];
  documents?: DocumentItem[];
  convertedToDealerId?: string;
}

export interface Dealer {
  id: string;
  dealerCode: string; // e.g., DLR-1042
  name: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  region?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffAvatar?: string;
  totalLeads: number;
  convertedLeads?: number;
  conversionRate?: number;
  creditLimit?: number;
  status: DealerStatus;
  lastActivity?: string;
  joinedDate?: string;
  joinDate?: string;
  rating?: number;
  revenue?: number;
  tier?: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  notes?: NoteItem[];
  activities?: ActivityItem[];
  followUps?: FollowUpItem[];
  documents?: DocumentItem[];
}

export type StaffMember = Staff;

export interface Staff {
  id: string;
  employeeId: string; // e.g., EMP-034
  name: string;
  photo: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  assignedLeadsCount: number;
  convertedLeadsCount: number;
  conversionRate: number; // percentage e.g. 68
  performanceScore: number; // 0-100
  status: StaffStatus;
  joinedDate: string;
  location: string;
  pendingFollowUps: number;
  attendanceRate: number; // e.g. 96
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'lead' | 'dealer' | 'staff' | 'system' | 'followup';
  linkTab?: string;
  linkId?: string;
}

export interface CRMStats {
  totalLeads: number;
  leadsChange: number; // e.g. +12
  newLeads: number;
  newLeadsChange: number; // e.g. +5
  convertedLeads: number;
  convertedLeadsChange: number; // e.g. +8
  totalDealers: number;
  activeDealers: number;
  newDealers: number;
  totalStaff: number;
}

export interface CRMSettings {
  company: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    timezone: string;
    currency: string;
    logoUrl?: string;
  };
  leadConfig: {
    statuses: { name: LeadStatus; color: string; isDefault?: boolean }[];
    sources: LeadSource[];
    autoAssignLeads: boolean;
    defaultPriority: LeadPriority;
  };
  staffConfig: {
    roles: string[];
    departments: string[];
  };
  notifications: {
    emailAlerts: boolean;
    followUpReminders: boolean;
    leadAssignmentPush: boolean;
    dailyDigest: boolean;
    weeklyReportEmail: boolean;
  };
}
