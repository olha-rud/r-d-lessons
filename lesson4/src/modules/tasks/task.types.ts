export const statuses = ["todo", "inProgress", "done"] as const;
export type Status = typeof statuses[number];

export const priorities = ["low", "medium", "high"] as const;
export type Priority = typeof priorities[number];

export const severities = ["low", "medium", "high", "critical"] as const;
export type Severity = typeof severities[number];

// Типи завдань для фабрики
export const taskTypes = ["task", "bug", "subtask", "story", "epic"] as const;
export type TaskType = typeof taskTypes[number];

export type TaskData = {
  id: number;
  title: string;
  description?: string | undefined;
  createdAt: string;
  completedAt?: string | undefined;
  status: Status;
  priority: Priority;
  deadline?: string | undefined;
};

type BaseCreateData = {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: string;
  completedAt?: string;
};

export type CreateTaskData = BaseCreateData & {
  type: 'task';
};

export type CreateBugData = BaseCreateData & {
  type: 'bug';
  severity?: Severity;
};

export type CreateSubtaskData = BaseCreateData & {
  type: 'subtask';
  parentTaskId: number;
};

export type CreateStoryData = BaseCreateData & {
  type: 'story';
  storyPoints?: number;
};

export type CreateEpicData = BaseCreateData & {
  type: 'epic';
  subtaskIds?: number[];
};

export type CreateAnyTaskData = 
  | CreateTaskData 
  | CreateBugData 
  | CreateSubtaskData 
  | CreateStoryData 
  | CreateEpicData;

export type UpdateTaskSettings = Partial<Omit<TaskData, 'id' | 'createdAt'>>;

export type TaskFilters = {
  status?: Status;
  priority?: Priority;
  createdAfter?: string;
  createdBefore?: string;
};