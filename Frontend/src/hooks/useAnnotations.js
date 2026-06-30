import { useQuery } from '@tanstack/react-query';
import { fetchAnnotations } from '@/api/annotations';

export function useAnnotations(params = {}) {
  return useQuery({
    queryKey: ['annotations', params],
    queryFn:  () => fetchAnnotations(params),
  });
}
