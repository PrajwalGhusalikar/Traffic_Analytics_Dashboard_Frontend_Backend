import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchColumns } from '@/api/keywords';

const STORAGE_KEY = 'dashboard:column-visibility';

export function useColumnConfig() {
  const [savedOverrides, setSavedOverrides] = useState(
    () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  );

  const { data: serverColumns = [] } = useQuery({
    queryKey: ['columns'],
    queryFn:  fetchColumns,
    staleTime: Infinity,
  });

  const columns = serverColumns.map(col => ({
    ...col,
    visible: col.required ? true : (savedOverrides[col.key] ?? col.visible),
  }));

  const setVisibility = (key, visible) => {
    const next = { ...savedOverrides, [key]: visible };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedOverrides(next);
  };

  return { columns, setVisibility };
}
