import api from '@/lib/api';
import { buildKeywordParams } from './keywords';

export async function fetchSummary(filters, search) {
  const qs = new URLSearchParams(buildKeywordParams({
    page: 1, limit: 50, search, ...filters,
  }));
  filters.category?.forEach(v    => qs.append('category',    v));
  filters.status?.forEach(v      => qs.append('status',      v));
  filters.device_type?.forEach(v => qs.append('device_type', v));
  filters.source_type?.forEach(v => qs.append('source_type', v));

  const { data } = await api.get(`/dashboard/summary/?${qs}`);
  return data;
}

export async function fetchChartData(params) {
  const qs = new URLSearchParams();
  if (params.date_from) qs.set('date_from', params.date_from);
  if (params.date_to)   qs.set('date_to',   params.date_to);

  const { data } = await api.get(`/dashboard/chart/?${qs}`);
  return data;
}
