export const statuses = ["todo", "inProgress", "done"] as const;
export type Status = typeof statuses[number];

export const priorities = ["low", "medium", "high"] as const;
export type Priority = typeof priorities[number];