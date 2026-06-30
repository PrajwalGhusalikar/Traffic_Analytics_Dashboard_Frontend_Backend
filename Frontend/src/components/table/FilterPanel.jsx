import { useState } from 'react';
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  DEVICE_TYPE_OPTIONS,
  SOURCE_TYPE_OPTIONS,
} from '@/constants/options';

function MultiCheckbox({ label, options, selected, onChange }) {
  const sel = selected ?? [];
  const toggle = (v) => {
    if (sel.includes(v)) onChange(sel.filter(x => x !== v));
    else                 onChange([...sel, v]);
  };
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={sel.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function countActiveFilters(filters) {
  let count = 0;
  if (filters.category?.length)    count++;
  if (filters.status?.length)      count++;
  if (filters.device_type?.length) count++;
  if (filters.source_type?.length) count++;
  if (filters.rank_min != null)    count++;
  if (filters.rank_max != null)    count++;
  if (filters.is_priority != null) count++;
  return count;
}

export function FilterPanel({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
          activeCount > 0
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
            {activeCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-5 w-[480px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filter Keywords</h3>
              {activeCount > 0 && (
                <button
                  onClick={() => { onReset(); setOpen(false); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              <MultiCheckbox
                label="Category"
                options={CATEGORY_OPTIONS}
                selected={filters.category}
                onChange={vals => onChange({ ...filters, category: vals.length ? vals : undefined })}
              />
              <MultiCheckbox
                label="Status"
                options={STATUS_OPTIONS}
                selected={filters.status}
                onChange={vals => onChange({ ...filters, status: vals.length ? vals : undefined })}
              />
              <MultiCheckbox
                label="Device Type"
                options={DEVICE_TYPE_OPTIONS}
                selected={filters.device_type}
                onChange={vals => onChange({ ...filters, device_type: vals.length ? vals : undefined })}
              />
              <MultiCheckbox
                label="Source Type"
                options={SOURCE_TYPE_OPTIONS}
                selected={filters.source_type}
                onChange={vals => onChange({ ...filters, source_type: vals.length ? vals : undefined })}
              />

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rank Range</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min rank"
                      min={1}
                      value={filters.rank_min ?? ''}
                      onChange={e => onChange({ ...filters, rank_min: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">—</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max rank"
                      min={1}
                      value={filters.rank_max ?? ''}
                      onChange={e => onChange({ ...filters, rank_max: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Priority</p>
                <div className="flex gap-3">
                  {[
                    { value: undefined,   label: 'All' },
                    { value: true,        label: 'Priority Only' },
                    { value: false,       label: 'Non-Priority' },
                  ].map(opt => (
                    <label key={String(opt.value)} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="is_priority"
                        checked={filters.is_priority === opt.value}
                        onChange={() => onChange({ ...filters, is_priority: opt.value })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ActiveFilterChips({ filters, onChange }) {
  const chips = [];

  filters.category?.forEach(v => chips.push({
    label: `Category: ${CATEGORY_OPTIONS.find(o => o.value === v)?.label ?? v}`,
    onRemove: () => onChange({ ...filters, category: filters.category?.filter(x => x !== v) }),
  }));
  filters.status?.forEach(v => chips.push({
    label: `Status: ${STATUS_OPTIONS.find(o => o.value === v)?.label ?? v}`,
    onRemove: () => onChange({ ...filters, status: filters.status?.filter(x => x !== v) }),
  }));
  filters.device_type?.forEach(v => chips.push({
    label: `Device: ${DEVICE_TYPE_OPTIONS.find(o => o.value === v)?.label ?? v}`,
    onRemove: () => onChange({ ...filters, device_type: filters.device_type?.filter(x => x !== v) }),
  }));
  filters.source_type?.forEach(v => chips.push({
    label: `Source: ${SOURCE_TYPE_OPTIONS.find(o => o.value === v)?.label ?? v}`,
    onRemove: () => onChange({ ...filters, source_type: filters.source_type?.filter(x => x !== v) }),
  }));
  if (filters.rank_min != null) chips.push({
    label: `Rank ≥ ${filters.rank_min}`,
    onRemove: () => onChange({ ...filters, rank_min: undefined }),
  });
  if (filters.rank_max != null) chips.push({
    label: `Rank ≤ ${filters.rank_max}`,
    onRemove: () => onChange({ ...filters, rank_max: undefined }),
  });
  if (filters.is_priority != null) chips.push({
    label: filters.is_priority ? 'Priority Only' : 'Non-Priority',
    onRemove: () => onChange({ ...filters, is_priority: undefined }),
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
