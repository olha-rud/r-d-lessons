import type { Task, CreateTaskDto, UpdateTaskDto, TaskFilters } from "../types/task.types.js";

const tasks: Task[] = [];

export const getAllTasks = (filters: TaskFilters): Task[] => {
  let result = [...tasks];

  if (filters.status) {
    result = result.filter((task) => task.status === filters.status);
  }

  if (filters.priority) {
    result = result.filter((task) => task.priority === filters.priority);
  }

  if (filters.createdAt) {
    result = result.filter((task) => task.createdAt.startsWith(filters.createdAt!));
  }

  return result;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

export const createTask = (data: CreateTaskDto): Task => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    status: data.status ?? "pending",
    priority: data.priority ?? "medium",
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, data: UpdateTaskDto): Task | undefined => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return undefined;
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...data };
  return tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
};