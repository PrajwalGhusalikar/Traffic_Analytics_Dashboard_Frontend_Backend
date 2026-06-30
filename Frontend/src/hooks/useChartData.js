import { useQuery } from '@tanstack/react-query';
import { fetchChartData } from '@/api/dashboard';

export function useChartData(params) {
  return useQuery({
    queryKey: ['chart', params],
    queryFn:  () => fetchChartData(params),
    staleTime: 10 * 60 * 1000,
  });
}
