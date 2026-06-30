import { useQuery } from '@tanstack/react-query';
import { fetchKeywords } from '@/api/keywords';

export function useKeywords(params) {
  return useQuery({
    queryKey: ['keywords', params],
    queryFn:  () => fetchKeywords(params),
    placeholderData: (prev) => prev,
  });
}
