// src/api.ts

import type { Task, CreateTaskSettings } from './task.types';

const API_URL = 'http://localhost:3000/tasks';

// 1. Отримати ВСІ завдання (GET)
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error(`Помилка: ${response.status}`);
  }
  
  return response.json();
}

// 2. Отримати ОДНЕ завдання за ID (GET)
export async function getTaskById(id: number): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Завдання з ID ${id} не знайдено`);
  }
  
  return response.json();
}

// 3. Створити нове завдання (POST)
export async function createTask(taskData: CreateTaskSettings): Promise<Task> {
  const newTask: Task = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    ...taskData,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error('Не вдалося створити завдання');
  }

  return response.json();
}

// 4. Оновити завдання повністю (PUT)
export async function updateTask(id: number, taskData: Task): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Не вдалося оновити завдання');
  }

  return response.json();
}

// 5. Оновити завдання частково (PATCH)
export async function patchTask(id: number, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Не вдалося оновити завдання');
  }

  return response.json();
}

// 6. Видалити завдання (DELETE)
export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Не вдалося видалити завдання');
  }
}