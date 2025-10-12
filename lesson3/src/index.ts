import {z} from 'zod';

import tasks from './tasks.json';
import type {Status, Priority} from './dto/Task';
import {DEFAULT_STATUS, DEFAULT_PRIORITY} from './constants';


const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  completedAt: z.string().optional(), 
  status: z.enum(["todo", "inProgress", "done"]).optional().default(DEFAULT_STATUS),
  priority: z.enum(["low", "medium", "high"]).optional().default(DEFAULT_PRIORITY),
  deadline: z.string().optional(),
});

const tasksSchema = z.array(taskSchema);

type Task = z.infer<typeof taskSchema>;

let parsedTasks: Task[] = tasksSchema.parse(tasks);
//console.log('Parsed Tasks:', parsedTasks);

//1. Функція для отримання деталей завдання за вказаним id
function getTaskDetails(id: number): Task | undefined  {
  // треба використати return!
  return parsedTasks.find((task) => task.id === id)
}

//console.log('Test getTaskDetails(4):', getTaskDetails(4)); //{ id: 4, title: 'Create logo variants',...}
//console.log('Test getTaskDetails(999):', getTaskDetails(999)); //undefined


//2. Функція створення нового завдання
function createNewTask (settings: Omit<Task, 'id' | 'createdAt' | 'status' | 'priority'> & Partial<Pick<Task, 'status' | 'priority'>>) : Task{
  const newId = Math.max(...parsedTasks.map(task => task.id)) + 1;
  const createdAt = new Date().toISOString();

    const newTask: Task = {
    id: newId,
    createdAt: createdAt,
    status: DEFAULT_STATUS,
    priority: DEFAULT_PRIORITY,
    ...settings 
  };

  parsedTasks.push(newTask);
  return newTask;
}

const newTask = createNewTask({
  title: 'Моє нове завдання',
  description: 'Тестую функцію'
});
//console.log('Створене завдання:', newTask); // { id: 11, createdAt: '2025-10-12T18:45:21.185Z', ...}
//console.log('Всього завдань:', parsedTasks.length); // 11


//3. Функція апдейту деталей завдання
function updateTaskDetails(
  id: number, 
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Task | undefined {
  const task = getTaskDetails(id);
  
  if (!task) {
    return undefined;
  }
  
  const taskIndex = parsedTasks.findIndex(t => t.id === id);
  
  const updatedTask: Task = {
    ...task,     
    ...updates    
  };
  
  parsedTasks[taskIndex] = updatedTask;
  
  return updatedTask;
}

const updatedTask = updateTaskDetails(2, {
  status: "done",
  priority: "medium",
  completedAt: new Date().toISOString()
});
//console.log('Оновлене завдання:', updatedTask); // { id: 2, ... status: 'done', priority: 'medium',... completedAt: '2025-10-12T18:46:51.474Z'}
 

//4. Функція видалення завдання
function deleteTaskDetails(id: number): boolean {
  const task = getTaskDetails(id);
  
  if (!task) {
    return false;
  }
  
  parsedTasks = parsedTasks.filter(task => task.id !== id);
  
  return true;
}

//console.log('Видалення завдання 3:', deleteTaskDetails(3)); // true

//5. Функція фільтрації завдань за статусом, датою створення та пріоритетом
function filterTasks(filters: {
  status?: Status;           
  priority?: Priority;       
  createdAfter?: string;     
  createdBefore?: string;    
}): Task[] {
  
  return parsedTasks.filter(task => {
    
    if (filters.status && task.status !== filters.status) {
      return false;  
    }
    
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    if (filters.createdAfter && task.createdAt < filters.createdAfter) {
      return false;  
    }
    
    if (filters.createdBefore && task.createdAt > filters.createdBefore) {
      return false;  
    }
    
    return true;
  });
}

//console.log('Завдання зі статусом "done":', filterTasks({ status: 'done' }));
//console.log('Високопріоритетні завдання:', filterTasks({ priority: 'high' }));
//console.log('Завдання створені після 2024-10-03:', filterTasks({ createdAfter: '2024-10-03' }));

// перевірки, чи завершено завдання до дедлайну
function isTaskOnTime(id: number): boolean | null {
  const task = getTaskDetails(id);
  
  if (!task) {
    return null;
  }
  
  if (!task.completedAt) {
    return null;
  }
  
  if (!task.deadline) {
    return true;
  }
  
  return task.completedAt <= task.deadline;
}

//console.log('Завдання 1 вчасно?', isTaskOnTime(1));  // true (2024-10-02 < 2024-10-05)
//console.log('Завдання 2 вчасно?', isTaskOnTime(2));  // false (2025-10-12 > 2024-10-15)
//console.log('Завдання 3 вчасно?', isTaskOnTime(3));  // null (ще не завершене)