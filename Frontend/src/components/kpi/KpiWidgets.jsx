import { useSummary } from '@/hooks/useSummary';
import { KpiCard } from './KpiCard';

const TotalKeywordsIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const ClicksIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const ImpressionsIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CtrIcon = () => (
  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const RankIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PriorityIcon = () => (
  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export function KpiWidgets({ filters, search }) {
  const { data, isLoading } = useSummary(filters, search);

  const cards = [
    {
      label:    'Total Keywords',
      value:    data?.total_records,
      format:   'number',
      icon:     <TotalKeywordsIcon />,
      color:    'bg-blue-50',
      subLabel: 'Matching records',
    },
    {
      label:    'Total Clicks',
      value:    data?.total_clicks,
      format:   'compact',
      icon:     <ClicksIcon />,
      color:    'bg-green-50',
      subLabel: 'Across all keywords',
    },
    {
      label:    'Total Impressions',
      value:    data?.total_impressions,
      format:   'compact',
      icon:     <ImpressionsIcon />,
      color:    'bg-purple-50',
      subLabel: 'Across all keywords',
    },
    {
      label:    'Avg. CTR',
      value:    data?.avg_ctr != null ? parseFloat(data.avg_ctr) : null,
      format:   'percent',
      icon:     <CtrIcon />,
      color:    'bg-orange-50',
      subLabel: 'Click-through rate',
    },
    {
      label:    'Avg. Rank',
      value:    data?.avg_rank,
      format:   'decimal',
      icon:     <RankIcon />,
      color:    'bg-red-50',
      subLabel: 'Average position',
    },
    {
      label:    'Priority KWs',
      value:    data?.priority_keywords,
      format:   'number',
      icon:     <PriorityIcon />,
      color:    'bg-yellow-50',
      subLabel: 'High priority keywords',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(card => (
        <KpiCard
          key={card.label}
          {...card}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
