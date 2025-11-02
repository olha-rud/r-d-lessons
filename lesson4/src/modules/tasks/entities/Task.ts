import type { Status, Priority } from '../task.types';
import { statuses, priorities } from '../task.types';

export class Task {
    public readonly id: number;
    public title: string;
    public status: Status;
    public priority: Priority;
    public createdAt: string;
    public description: string | undefined;
    public completedAt: string | undefined;
    public deadline: string | undefined;

    constructor(
        id: number,                   
        title: string,
        status: Status,
        priority: Priority,
        createdAt: string,
        description: string | undefined = undefined,    
        completedAt: string | undefined = undefined,
        deadline: string | undefined = undefined
    ) {
        // Спочатку всі валідації
        this.validateId(id);
        this.validateTitle(title);
        this.validateStatus(status);
        this.validatePriority(priority);
        this.validateDescription(description);
        this.validateDates(createdAt, completedAt, deadline);

        // Потім присвоєння значень
        this.id = id;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.description = description;
        this.completedAt = completedAt;
        this.deadline = deadline;
    }
  
    // Приватні методи валідації
    
    private validateId(id: number): void {
        if (id <= 0) {
            throw new Error('Task ID must be positive');
        }
    }

    private validateTitle(title: string): void {
        if (!title || title.trim() === '') {
            throw new Error('Title cannot be empty');
        }
    }

    private validateStatus(status: Status): void {
        if (!statuses.includes(status)) {  
            throw new Error(`Invalid status: ${status}`);
        }
    }
  
    private validatePriority(priority: Priority): void {
        if (!priorities.includes(priority)) {
            throw new Error(`Invalid priority: ${priority}`);
        }
    }

    private validateDescription(description: string | undefined): void {
        if (description !== undefined && description.trim() === '') {
            throw new Error('Description cannot be empty string');
        }
    }

    private validateDates(
        createdAt: string,
        completedAt: string | undefined,
        deadline: string | undefined
    ): void {
        // Перевірка: completedAt не може бути раніше createdAt
        if (completedAt && completedAt < createdAt) {
            throw new Error('Completed date cannot be earlier than created date');
        }
        
        // Перевірка: deadline не може бути раніше createdAt
        if (deadline && deadline < createdAt) {
            throw new Error('Deadline cannot be earlier than created date');
        }
    }
  
    // Метод для отримання інформації про завдання
    getTaskInfo(): string {
        return `Task #${this.id}: ${this.title} [${this.status}]`;
    }
}