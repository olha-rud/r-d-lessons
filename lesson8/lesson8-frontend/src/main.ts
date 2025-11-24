import './style.css';
import { getTasks, createTask, deleteTask } from './api';
import type { Task, CreateTaskSettings, Status, Priority } from './task.types';

// ========== DOM ЕЛЕМЕНТИ ==========

const modal = document.getElementById('modal') as HTMLDivElement;
const openModalBtn = document.getElementById('open-modal') as HTMLButtonElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
const taskForm = document.getElementById('task-form') as HTMLFormElement;
const board = document.getElementById('board') as HTMLDivElement;

const columnTodo = document.getElementById('column-todo') as HTMLDivElement;
const columnInProgress = document.getElementById('column-inProgress') as HTMLDivElement;
const columnDone = document.getElementById('column-done') as HTMLDivElement;

const countTodo = document.getElementById('count-todo') as HTMLSpanElement;
const countInProgress = document.getElementById('count-inProgress') as HTMLSpanElement;
const countDone = document.getElementById('count-done') as HTMLSpanElement;

// ========== КОНСТАНТИ ==========

// Мапінг пріоритетів на текст
const PRIORITY_TEXT: Record<Priority, string> = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🔴 High'
};

// Мапінг пріоритетів на CSS класи
const PRIORITY_CLASS: Record<Priority, string> = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high'
};

// Конфігурація колонок
const COLUMNS = [
  { status: 'todo' as Status, element: columnTodo, count: countTodo },
  { status: 'inProgress' as Status, element: columnInProgress, count: countInProgress },
  { status: 'done' as Status, element: columnDone, count: countDone }
];

// ========== ТИПИ ==========

type TaskFormData = {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
};

type NotificationType = 'success' | 'error' | 'info' | 'warning';

// ========== TOAST NOTIFICATIONS ==========

// Створюємо контейнер для toast повідомлень
function createToastContainer(): HTMLDivElement {
  let container = document.getElementById('toast-container') as HTMLDivElement;
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  
  return container;
}

// Показати toast повідомлення
function showToast(message: string, type: NotificationType = 'info', duration: number = 3000): void {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Іконки для різних типів
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  // Кольори для різних типів
  const colors = {
    success: '#74e3a6ff',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  
  toast.style.cssText = `
    background: white;
    border-left: 4px solid ${colors[type]};
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    color: #1f2937;
  `;
  
  toast.innerHTML = `
    <span style="font-size: 20px;">${icons[type]}</span>
    <span style="flex: 1;">${escapeHtml(message)}</span>
    <button style="
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">×</button>
  `;
  
  // Додаємо анімацію
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  if (!document.getElementById('toast-styles')) {
    style.id = 'toast-styles';
    document.head.appendChild(style);
  }
  
  // Обробник закриття
  const closeBtn = toast.querySelector('button');
  const closeToast = () => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  };
  
  closeBtn?.addEventListener('click', closeToast);
  
  container.appendChild(toast);
  
  // Автоматичне закриття
  if (duration > 0) {
    setTimeout(closeToast, duration);
  }
}

// Швидкі функції для різних типів
function showSuccess(message: string, duration?: number): void {
  showToast(message, 'success', duration);
}

function showError(message: string, duration?: number): void {
  showToast(message, 'error', duration);
}

function showInfo(message: string, duration?: number): void {
  showToast(message, 'info', duration);
}

function showWarning(message: string, duration?: number): void {
  showToast(message, 'warning', duration);
}

function getFormData<T extends Record<string, any>>(form: HTMLFormElement): T {
  const formData = new FormData(form);
  return Object.fromEntries(formData) as T;
}

function emptyToUndefined(value: string): string | undefined {
  return value === '' ? undefined : value;
}

