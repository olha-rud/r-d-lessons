import { TaskService } from './modules/tasks/task.service';
import { TaskController } from './modules/tasks/task.controller';

// Створюємо екземпляри
const taskService = new TaskService();
const taskController = new TaskController(taskService);

// Тепер ВСІ виклики через КОНТРОЛЕР:

// Тест 1: Отримання деталей завдання
console.log('Test getTaskDetails(4):', taskController.handleGetTask(4));
console.log('Test getTaskDetails(999):', taskController.handleGetTask(999));

// Тест 2: Створення нового завдання
const newTask = taskController.handleCreateTask({
  title: 'Моє нове завдання',
  description: 'Тестую функцію'
});
console.log('Створене завдання:', newTask);
console.log('Всього завдань:', taskController.handleFilterTasks({}).length);

// Тест 3: Оновлення завдання
const updatedTask = taskController.handleUpdateTask(2, {
  status: "done",
  priority: "medium",
  completedAt: new Date().toISOString()
});
console.log('Оновлене завдання:', updatedTask);

// Тест 4: Видалення завдання
console.log('Видалення завдання 3:', taskController.handleDeleteTask(3));

// Тест 5: Фільтрація
console.log('Завдання зі статусом "done":', taskController.handleFilterTasks({ status: 'done' }));
console.log('Високопріоритетні завдання:', taskController.handleFilterTasks({ priority: 'high' }));
console.log('Завдання створені після 2024-10-03:', taskController.handleFilterTasks({ createdAfter: '2024-10-03' }));

// Тест 6: Перевірка дедлайну
console.log('Завдання 1 вчасно?', taskController.handleCheckTaskDeadline(1));
console.log('Завдання 2 вчасно?', taskController.handleCheckTaskDeadline(2));
console.log('Завдання 3 вчасно?', taskController.handleCheckTaskDeadline(3));