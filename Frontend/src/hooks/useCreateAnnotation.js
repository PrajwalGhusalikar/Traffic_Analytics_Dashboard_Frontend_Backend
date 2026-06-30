import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnnotation } from '@/api/annotations';

export function useCreateAnnotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAnnotation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}
