export type Task = {
  id: string; 
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  deadline?: string;
};

export type CreateTaskSettings = {
  // Без id - JSON Server створить сам
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  deadline?: string;
};

export type Status = 'todo' | 'inProgress' | 'done';
export type Priority = 'low' | 'medium' | 'high';