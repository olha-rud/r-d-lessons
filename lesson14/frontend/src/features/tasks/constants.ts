import type { Task } from "./types";

// Mock task constants
export const MOCK_TASK: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: "pending",
  priority: "high",
  createdAt: "2024-01-01T00:00:00.000Z",
  deadline: "2024-12-31T00:00:00.000Z",
};

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Description 1",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-01T00:00:00.000Z",
    deadline: "2024-12-31T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Description 2",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Test Task 3",
    description: "Description 3",
    status: "review",
    priority: "high",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    title: "Test Task 4",
    status: "completed",
    priority: "low",
    createdAt: "2024-01-04T00:00:00.000Z",
  },
];

// Route constants
export const ROUTES = {
  TASKS: "/tasks",
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
} as const;

// Test IDs
export const TEST_IDS = {
  KANBAN_COLUMN_PENDING: "kanban-column-pending",
  KANBAN_COLUMN_IN_PROGRESS: "kanban-column-in-progress",
  KANBAN_COLUMN_REVIEW: "kanban-column-review",
  KANBAN_COLUMN_COMPLETED: "kanban-column-completed",
} as const;

// Text constants for assertions
export const TEXT = {
  LOADING: "Loading tasks...",
  NO_TASKS: "No tasks yet",
  CREATE_FIRST_TASK: "Create your first task to get started",
  FAILED_TO_LOAD_TASKS: /Failed to load tasks. Please try again./i,
  FAILED_TO_LOAD_TASK: /Failed to load task/i,
  FAILED_TO_CREATE_TASK: /Failed to create task/i,
  FAILED_TO_UPDATE_TASK: /Failed to update task/i,
  TITLE_REQUIRED: /title is required/i,
  TITLE_TOO_LONG: /title must be less than 100 characters/i,
  DEADLINE_IN_PAST: /deadline cannot be in the past/i,
  CREATE_NEW_TASK: "Create New Task",
  EDIT_TASK: "Edit Task",
  BACK_TO_TASKS: /back to tasks/i,
  CREATE_TASK: /create task/i,
  SAVE_CHANGES: /save changes/i,
  DELETE_TASK: /delete task/i,
  HIGH_PRIORITY: "🔴 High Priority",
  HIGH: "🔴 High",
  MEDIUM: "🟡 Medium",
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
} as const;
