import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAnnotation } from '@/api/annotations';

export function useUpdateAnnotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAnnotation(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}
