import { PAGE_SIZE_OPTIONS } from '@/constants/options';

export function TablePagination({ pagination, totalPages, totalRecords, onChange, isFetching }) {
  const { page, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, totalRecords);

  const pages = buildPageNumbers(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{start.toLocaleString()}</span>–
          <span className="font-medium text-gray-700">{end.toLocaleString()}</span> of{' '}
          <span className="font-medium text-gray-700">{totalRecords.toLocaleString()}</span> results
          {isFetching && <span className="ml-2 text-blue-500 text-xs animate-pulse">Loading…</span>}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rows:</span>
          <select
            value={limit}
            onChange={e => onChange({ page: 1, limit: Number(e.target.value) })}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onChange({ ...pagination, page: 1 })}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="First page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => onChange({ ...pagination, page: page - 1 })}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Previous page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange({ ...pagination, page: p })}
                className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors border ${
                  p === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onChange({ ...pagination, page: page + 1 })}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Next page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => onChange({ ...pagination, page: totalPages })}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Last page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}
