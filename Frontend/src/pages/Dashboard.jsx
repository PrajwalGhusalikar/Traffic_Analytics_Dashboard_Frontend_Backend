import { useState, useCallback } from 'react';
import { KpiWidgets } from '@/components/kpi/KpiWidgets';
import { InsightsChart } from '@/components/chart/InsightsChart';
import { DataTable } from '@/components/table/DataTable';

export function Dashboard() {
  const [filters,    setFilters]   = useState({});
  const [search,     setSearch]    = useState('');
  const [dateFrom,   setDateFrom]  = useState('');
  const [dateTo,     setDateTo]    = useState('');

  const handleDateRangeChange = useCallback((from, to) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  const handleSearchChange = useCallback((s) => {
    setSearch(s);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Analytics Dashboard</span>
          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Widgets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Summary</h1>
          </div>
          <KpiWidgets filters={filters} search={search} />
        </section>

        {/* Insights Chart */}
        <section>
          <InsightsChart
            dateFrom={dateFrom || undefined}
            dateTo={dateTo || undefined}
            onDateRangeChange={handleDateRangeChange}
          />
        </section>

        {/* Data Table */}
        <section>
          <DataTable
            filters={filters}
            onFiltersChange={setFilters}
            search={search}
            onSearchChange={handleSearchChange}
          />
        </section>
      </main>
    </div>
  );
}
