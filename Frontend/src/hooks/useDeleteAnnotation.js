import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAnnotation } from '@/api/annotations';

export function useDeleteAnnotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnotation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}
