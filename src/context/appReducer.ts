import type { AppState, AppAction } from '../types';

export const initialAppState: AppState = {
  projects: [],
  users: [],
  stories: [],
  activeProjectId: null,
};

/**
 * AppState reducer handling all domain operations and ensuring strict cascade rules.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ─── Projects Actions ──────────────────────────────────
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };

    case 'UPDATE_PROJECT': {
      const updatedProject = action.payload;
      const oldProject = state.projects.find((p) => p.id === updatedProject.id);
      
      let updatedStories = state.stories;
      if (oldProject) {
        // Cascade rule: If members are removed from the project, 
        // unassign stories in this project that were assigned to those removed users.
        const removedMembers = oldProject.members.filter(
          (mId) => !updatedProject.members.includes(mId)
        );
        
        if (removedMembers.length > 0) {
          updatedStories = state.stories.map((story) => {
            if (
              story.projectId === updatedProject.id &&
              story.assignedUserId &&
              removedMembers.includes(story.assignedUserId)
            ) {
              return {
                ...story,
                assignedUserId: null,
                updatedDate: new Date().toISOString(),
              };
            }
            return story;
          });
        }
      }

      return {
        ...state,
        projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
        stories: updatedStories,
      };
    }

    case 'DELETE_PROJECT': {
      const { projectId } = action.payload;
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== projectId),
        // Cascade rule: Deleting a project cascade-deletes its stories.
        stories: state.stories.filter((s) => s.projectId !== projectId),
        activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
      };
    }

    // ─── Users Actions ─────────────────────────────────────
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };

    case 'DELETE_USER': {
      const { userId } = action.payload;
      return {
        ...state,
        users: state.users.filter((u) => u.id !== userId),
        // Cascade rule 1: Deleting a user unassigns their stories.
        stories: state.stories.map((s) =>
          s.assignedUserId === userId
            ? { ...s, assignedUserId: null, updatedDate: new Date().toISOString() }
            : s
        ),
        // Cascade rule 2: Deleting a user removes them from all projects' members lists.
        projects: state.projects.map((p) =>
          p.members.includes(userId)
            ? { ...p, members: p.members.filter((id) => id !== userId) }
            : p
        ),
      };
    }

    // ─── Stories Actions ───────────────────────────────────
    case 'ADD_STORY':
      return {
        ...state,
        stories: [...state.stories, action.payload],
      };

    case 'UPDATE_STORY':
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.payload.id
            ? { ...action.payload, updatedDate: new Date().toISOString() }
            : s
        ),
      };

    case 'DELETE_STORY':
      return {
        ...state,
        stories: state.stories.filter((s) => s.id !== action.payload.storyId),
      };

    case 'CHANGE_STATUS':
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.payload.storyId
            ? {
                ...s,
                status: action.payload.status,
                updatedDate: new Date().toISOString(),
              }
            : s
        ),
      };

    // ─── Bulk / Storage Actions ────────────────────────────
    case 'LOAD_STATE':
      return {
        ...action.payload,
      };

    case 'CLEAR_STATE':
      return {
        ...initialAppState,
      };

    default:
      return state;
  }
}
