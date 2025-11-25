export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  createdAt?: string;
}