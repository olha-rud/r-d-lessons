import type { TaskStatus, TaskPriority } from "../constants/task.constants.js";

export type { TaskStatus, TaskPriority };

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number | null;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  createdAt?: string;
}
