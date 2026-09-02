import React from 'react';
import { Search } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchTerm: string;
  onSearchChange?: (term: string) => void;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onToggleSelect?: (id: string) => void;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function CommonTable<T>({
  data,
  columns,
  keyExtractor,
  searchTerm,
  onSearchChange,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  onRowClick,
  actions,
  pagination,
}: CommonTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              {onSelectAll && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds?.length === data.length}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds?.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(item)}
                    className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    {onToggleSelect && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
