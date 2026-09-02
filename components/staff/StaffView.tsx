'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StaffMember, StaffStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Search,
  Plus,
  UserCheck,
  TrendingUp,
  Mail,
  Phone,
  Edit2,
  Trash2,
  ExternalLink,
  Award,
  Users,
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { staff, setOpenModal, deleteStaff, leads } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        searchTerm === '' ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = departmentFilter === 'All' || s.department === departmentFilter;
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [staff, searchTerm, departmentFilter, statusFilter]);

  return (
    <div id="staff-module" className="space-y-5 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Staff</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage sales reps, dealer account managers, performance quotas, and assignments.
          </p>
        </div>

        <button
          id="staff-add-btn"
          onClick={() => setOpenModal('staff_form')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Team Members</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{32 + (staff.length - 7)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">92% Active in Field</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Top Performer</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">Marcus Vance</p>
          <span className="text-[11px] text-emerald-600 font-semibold">78% Win Rate</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Response Time</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">18 mins</p>
          <span className="text-[11px] text-slate-400 font-normal">SLA benchmark: 30m</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Pipeline Closed</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">$4.85M</p>
          <span className="text-[11px] text-emerald-600 font-medium">+14% vs Target</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="staff-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name, role, ID, or email..."
              className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              <option value="Enterprise Sales">Enterprise Sales</option>
              <option value="Dealer Operations">Dealer Operations</option>
              <option value="Executive">Executive</option>
              <option value="Client Success">Client Success</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Department & Role</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold text-right">Assigned Leads</th>
                <th className="py-3 px-4 font-semibold text-right">Conv. Rate</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => {
                const assignedCount = leads.filter((l) => l.assignedStaffId === member.id).length;

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setOpenModal('staff_detail', member)}
                  >
                    {/* Name & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-none">
                            #{member.employeeId} · Joined {member.joinedDate}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 leading-tight">{member.role}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{member.department}</p>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs text-slate-700">{member.email}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{member.phone}</p>
                    </td>

                    {/* Assigned Leads */}
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-slate-800">
                      {member.assignedLeadsCount + assignedCount}
                    </td>

                    {/* Conversion Rate */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {member.conversionRate}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={member.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setOpenModal('staff_detail', member)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setOpenModal('staff_form', member)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Edit Staff"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove staff member ${member.name}?`)) {
                              deleteStaff(member.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
