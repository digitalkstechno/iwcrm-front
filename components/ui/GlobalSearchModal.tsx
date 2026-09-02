'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Search, Users, Store, UserCheck, ArrowRight, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    leads,
    dealers,
    staff,
    setActiveTab,
    setOpenModal,
  } = useCRM();

  const [term, setTerm] = useState(searchQuery || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const normalized = term.toLowerCase().trim();

  const matchedLeads = normalized
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(normalized) ||
          l.company.toLowerCase().includes(normalized) ||
          l.email.toLowerCase().includes(normalized) ||
          l.leadCode.toLowerCase().includes(normalized)
      ).slice(0, 4)
    : leads.slice(0, 3);

  const matchedDealers = normalized
    ? dealers.filter(
        (d) =>
          d.name.toLowerCase().includes(normalized) ||
          d.company.toLowerCase().includes(normalized) ||
          d.location.toLowerCase().includes(normalized) ||
          d.dealerCode.toLowerCase().includes(normalized) ||
          d.contactPerson.toLowerCase().includes(normalized)
      ).slice(0, 4)
    : dealers.slice(0, 3);

  const matchedStaff = normalized
    ? staff.filter(
        (s) =>
          s.name.toLowerCase().includes(normalized) ||
          s.email.toLowerCase().includes(normalized) ||
          s.role.toLowerCase().includes(normalized) ||
          s.department.toLowerCase().includes(normalized) ||
          s.employeeId.toLowerCase().includes(normalized)
      ).slice(0, 4)
    : staff.slice(0, 3);

  const handleSelectLead = (lead: any) => {
    setIsSearchOpen(false);
    setActiveTab('leads');
    setOpenModal('lead_detail', lead);
  };

  const handleSelectDealer = (dealer: any) => {
    setIsSearchOpen(false);
    setActiveTab('dealers');
    setOpenModal('dealer_detail', dealer);
  };

  const handleSelectStaff = (staffMember: any) => {
    setIsSearchOpen(false);
    setActiveTab('staff');
    setOpenModal('staff_detail', staffMember);
  };

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="global-search-input"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search leads, dealers, staff, or commands..."
            className="w-full text-slate-900 placeholder:text-slate-400 text-base focus:outline-hidden bg-transparent"
          />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Leads ({matchedLeads.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('leads');
                  }}
                  className="text-blue-600 hover:underline flex items-center gap-0.5 lowercase text-xs"
                >
                  View all leads <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                          {lead.name}
                          <span className="text-xs text-slate-400 font-normal ml-2">
                            #{lead.leadCode} · {lead.company}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 truncate">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <StatusBadge status={lead.status} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dealers */}
          {matchedDealers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" /> Dealers ({matchedDealers.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('dealers');
                  }}
                  className="text-blue-600 hover:underline flex items-center gap-0.5 lowercase text-xs"
                >
                  View all dealers <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedDealers.map((dealer) => (
                  <button
                    key={dealer.id}
                    onClick={() => handleSelectDealer(dealer)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {dealer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                          {dealer.name}
                          <span className="text-xs text-slate-400 font-normal ml-2">
                            #{dealer.dealerCode} · {dealer.location}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          Contact: {dealer.contactPerson} · Leads: {dealer.totalLeads.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <StatusBadge status={dealer.status} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Staff */}
          {matchedStaff.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Staff ({matchedStaff.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveTab('staff');
                  }}
                  className="text-blue-600 hover:underline flex items-center gap-0.5 lowercase text-xs"
                >
                  View all staff <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {matchedStaff.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectStaff(member)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                          {member.name}
                          <span className="text-xs text-slate-400 font-normal ml-2">
                            #{member.employeeId} · {member.role}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {member.department} · {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs font-semibold text-emerald-600">
                        {member.conversionRate}% conv
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedLeads.length === 0 && matchedDealers.length === 0 && matchedStaff.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No matching records found for &ldquo;{term}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different term or ID.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Navigate with mouse or click any row</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
