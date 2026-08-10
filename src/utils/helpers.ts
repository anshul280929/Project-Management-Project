import { Story, Priority, WorkflowStatus } from '../types';

/**
 * Formats an ISO date string into a clean, human-readable date.
 * Example: "2026-08-10T12:00:00Z" -> "Aug 10, 2026"
 */
export function formatDate(iso: string): string {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return iso;
  }
}

/**
 * Formats an ISO date string into a relative time description (e.g., "5m ago", "yesterday").
 * Falls back to absolute date formatting if older than 7 days.
 */
export function formatRelativeTime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 10) {
      return 'just now';
    }
    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return 'yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return formatDate(iso);
  } catch (e) {
    return iso;
  }
}

/**
 * Extracts uppercase initials from a name (up to 2 characters).
 * Example: "Jane Doe" -> "JD", "Alex" -> "AL"
 */
export function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Hand-picked premium colors (vibrant, accessible, Together AI-themed)
const AVATAR_COLORS = [
  '#ef2cc1', // Magenta
  '#fc4c02', // Orange
  '#863bff', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#a855f7', // Violet
];

/**
 * Generates a deterministic hex color from a user's name hash.
 */
export function generateAvatarColor(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export interface StoryFilters {
  search?: string;
  assignee?: string;
  priority?: Priority;
  status?: WorkflowStatus;
  myTasks?: boolean;
  currentUserId?: string;
}

/**
 * Filters a list of stories using AND logic combined across multiple optional filters.
 */
export function filterStories(stories: Story[], filters: StoryFilters): Story[] {
  return stories.filter((story) => {
    // 1. Search filter: Matches against story title (case-insensitive substring)
    if (filters.search && !story.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // 2. Assignee filter
    if (filters.assignee && story.assignedUserId !== filters.assignee) {
      return false;
    }
    // 3. Priority filter
    if (filters.priority && story.priority !== filters.priority) {
      return false;
    }
    // 4. Status filter
    if (filters.status && story.status !== filters.status) {
      return false;
    }
    // 5. My Tasks filter: Filters to stories assigned to the current user
    if (filters.myTasks) {
      if (!filters.currentUserId || story.assignedUserId !== filters.currentUserId) {
        return false;
      }
    }
    return true;
  });
}
