import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  addProject as addProjectAction,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
} from '../context/actions';
import type { Project } from '../types';

export function useProjects() {
  const { state, dispatch } = useAppContext();

  const addProject = useCallback(
    (name: string, description: string = '', members: string[] = []): Project => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        createdDate: new Date().toISOString(),
        members,
      };
      dispatch(addProjectAction(newProject));
      return newProject;
    },
    [dispatch]
  );

  const updateProject = useCallback(
    (project: Project) => {
      dispatch(updateProjectAction(project));
    },
    [dispatch]
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      dispatch(deleteProjectAction(projectId));
    },
    [dispatch]
  );

  const getProjectById = useCallback(
    (id: string): Project | undefined => {
      return state.projects.find((p) => p.id === id);
    },
    [state.projects]
  );

  return {
    projects: state.projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
  };
}
