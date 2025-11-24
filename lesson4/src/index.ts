import { TaskService } from './modules/tasks/task.service';
import { TaskController } from './modules/tasks/task.controller';

// Створюємо екземпляри
const taskService = new TaskService();
const taskController = new TaskController(taskService);

// ТЕСТИ ФАБРИКИ 

// Створення Task
const newTask = taskController.handleCreateTask({
    type: 'task',  // ← обов'язкове поле!
    title: 'Моє нове завдання',
    description: 'Тестую фабрику'
});
console.log('Створений Task:', newTask.getTaskInfo());

// Створення Bug
const newBug = taskController.handleCreateTask({
    type: 'bug',
    title: 'Виправити кнопку логіну',
    severity: 'critical',
    priority: 'high'
});
console.log('Створений Bug:', newBug.getTaskInfo());

// Створення Subtask
const newSubtask = taskController.handleCreateTask({
    type: 'subtask',
    title: 'Написати unit тести',
    parentTaskId: 1
});
console.log('Створений Subtask:', newSubtask.getTaskInfo());

// Створення Story
const newStory = taskController.handleCreateTask({
    type: 'story',
    title: 'Автентифікація користувача',
    storyPoints: 8
});
console.log('Створена Story:', newStory.getTaskInfo());

// Створення Epic
const newEpic = taskController.handleCreateTask({
    type: 'epic',
    title: 'Q1 Реліз',
    subtaskIds: [1, 2, 3]
});
console.log('Створений Epic:', newEpic.getTaskInfo());

// ===== ІНШІ ТЕСТИ =====

console.log('\n--- Фільтрація ---');
console.log('Всього завдань:', taskController.handleFilterTasks({}).length);
console.log('Завдання зі статусом "done":', taskController.handleFilterTasks({ status: 'done' }));

console.log('\n--- Отримання деталей ---');
console.log('Завдання #1:', taskController.handleGetTask(1));

console.log('\n--- Перевірка дедлайну ---');
console.log('Завдання 1 вчасно?', taskController.handleCheckTaskDeadline(1));

// Тест валідації при update
console.log('\n--- Тест валідації ---');
try {
    taskController.handleUpdateTask(1, { title: '' }); // пустий title
} catch (error) {
    console.log('Помилка валідації:', (error as Error).message);
}