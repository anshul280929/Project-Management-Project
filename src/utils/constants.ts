import { WorkflowStatus, Priority, UserRole } from '../types';

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  WorkflowStatus.BACKLOG,
  WorkflowStatus.IN_PROGRESS,
  WorkflowStatus.TESTING,
  WorkflowStatus.DONE,
];

export const PRIORITIES: Priority[] = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
];

export const USER_ROLES: UserRole[] = [
  UserRole.DEVELOPER,
  UserRole.TESTER,  
  UserRole.MANAGER,
];

export const STORY_POINTS: number[] = [1, 2, 3, 5, 8, 13, 21];

// Color maps for priority badges (text, background, and border hexes)
// Low -> periwinkle (#bdbbff), Medium -> orange (#fc4c02), High -> magenta (#ef2cc1)
export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  [Priority.LOW]: {
    bg: 'var(--color-bg-subtle, #f0efff)',
    text: 'var(--color-accent-periwinkle-dark, #5c54e5)',
    border: 'var(--color-accent-periwinkle, #bdbbff)',
  },
  [Priority.MEDIUM]: {
    bg: 'var(--color-accent-orange-subtle, #fff2eb)',
    text: 'var(--color-accent-orange-dark, #d83b01)',
    border: 'var(--color-accent-orange, #fc4c02)',
  },
  [Priority.HIGH]: {
    bg: 'var(--color-accent-magenta-subtle, #fef1fa)',
    text: 'var(--color-accent-magenta-dark, #c81b9e)',
    border: 'var(--color-accent-magenta, #ef2cc1)',
  },
};

// Color maps for status badges
// Backlog -> neutral grey, In Progress -> blue, Testing -> orange, Done -> green
export const STATUS_COLORS: Record<WorkflowStatus, { bg: string; text: string; border: string }> = {
  [WorkflowStatus.BACKLOG]: {
    bg: 'var(--color-neutral-subtle, #f5f5f5)',
    text: 'var(--color-neutral-dark, #555555)',
    border: 'var(--color-hairline, #d5d5d5)',
  },
  [WorkflowStatus.IN_PROGRESS]: {
    bg: 'var(--color-accent-blue-subtle, #ebf8ff)',
    text: 'var(--color-accent-blue-dark, #0077c8)',
    border: 'var(--color-accent-blue, #47bfff)',
  },
  [WorkflowStatus.TESTING]: {
    bg: 'var(--color-accent-orange-subtle, #fff2eb)',
    text: 'var(--color-accent-orange-dark, #d83b01)',
    border: 'var(--color-accent-orange, #fc4c02)',
  },
  [WorkflowStatus.DONE]: {
    bg: 'var(--color-accent-mint-subtle, #e6faf0)',
    text: 'var(--color-accent-mint-dark, #0e7040)',
    border: 'var(--color-accent-mint, #31c48d)',
  },
};

// Color maps for role badges
// Developer -> cyan, Tester -> orange, Manager -> magenta
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  [UserRole.DEVELOPER]: {
    bg: 'var(--color-accent-cyan-subtle, #e6fcff)',
    text: 'var(--color-accent-cyan-dark, #00839e)',
    border: 'var(--color-accent-cyan, #00d8ff)',
  },
  [UserRole.TESTER]: {
    bg: 'var(--color-accent-orange-subtle, #fff2eb)',
    text: 'var(--color-accent-orange-dark, #d83b01)',
    border: 'var(--color-accent-orange, #fc4c02)',
  },
  [UserRole.MANAGER]: {
    bg: 'var(--color-accent-magenta-subtle, #fef1fa)',
    text: 'var(--color-accent-magenta-dark, #c81b9e)',
    border: 'var(--color-accent-magenta, #ef2cc1)',
  },
};
