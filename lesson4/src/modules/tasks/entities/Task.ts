import type { Status, Priority } from '../task.types';
import {
    validateId,
    validateTitle,
    validateStatus,
    validatePriority,
    validateDescription,
    validateDates
} from '../validators';

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
        // Використовуємо імпортовані валідатори
        validateId(id);
        validateTitle(title);
        validateStatus(status);
        validatePriority(priority);
        validateDescription(description);
        validateDates(createdAt, completedAt, deadline);

        this.id = id;
        this.title = title;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.description = description;
        this.completedAt = completedAt;
        this.deadline = deadline;
    }

    getTaskInfo(): string {
        return `Task #${this.id}: ${this.title} [${this.status}]`;
    }
}