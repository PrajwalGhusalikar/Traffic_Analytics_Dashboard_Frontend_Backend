import api from '@/lib/api';

export function buildKeywordParams(params) {
  const q = {
    page:  String(params.page),
    limit: String(params.limit),
  };

  if (params.search)                q.search    = params.search;
  if (params.sortBy)                q.sortBy    = params.sortBy;
  if (params.sortOrder)             q.sortOrder = params.sortOrder;
  if (params.rank_min != null)      q.rank_min  = String(params.rank_min);
  if (params.rank_max != null)      q.rank_max  = String(params.rank_max);
  if (params.is_priority != null)   q.is_priority = String(params.is_priority);

  return q;
}

export async function fetchKeywords(params) {
  const qs = new URLSearchParams(buildKeywordParams(params));

  params.category?.forEach(v    => qs.append('category',    v));
  params.status?.forEach(v      => qs.append('status',      v));
  params.device_type?.forEach(v => qs.append('device_type', v));
  params.source_type?.forEach(v => qs.append('source_type', v));

  const { data } = await api.get(`/keywords/?${qs}`);
  return data;
}

export async function fetchColumns() {
  const { data } = await api.get('/keywords/columns/');
  return data;
}
