import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  addStory as addStoryAction,
  updateStory as updateStoryAction,
  deleteStory as deleteStoryAction,
  changeStatus as changeStatusAction,
} from '../context/actions';
import { Priority, WorkflowStatus, type Story } from '../types';

export type CreateStoryInput = {
  projectId: string;
  title: string;
  description?: string;
  priority?: Priority;
  storyPoints?: number;
  assignedUserId?: string | null;
  status?: WorkflowStatus;
};

export function useStories(projectId?: string) {
  const { state, dispatch } = useAppContext();

  const allStories = state.stories;

  const stories = useMemo(() => {
    if (!projectId) return allStories;
    return allStories.filter((story) => story.projectId === projectId);
  }, [allStories, projectId]);

  const getStoriesByProject = useCallback(
    (pId: string): Story[] => {
      return allStories.filter((story) => story.projectId === pId);
    },
    [allStories]
  );

  const getStoryById = useCallback(
    (storyId: string): Story | undefined => {
      return allStories.find((story) => story.id === storyId);
    },
    [allStories]
  );

  const addStory = useCallback(
    (input: CreateStoryInput): Story => {
      const now = new Date().toISOString();
      const newStory: Story = {
        id: crypto.randomUUID(),
        projectId: input.projectId,
        title: input.title,
        description: input.description ?? '',
        priority: input.priority ?? Priority.MEDIUM,
        storyPoints: input.storyPoints ?? 1,
        assignedUserId: input.assignedUserId ?? null,
        status: input.status ?? WorkflowStatus.BACKLOG,
        createdDate: now,
        updatedDate: now,
      };
      dispatch(addStoryAction(newStory));
      return newStory;
    },
    [dispatch]
  );

  const updateStory = useCallback(
    (story: Story) => {
      const updatedStory: Story = {
        ...story,
        updatedDate: new Date().toISOString(),
      };
      dispatch(updateStoryAction(updatedStory));
    },
    [dispatch]
  );

  const deleteStory = useCallback(
    (storyId: string) => {
      dispatch(deleteStoryAction(storyId));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    (storyId: string, newStatus: WorkflowStatus) => {
      dispatch(changeStatusAction(storyId, newStatus));
    },
    [dispatch]
  );

  return {
    stories,
    allStories,
    getStoriesByProject,
    getStoryById,
    addStory,
    updateStory,
    deleteStory,
    changeStatus,
  };
}
