import { useState, useEffect, useCallback } from 'react';
import { useKeywords } from '@/hooks/useKeywords';
import { useColumnConfig } from '@/hooks/useColumnConfig';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterPanel, ActiveFilterChips } from './FilterPanel';
import { ColumnManager } from './ColumnManager';
import { TablePagination } from './TablePagination';
import { Spinner } from '@/components/ui/Spinner';

function SortIcon({ active, dir }) {
  if (!active) return (
    <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
  return dir === 'asc' ? (
    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function formatCellValue(col, value) {
  if (value == null || value === '') return <span className="text-gray-300">—</span>;

  switch (col) {
    case 'monthly_searches':
    case 'clicks':
    case 'impressions': {
      const n = Number(value);
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
      return n.toLocaleString();
    }
    case 'ctr':
      return `${parseFloat(String(value)).toFixed(2)}%`;
    case 'rank':
    case 'previous_rank':
      return Number(value).toFixed(1);
    case 'status':
      return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          value === 'active'   ? 'bg-green-100 text-green-700' :
          value === 'inactive' ? 'bg-gray-100 text-gray-600' :
                                 'bg-yellow-100 text-yellow-700'
        }`}>
          {String(value)}
        </span>
      );
    case 'category':
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
          {String(value)}
        </span>
      );
    case 'device_type':
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 capitalize">
          {String(value)}
        </span>
      );
    case 'source_type':
      return (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 capitalize">
          {String(value)}
        </span>
      );
    case 'is_priority':
      return value ? (
        <svg className="w-4 h-4 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : null;
    case 'landing_page': {
      const url = String(value);
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-xs truncate block max-w-[200px]">
          {url.replace(/^https?:\/\//, '')}
        </a>
      );
    }
    case 'created_at':
      return new Date(String(value)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    default:
      return String(value);
  }
}

function exportToCsv(rows, visibleKeys) {
  const header = visibleKeys.join(',');
  const body = rows.map(row =>
    visibleKeys.map(k => {
      const v = row[k];
      if (v == null) return '';
      const s = String(v);
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')
  ).join('\n');
  const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `keywords_export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable({ filters, onFiltersChange, search, onSearchChange }) {
  const [pagination, setPagination] = useState({ page: 1, limit: 50 });
  const [sort,       setSort]       = useState({});
  const [localSearch, setLocalSearch] = useState(search);
  const [showPriority, setShowPriority] = useState(false);

  const [debouncedSearch] = useDebounce(localSearch, 300);
  const { columns, setVisibility } = useColumnConfig();

  useEffect(() => {
    onSearchChange(debouncedSearch);
    setPagination(p => ({ ...p, page: 1 }));
  }, [debouncedSearch, onSearchChange]);

  useEffect(() => {
    setPagination(p => ({ ...p, page: 1 }));
  }, [filters]);

  const effectiveFilters = showPriority
    ? { ...filters, is_priority: true }
    : filters;

  const { data, isLoading, isFetching } = useKeywords({
    ...pagination,
    ...sort,
    ...effectiveFilters,
    search: debouncedSearch,
  });

  const visibleColumns = columns.filter(c => c.visible);

  const handleSort = useCallback((key) => {
    setSort(prev => {
      if (prev.sortBy === key) {
        if (prev.sortOrder === 'asc') return { sortBy: key, sortOrder: 'desc' };
        return {};
      }
      return { sortBy: key, sortOrder: 'asc' };
    });
    setPagination(p => ({ ...p, page: 1 }));
  }, []);

  const handleFiltersReset = () => {
    onFiltersChange({});
    setShowPriority(false);
  };

  const rows = data?.results ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-gray-900">Detailed Keyword Table</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPriority(false)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  !showPriority
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Keywords {data?.count != null && !showPriority ? `(${data.count.toLocaleString()})` : ''}
              </button>
              <button
                onClick={() => setShowPriority(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  showPriority
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Priority Keywords
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColumnManager columns={columns} onToggle={setVisibility} />
            <button
              onClick={() => exportToCsv(rows, visibleColumns.map(c => c.key))}
              disabled={rows.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search keywords..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <FilterPanel
            filters={effectiveFilters}
            onChange={f => { onFiltersChange(f); setShowPriority(f.is_priority === true); }}
            onReset={handleFiltersReset}
          />
        </div>

        {/* Active filter chips */}
        <div className="mt-3">
          <ActiveFilterChips filters={effectiveFilters} onChange={f => { onFiltersChange(f); setShowPriority(f.is_priority === true); }} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  style={{ minWidth: col.width, maxWidth: col.width }}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none group hover:bg-gray-100 transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        active={sort.sortBy === col.key}
                        dir={sort.sortBy === col.key ? sort.sortOrder : undefined}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-16 text-center">
                  <div className="flex items-center justify-center gap-3 text-gray-400">
                    <Spinner size="md" />
                    <span className="text-sm">Loading keywords…</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-16 text-center">
                  <div className="text-gray-400">
                    <svg className="mx-auto w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">No keywords found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`hover:bg-blue-50/40 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/30' : ''} ${isFetching ? 'opacity-70' : ''}`}
                >
                  {visibleColumns.map(col => (
                    <td
                      key={col.key}
                      style={{ minWidth: col.width, maxWidth: col.width }}
                      className={`px-4 py-3 text-gray-700 ${col.key === 'keyword' ? 'font-medium text-gray-900' : ''}`}
                    >
                      <div className={col.key === 'keyword' ? 'max-w-[260px] truncate' : ''}>
                        {formatCellValue(col.key, row[col.key])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.count > 0 && (
        <TablePagination
          pagination={pagination}
          totalPages={data.total_pages}
          totalRecords={data.count}
          onChange={setPagination}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}
