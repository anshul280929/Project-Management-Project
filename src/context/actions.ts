import type { Project, User, Story, AppState, WorkflowStatus, AppAction } from '../types';

export const ActionTypes = {
  // Projects
  ADD_PROJECT: 'ADD_PROJECT' as const,
  UPDATE_PROJECT: 'UPDATE_PROJECT' as const,
  DELETE_PROJECT: 'DELETE_PROJECT' as const,

  // Users
  ADD_USER: 'ADD_USER' as const,
  UPDATE_USER: 'UPDATE_USER' as const,
  DELETE_USER: 'DELETE_USER' as const,

  // Stories
  ADD_STORY: 'ADD_STORY' as const,
  UPDATE_STORY: 'UPDATE_STORY' as const,
  DELETE_STORY: 'DELETE_STORY' as const,
  CHANGE_STATUS: 'CHANGE_STATUS' as const,

  // Bulk / Storage
  LOAD_STATE: 'LOAD_STATE' as const,
  CLEAR_STATE: 'CLEAR_STATE' as const,
};

// ─── Project Action Creators ─────────────────────────────

export const addProject = (project: Project): AppAction => ({
  type: ActionTypes.ADD_PROJECT,
  payload: project,
});

export const updateProject = (project: Project): AppAction => ({
  type: ActionTypes.UPDATE_PROJECT,
  payload: project,
});

export const deleteProject = (projectId: string): AppAction => ({
  type: ActionTypes.DELETE_PROJECT,
  payload: { projectId },
});

// ─── User Action Creators ────────────────────────────────

export const addUser = (user: User): AppAction => ({
  type: ActionTypes.ADD_USER,
  payload: user,
});

export const updateUser = (user: User): AppAction => ({
  type: ActionTypes.UPDATE_USER,
  payload: user,
});

export const deleteUser = (userId: string): AppAction => ({
  type: ActionTypes.DELETE_USER,
  payload: { userId },
});

// ─── Story Action Creators ───────────────────────────────

export const addStory = (story: Story): AppAction => ({
  type: ActionTypes.ADD_STORY,
  payload: story,
});

export const updateStory = (story: Story): AppAction => ({
  type: ActionTypes.UPDATE_STORY,
  payload: story,
});

export const deleteStory = (storyId: string): AppAction => ({
  type: ActionTypes.DELETE_STORY,
  payload: { storyId },
});

export const changeStatus = (storyId: string, status: WorkflowStatus): AppAction => ({
  type: ActionTypes.CHANGE_STATUS,
  payload: { storyId, status },
});

// ─── Bulk Action Creators ────────────────────────────────

export const loadState = (state: AppState): AppAction => ({
  type: ActionTypes.LOAD_STATE,
  payload: state,
});

export const clearState = (): AppAction => ({
  type: ActionTypes.CLEAR_STATE,
});
