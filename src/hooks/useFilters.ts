import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Priority, WorkflowStatus } from '../types';

export interface FilterState {
  search: string;
  status: WorkflowStatus | '';
  priority: Priority | '';
  assignee: string;
  myTasks: boolean;
}

export type FilterKey = keyof FilterState;

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    return {
      search: searchParams.get('search') ?? '',
      status: (searchParams.get('status') as WorkflowStatus) ?? '',
      priority: (searchParams.get('priority') as Priority) ?? '',
      assignee: searchParams.get('assignee') ?? '',
      myTasks: searchParams.get('myTasks') === 'true',
    };
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends FilterKey>(key: K, value: FilterState[K]) => {
      setSearchParams(
        (prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          if (value === '' || value === false || value === null || value === undefined) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setSearchParams(
        (prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value === '' || value === false || value === null || value === undefined) {
              newParams.delete(key);
            } else {
              newParams.set(key, String(value));
            }
          });
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        ['search', 'status', 'priority', 'assignee', 'myTasks'].forEach((key) => {
          newParams.delete(key);
        });
        return newParams;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
  };
}

export default useFilters;
