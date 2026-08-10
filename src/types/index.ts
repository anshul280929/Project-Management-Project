// ─── Enums ───────────────────────────────────────────────

export enum WorkflowStatus {
  BACKLOG     = 'Backlog',
  IN_PROGRESS = 'In Progress',
  TESTING     = 'Testing',
  DONE        = 'Done',
}

export enum Priority {
  LOW    = 'Low',
  MEDIUM = 'Medium',
  HIGH   = 'High',
}

export enum UserRole {
  DEVELOPER = 'Developer',
  TESTER    = 'Tester',
  MANAGER   = 'Manager',
}

// ─── Interfaces ──────────────────────────────────────────

export interface User {
  id: string;                // crypto.randomUUID()
  name: string;
  role: UserRole;
  avatarColor: string;       // Hex color for avatar circle
}

export interface Story {
  id: string;
  projectId: string;         // FK → Project.id
  title: string;
  description: string;
  priority: Priority;
  storyPoints: number;       // 1, 2, 3, 5, 8, 13, 21
  assignedUserId: string | null;  // FK → User.id (nullable)
  status: WorkflowStatus;
  createdDate: string;       // ISO 8601 timestamp
  updatedDate: string;       // ISO 8601 timestamp
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  members: string[];         // Array of User IDs assigned to this project
}

export interface AppState {
  projects: Project[];
  users: User[];
  stories: Story[];
  activeProjectId: string | null;
}

// ─── Action Types ────────────────────────────────────────

export type AppAction =
  // ─── Projects ───
  | { type: 'ADD_PROJECT';      payload: Project }
  | { type: 'UPDATE_PROJECT';   payload: Project }
  | { type: 'DELETE_PROJECT';   payload: { projectId: string } }

  // ─── Users ───
  | { type: 'ADD_USER';         payload: User }
  | { type: 'UPDATE_USER';      payload: User }
  | { type: 'DELETE_USER';      payload: { userId: string } }

  // ─── Stories ───
  | { type: 'ADD_STORY';        payload: Story }
  | { type: 'UPDATE_STORY';     payload: Story }
  | { type: 'DELETE_STORY';     payload: { storyId: string } }
  | { type: 'CHANGE_STATUS';    payload: { storyId: string; status: WorkflowStatus } }

  // ─── Bulk ───
  | { type: 'LOAD_STATE';       payload: AppState }
  | { type: 'CLEAR_STATE' };
