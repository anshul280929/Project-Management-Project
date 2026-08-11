import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Project } from '../types';

/**
 * Custom hook to retrieve the currently active Project based on the `:projectId` route parameter.
 * Returns the matching Project object if found, or `null` if missing/invalid.
 */
export function useActiveProject(): Project | null {
  const { projectId } = useParams<{ projectId: string }>();
  const { state } = useAppContext();

  const activeProject = useMemo(() => {
    if (!projectId) return null;
    return state.projects.find((p) => p.id === projectId) ?? null;
  }, [projectId, state.projects]);

  return activeProject;
}

export default useActiveProject;
