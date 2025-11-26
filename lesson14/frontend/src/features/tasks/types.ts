export type Status = "pending" | "in-progress" | "review" | "completed";
export type Priority = "low" | "medium" | "high";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  deadline?: string;
  assigneeId?: number | null;
  assignee?: User;
};

export type CreateTaskData = Omit<Task, "id" | "assignee">;
