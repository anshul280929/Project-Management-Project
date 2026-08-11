import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  addUser as addUserAction,
  updateUser as updateUserAction,
  deleteUser as deleteUserAction,
  updateProject as updateProjectAction,
} from '../context/actions';
import { UserRole, type User } from '../types';
import { generateAvatarColor } from '../utils/helpers';

export function useUsers() {
  const { state, dispatch } = useAppContext();

  const users = state.users;

  const getUserById = useCallback(
    (userId: string): User | undefined => {
      return state.users.find((u) => u.id === userId);
    },
    [state.users]
  );

  const projectMembers = useCallback(
    (projectId: string): User[] => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) return [];
      return state.users.filter((user) => project.members.includes(user.id));
    },
    [state.projects, state.users]
  );

  const addUser = useCallback(
    (name: string, role: UserRole = UserRole.DEVELOPER, avatarColor?: string): User => {
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        role,
        avatarColor: avatarColor || generateAvatarColor(name),
      };
      dispatch(addUserAction(newUser));
      return newUser;
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (user: User) => {
      dispatch(updateUserAction(user));
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    (userId: string) => {
      dispatch(deleteUserAction(userId));
    },
    [dispatch]
  );

  const addMemberToProject = useCallback(
    (projectId: string, userId: string) => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project || project.members.includes(userId)) return;

      const updatedProject = {
        ...project,
        members: [...project.members, userId],
      };
      dispatch(updateProjectAction(updatedProject));
    },
    [state.projects, dispatch]
  );

  const removeMemberFromProject = useCallback(
    (projectId: string, userId: string) => {
      const project = state.projects.find((p) => p.id === projectId);
      if (!project || !project.members.includes(userId)) return;

      const updatedProject = {
        ...project,
        members: project.members.filter((id) => id !== userId),
      };
      dispatch(updateProjectAction(updatedProject));
    },
    [state.projects, dispatch]
  );

  return {
    users,
    getUserById,
    projectMembers,
    addUser,
    updateUser,
    deleteUser,
    addMemberToProject,
    removeMemberFromProject,
  };
}
