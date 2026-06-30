import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useChartData } from '@/hooks/useChartData';
import { useAnnotations } from '@/hooks/useAnnotations';
import { Spinner } from '@/components/ui/Spinner';
import { AnnotationFormModal, AnnotationsListModal } from './AnnotationModal';
import { ANNOTATION_TYPE_COLORS } from '@/constants/options';

const METRIC_OPTIONS = [
  { key: 'engagement_rate',   label: 'Engagement Rate',  color: '#6366f1' },
  { key: 'active_users',      label: 'Active Users',     color: '#10b981' },
  { key: 'new_users',         label: 'New Users',        color: '#f59e0b' },
  { key: 'total_impressions', label: 'Impressions',      color: '#3b82f6' },
  { key: 'total_clicks',      label: 'Clicks',           color: '#ec4899' },
  { key: 'avg_ctr',           label: 'CTR (%)',          color: '#8b5cf6' },
  { key: 'avg_rank',          label: 'Avg. Rank',        color: '#ef4444' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
}

function formatAxisDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-gray-700 mb-2">{formatDate(label)}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-600">{p.name}</span>
          </span>
          <span className="font-semibold text-gray-900">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function AnnotationLabel({ viewBox, count, color, onClick }) {
  if (!viewBox) return null;
  const { x, y, height } = viewBox;
  const cy = y + height + 10;
  return (
    <g onClick={onClick} className="cursor-pointer" style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={cy} r={9} fill={color} />
      <text x={x} y={cy + 4} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">
        {count > 9 ? '9+' : count}
      </text>
    </g>
  );
}

export function InsightsChart({ dateFrom, dateTo, onDateRangeChange }) {
  const { data: rawData = [], isLoading } = useChartData({ date_from: dateFrom, date_to: dateTo });
  const { data: annotations = [] }        = useAnnotations({ date_from: dateFrom, date_to: dateTo });

  const [visibleMetrics, setVisibleMetrics] = useState(
    new Set(['engagement_rate', 'active_users', 'new_users', 'total_impressions'])
  );
  const [showAnnotationsList, setShowAnnotationsList] = useState(false);
  const [showAnnotationForm,  setShowAnnotationForm]  = useState(false);
  const [editAnnotation,      setEditAnnotation]      = useState(null);
  const [formDefaultDate,     setFormDefaultDate]     = useState('');

  const chartData = rawData.map(d => ({
    ...d,
    avg_ctr:         parseFloat(d.avg_ctr),
    engagement_rate: parseFloat(d.engagement_rate),
  }));

  const annotationsByDate = useMemo(() => {
    const map = new Map();
    annotations.forEach(a => {
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    });
    return map;
  }, [annotations]);

  const toggleMetric = (key) => {
    setVisibleMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return next;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const openEditAnnotation = (a) => {
    setEditAnnotation(a);
    setShowAnnotationsList(false);
    setShowAnnotationForm(true);
  };

  const openAddAnnotation = (date) => {
    setEditAnnotation(null);
    setFormDefaultDate(date ?? new Date().toISOString().slice(0, 10));
    setShowAnnotationsList(false);
    setShowAnnotationForm(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Traffic Insights</h2>
          <p className="text-xs text-gray-400 mt-0.5">Daily metrics over time</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From</label>
            <input
              type="date"
              value={dateFrom ?? ''}
              onChange={e => onDateRangeChange(e.target.value, dateTo ?? '')}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-xs text-gray-500">To</label>
            <input
              type="date"
              value={dateTo ?? ''}
              onChange={e => onDateRangeChange(dateFrom ?? '', e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAnnotationsList(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Annotations ({String(annotations.length).padStart(2, '0')})
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => openAddAnnotation()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Annotation
          </button>
        </div>
      </div>

      {/* Metric toggles */}
      <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-gray-100">
        {METRIC_OPTIONS.map(m => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              visibleMetrics.has(m.key)
                ? 'border-transparent text-white shadow-sm'
                : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
            }`}
            style={visibleMetrics.has(m.key) ? { backgroundColor: m.color, borderColor: m.color } : {}}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: visibleMetrics.has(m.key) ? 'rgba(255,255,255,0.7)' : m.color }}
            />
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 pt-4" style={{ height: 340 }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatAxisDate}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8, display: 'none' }}
              />
              {METRIC_OPTIONS.filter(m => visibleMetrics.has(m.key)).map(m => (
                <Line
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  name={m.label}
                />
              ))}
              {/* Annotation reference lines */}
              {Array.from(annotationsByDate.entries()).map(([date, anns]) => (
                <ReferenceLine
                  key={date}
                  x={date}
                  stroke={ANNOTATION_TYPE_COLORS[anns[0]?.annotation_type] ?? '#6b7280'}
                  strokeDasharray="4 2"
                  strokeWidth={1.5}
                  label={
                    <AnnotationLabel
                      count={anns.length}
                      color={ANNOTATION_TYPE_COLORS[anns[0]?.annotation_type] ?? '#6b7280'}
                      onClick={() => {
                        if (anns.length === 1) {
                          openEditAnnotation(anns[0]);
                        } else {
                          setShowAnnotationsList(true);
                        }
                      }}
                    />
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Modals */}
      <AnnotationsListModal
        open={showAnnotationsList}
        onClose={() => setShowAnnotationsList(false)}
        annotations={annotations}
        onEdit={openEditAnnotation}
        onAdd={() => openAddAnnotation()}
      />
      <AnnotationFormModal
        open={showAnnotationForm}
        onClose={() => { setShowAnnotationForm(false); setEditAnnotation(null); }}
        defaultDate={formDefaultDate}
        annotation={editAnnotation}
      />
    </div>
  );
}
