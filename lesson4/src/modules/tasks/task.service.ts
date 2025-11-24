import { Task } from './entities/Task';
import { TaskFactory } from './entities/TaskFactory';
import type { TaskData, CreateAnyTaskData, TaskFilters, UpdateTaskSettings } from './task.types';
import {
    validateTitle,
    validateStatus,
    validatePriority,
    validateDescription
} from './validators';
import tasksData from '../../tasks.json';

export class TaskService {
    private tasks: TaskData[];
    private factory: TaskFactory;

    constructor() {
        this.tasks = tasksData as TaskData[];
        const maxId = Math.max(...this.tasks.map(task => task.id), 0);
        this.factory = new TaskFactory(maxId + 1);
    }

    getTaskDetails(id: number): TaskData | undefined {
        return this.tasks.find((task) => task.id === id);
    }

    createTask(data: CreateAnyTaskData): Task {
        const newTask = this.factory.create(data);
        this.tasks.push({
            id: newTask.id,
            title: newTask.title,
            status: newTask.status,
            priority: newTask.priority,
            createdAt: newTask.createdAt,
            description: newTask.description,
            completedAt: newTask.completedAt,
            deadline: newTask.deadline
        });
        return newTask;
    }

    updateTaskDetails(id: number, updates: UpdateTaskSettings): TaskData | undefined {
        const taskIndex = this.tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return undefined;
        }

        // Валідація перед оновленням
        if (updates.title !== undefined) {
            validateTitle(updates.title);
        }
        if (updates.status !== undefined) {
            validateStatus(updates.status);
        }
        if (updates.priority !== undefined) {
            validatePriority(updates.priority);
        }
        if (updates.description !== undefined) {
            validateDescription(updates.description);
        }

        const task = this.tasks[taskIndex];

        const updatedTask: TaskData = {
            ...task,
            ...updates
        };

        this.tasks[taskIndex] = updatedTask;

        return updatedTask;
    }

    deleteTaskDetails(id: number): boolean {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return false;
        }

        this.tasks.splice(taskIndex, 1);

        return true;
    }

    filterTasks(filters: TaskFilters): TaskData[] {
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

    isTaskOnTime(id: number): boolean | null {
        const task = this.getTaskDetails(id);

        if (!task?.completedAt || !task.deadline) {
            return null;
        }

        return task.completedAt <= task.deadline;
    }
}
