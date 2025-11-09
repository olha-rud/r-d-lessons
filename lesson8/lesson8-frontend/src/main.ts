import './style.css';
import { getTasks, createTask, deleteTask } from './api';
import type { Task, CreateTaskSettings, Status, Priority } from './task.types';

// Отримуємо елементи
const modal = document.getElementById('modal') as HTMLDivElement;
const openModalBtn = document.getElementById('open-modal') as HTMLButtonElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
const taskForm = document.getElementById('task-form') as HTMLFormElement;

// Колонки
const columnTodo = document.getElementById('column-todo') as HTMLDivElement;
const columnInProgress = document.getElementById('column-inProgress') as HTMLDivElement;
const columnDone = document.getElementById('column-done') as HTMLDivElement;

// Лічильники
const countTodo = document.getElementById('count-todo') as HTMLSpanElement;
const countInProgress = document.getElementById('count-inProgress') as HTMLSpanElement;
const countDone = document.getElementById('count-done') as HTMLSpanElement;

// Відкриття/закриття модального вікна
openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  taskForm.reset();
});

cancelBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  taskForm.reset();
});

// Закриття по кліку поза модальним вікном
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    taskForm.reset();
  }
});

// Функція для відображення завдань
async function renderTasks() {
  try {
    const tasks = await getTasks();
    
    // Очищаємо колонки
    columnTodo.innerHTML = '';
    columnInProgress.innerHTML = '';
    columnDone.innerHTML = '';
    
    // Розподіляємо завдання по колонках
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
    const doneTasks = tasks.filter(t => t.status === 'done');
    
    // Оновлюємо лічильники
    countTodo.textContent = todoTasks.length.toString();
    countInProgress.textContent = inProgressTasks.length.toString();
    countDone.textContent = doneTasks.length.toString();
    
    // Рендеримо картки
    if (todoTasks.length === 0) {
      columnTodo.innerHTML = '<div class="empty-column">No tasks</div>';
    } else {
      todoTasks.forEach(task => {
        columnTodo.appendChild(createTaskCard(task));
      });
    }
    
    if (inProgressTasks.length === 0) {
      columnInProgress.innerHTML = '<div class="empty-column">No tasks</div>';
    } else {
      inProgressTasks.forEach(task => {
        columnInProgress.appendChild(createTaskCard(task));
      });
    }
    
    if (doneTasks.length === 0) {
      columnDone.innerHTML = '<div class="empty-column">No tasks</div>';
    } else {
      doneTasks.forEach(task => {
        columnDone.appendChild(createTaskCard(task));
      });
    }
    
  } catch (error) {
    console.error('Помилка при завантаженні завдань:', error);
  }
}

// Функція для створення картки завдання
function createTaskCard(task: Task): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.dataset.id = task.id.toString();
  card.dataset.priority = task.priority;
  
  const priorityText = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🔴 High'
  }[task.priority];
  
  const priorityClass = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high'
  }[task.priority];
  
  card.innerHTML = `
    <div class="task-title">${escapeHtml(task.title)}</div>
    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
    
    <div class="task-meta">
      <span class="task-priority ${priorityClass}">${priorityText}</span>
      ${task.deadline ? `<span class="task-date">📅 ${formatDate(task.deadline)}</span>` : ''}
    </div>
    
    <div class="task-actions">
      <button class="btn-delete" data-id="${task.id}">Delete️</button>
    </div>
  `;
  
  // Додаємо обробник для видалення
  const deleteBtn = card.querySelector('.btn-delete') as HTMLButtonElement;
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDeleteTask(task.id);
  });
  
  return card;
}

// Функція для екранування HTML (захист від XSS)
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Функція для форматування дати
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });
}

// Обробник створення завдання
async function handleCreateTask(event: Event) {
  event.preventDefault();
  
  const formData = new FormData(taskForm);
  
  const taskData: CreateTaskSettings = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    status: formData.get('status') as Status,
    priority: formData.get('priority') as Priority,
    deadline: formData.get('deadline') as string || undefined,
  };

  try {
    console.log('➕ Створюємо завдання...', taskData);
    await createTask(taskData);
    console.log('✅ Завдання створено!');
    
    // Закриваємо модальне вікно
    modal.classList.remove('active');
    
    // Очищаємо форму
    taskForm.reset();
    
    // Оновлюємо дошку
    await renderTasks();
    
  } catch (error) {
    console.error('❌ Помилка при створенні завдання:', error);
    alert('Failed to create task. Check the console.');
  }
}

// Обробник видалення завдання
async function handleDeleteTask(taskId: number) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  try {
    console.log('Delete️ Видаляємо завдання з ID:', taskId);
    await deleteTask(taskId);
    console.log('✅ Завдання видалено!');
    
    // Оновлюємо дошку
    await renderTasks();
    
  } catch (error) {
    console.error('❌ Помилка при видаленні завдання:', error);
    alert('Failed to delete task. Check the console.');
  }
}

// Ініціалізація
taskForm.addEventListener('submit', handleCreateTask);
renderTasks();