async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    loadingMessage?: string;
    successMessage?: string | ((result: T) => string);
    errorMessage?: string;
  }
): Promise<T | null> {
  try {
    // Показуємо loading якщо є
    if (options.loadingMessage) {
      showInfo(options.loadingMessage, 1000);
    }

    // Виконуємо операцію
    const result = await operation();

    // Показуємо success якщо є
    if (options.successMessage) {
      const message = typeof options.successMessage === 'function' 
        ? options.successMessage(result)
        : options.successMessage;
      showSuccess(message);
    }

    return result;
    
  } catch (error) {
    console.error('❌ Помилка операції:', error);
    
    // Повідомлення про помилку
    const errorMsg = error instanceof Error 
      ? `${options.errorMessage}: ${error.message}`
      : options.errorMessage || 'An error occurred';
      
    showError(errorMsg);
    return null;
  }
}

// ========== ФУНКЦІЇ-ПОМІЧНИКИ ==========

function closeModal(): void {
  modal.classList.remove('active');
  taskForm.reset();
}

function openModal(): void {
  modal.classList.add('active');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });
}

function renderCardsInColumn(tasks: Task[], column: HTMLDivElement): void {
  column.innerHTML = '';
  
  if (tasks.length === 0) {
    column.innerHTML = '<div class="empty-column">No tasks</div>';
    return;
  }
  
  tasks.forEach(task => {
    column.appendChild(createTaskCard(task));
  });
}

function createTaskCard(task: Task): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.dataset.id = task.id;
  card.dataset.priority = task.priority;
  
  const priorityText = PRIORITY_TEXT[task.priority];
  const priorityClass = PRIORITY_CLASS[task.priority];
  
  card.innerHTML = `
    <div class="task-title">${escapeHtml(task.title)}</div>
    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
    
    <div class="task-meta">
      <span class="task-priority ${priorityClass}">${priorityText}</span>
      ${task.deadline ? `<span class="task-date">📅 ${formatDate(task.deadline)}</span>` : ''}
    </div>
    
    <div class="task-actions">
      <button class="btn-delete" data-id="${task.id}">Delete</button>
    </div>
  `;
  
  return card;
}

// ОСНОВНІ ФУНКЦІЇ

async function renderTasks(): Promise<void> {
  const tasks = await handleAsyncOperation(
    getTasks,
    {
      loadingMessage: 'Loading tasks...',
      errorMessage: 'Failed to load tasks. Please refresh the page.'
    }
  );

  if (!tasks) return;

  COLUMNS.forEach(({ status, element, count }) => {
    const filteredTasks = tasks.filter(t => t.status === status);
    count.textContent = filteredTasks.length.toString();
    renderCardsInColumn(filteredTasks, element);
  });
}

async function handleCreateTask(event: Event): Promise<void> {
  event.preventDefault();
  
  const data = getFormData<TaskFormData>(taskForm);
  
  // Валідація
  if (!data.title.trim()) {
    showWarning('Please enter a task title');
    return;
  }
  
  if (data.title.length > 100) {
    showWarning('Task title is too long (max 100 characters)');
    return;
  }
  
  const taskData: CreateTaskSettings = {
    title: data.title,
    description: emptyToUndefined(data.description),
    status: data.status as Status,
    priority: data.priority as Priority,
    deadline: emptyToUndefined(data.deadline),
  };

  const result = await handleAsyncOperation(
    () => createTask(taskData),
    {
      successMessage: `Task "${taskData.title}" created successfully!`,
      errorMessage: 'Failed to create task'
    }
  );

  if (result) {
    closeModal();
    await renderTasks();
  }
}

async function handleDeleteTask(taskId: string): Promise<void> {
  if (!confirm('Are you sure you want to delete this task?')) {
    showInfo('Deletion cancelled');
    return;
  }

  const result = await handleAsyncOperation(
    () => deleteTask(taskId),
    {
      successMessage: 'Task deleted successfully!',
      errorMessage: 'Failed to delete task'
    }
  );

  if (result !== null) {
    await renderTasks();
  }
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

taskForm.addEventListener('submit', handleCreateTask);

board.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  
  if (target.matches('.btn-delete')) {
    event.stopPropagation();
    const taskId = target.dataset.id;
    if (taskId) {
      handleDeleteTask(taskId);
    }
  }
});

//ІНІЦІАЛІЗАЦІЯ
renderTasks();