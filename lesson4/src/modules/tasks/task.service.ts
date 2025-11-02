import type { Task, Status, Priority, CreateTaskSettings } from './task.types';
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../../constants';
import tasksData from '../../tasks.json';

export class TaskService {
    private tasks: Task[];

    constructor() {
        this.tasks = tasksData as Task[];
    }

    // Метод для отримання деталей завдання за вказаним id
    getTaskDetails(id: number): Task | undefined  {
        return this.tasks.find((task) => task.id === id)
    }

    // Метод для створення нового завдання
    createNewTask (settings: CreateTaskSettings) : Task{
        const newId = Math.max(...this.tasks.map(task => task.id)) + 1;
        const createdAt = new Date().toISOString();
  
        const newTask: Task = {
        id: newId,
        createdAt: createdAt,
        status: settings.status ?? DEFAULT_STATUS,
        priority: settings.priority ?? DEFAULT_PRIORITY,
        ...settings 
        };
  
        this.tasks.push(newTask);
        return newTask;
    }
  
    // Метод для оновлення деталей завдання
    updateTaskDetails(
        id: number, 
        updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined {
            const taskIndex = this.tasks.findIndex(t => t.id === id);
            
            if (taskIndex === -1) {
                return undefined;
        }
    
        const task = this.tasks[taskIndex];
        
        const updatedTask: Task = {
            ...task,
            ...updates
        } 
    
        this.tasks[taskIndex] = updatedTask;
        
        return updatedTask;
    }


    // Метод для видалення завдання
    deleteTaskDetails(id: number): boolean {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        
        if (taskIndex === -1) {
            return false;
        }
        
        this.tasks.splice(taskIndex, 1);
        
        return true;
    }

    // Метод для фільтрації завдань за статусом, датою створення та пріоритетом
    filterTasks(filters: {
        status?: Status;           
        priority?: Priority;       
        createdAfter?: string;     
        createdBefore?: string;    
        }): Task[] {
        
        return this.tasks.filter(task => {
            
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

    //  Метод для перевірки, чи завершено завдання до дедлайну
    isTaskOnTime(id: number): boolean | null {
        const task = this.getTaskDetails(id);
        
        if (!task?.completedAt || !task.deadline) {
            return null;
        }

        return task.completedAt <= task.deadline;
    }
}