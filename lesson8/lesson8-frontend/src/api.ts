import type { Task, CreateTaskSettings } from './task.types';

const API_URL = 'http://localhost:3000/tasks';

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export async function createTask(task: CreateTaskSettings): Promise<Task> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}