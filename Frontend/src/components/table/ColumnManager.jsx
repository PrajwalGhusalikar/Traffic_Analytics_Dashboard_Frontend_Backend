import { useState } from 'react';

export function ColumnManager({ columns, onToggle }) {
  const [open, setOpen] = useState(false);

  const visibleCount  = columns.filter(c => c.visible).length;
  const totalCount    = columns.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Columns
        <span className="text-xs text-gray-400">({visibleCount}/{totalCount})</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-64 py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Manage Columns</p>
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {columns.map(col => (
                <label
                  key={col.key}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    col.required ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={col.visible}
                    disabled={col.required}
                    onChange={e => !col.required && onToggle(col.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 flex-1">{col.label}</span>
                  {col.required && (
                    <span className="text-xs text-gray-400 italic">Required</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
