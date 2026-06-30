import { Spinner } from '@/components/ui/Spinner';

function formatValue(value, format) {
  if (value == null) return '—';
  switch (format) {
    case 'percent':  return `${value.toFixed(2)}%`;
    case 'decimal':  return value.toFixed(1);
    case 'compact':
      if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
      if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000)         return `${(value / 1_000).toFixed(1)}k`;
      return String(value);
    default:
      return value.toLocaleString();
  }
}

export function KpiCard({ label, value, format, icon, color, loading, subLabel }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-lg ${color} flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
        {loading ? (
          <div className="mt-2">
            <Spinner size="sm" />
          </div>
        ) : (
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">
            {formatValue(value, format)}
          </p>
        )}
        {subLabel && !loading && (
          <p className="mt-0.5 text-xs text-gray-400">{subLabel}</p>
        )}
      </div>
    </div>
  );
}
