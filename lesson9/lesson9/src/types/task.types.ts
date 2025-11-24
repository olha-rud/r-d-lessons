export type Status = 'todo' | 'inProgress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  deadline?: string;
};

export type CreateTaskData = Omit<Task, 'id'>;