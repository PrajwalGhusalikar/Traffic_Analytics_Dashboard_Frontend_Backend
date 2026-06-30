import api from '@/lib/api';

export async function fetchAnnotations(params) {
  const qs = new URLSearchParams();
  if (params.date_from) qs.set('date_from', params.date_from);
  if (params.date_to)   qs.set('date_to',   params.date_to);
  params.annotation_type?.forEach(t => qs.append('annotation_type', t));

  const { data } = await api.get(`/annotations/?${qs}`);
  return data;
}

export async function createAnnotation(payload) {
  const { data } = await api.post('/annotations/', payload);
  return data;
}

export async function updateAnnotation(id, payload) {
  const { data } = await api.patch(`/annotations/${id}/`, payload);
  return data;
}

export async function deleteAnnotation(id) {
  await api.delete(`/annotations/${id}/`);
}
