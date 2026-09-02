'use client';

import React from 'react';
import { LeadStatus, LeadPriority, DealerStatus, StaffStatus } from '@/lib/types';
import { AlertCircle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface StatusBadgeProps {
  status: LeadStatus | DealerStatus | StaffStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Lead Statuses
    case 'New':
      colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Contacted':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'Follow-up':
      colorStyles = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Qualified':
      colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Negotiation':
      colorStyles = 'bg-orange-50 text-orange-700 border-orange-200';
      break;
    case 'Converted':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Lost':
      colorStyles = 'bg-slate-100 text-slate-600 border-slate-200';
      break;

    // Dealer & Staff Statuses
    case 'Active':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Inactive':
      colorStyles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Pending':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'Blocked':
      colorStyles = 'bg-red-50 text-red-800 border-red-200';
      break;
    case 'On Leave':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    default:
      colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorStyles} ${sizeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: LeadPriority; className?: string }> = ({
  priority,
  className = '',
}) => {
  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-xs text-red-600 ${className}`}>
          <span className="font-bold text-red-600">!</span>
          <span>Urgent</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-xs text-amber-600 ${className}`}>
          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>High</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-xs text-slate-600 ${className}`}>
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Medium</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-xs text-slate-400 ${className}`}>
          <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Low</span>
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{priority}</span>;
  }
};
