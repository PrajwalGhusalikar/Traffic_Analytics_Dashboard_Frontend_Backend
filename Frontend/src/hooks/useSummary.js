import { useQuery } from '@tanstack/react-query';
import { fetchSummary } from '@/api/dashboard';

export function useSummary(filters, search) {
  return useQuery({
    queryKey: ['summary', filters, search],
    queryFn:  () => fetchSummary(filters, search),
  });
}
