import type { CreateTaskData, Task, User } from "./types";

const API_URL = "http://localhost:3000/tasks";
const USERS_API_URL = "http://localhost:3000/users";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }
  return response.json();
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTask(
  id: string,
  taskData: Partial<CreateTaskData>,
): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
