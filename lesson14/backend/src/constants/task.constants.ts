export const TASK_STATUSES = [
  "pending",
  "in-progress",
  "review",
  "completed",
] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
