import { Task } from './Task';
import type { Status, Priority, Severity } from '../task.types';
import { validateSeverity } from '../validators';

export class Bug extends Task {
    public severity: Severity | undefined;

    constructor(
        id: number,
        title: string,
        status: Status,
        priority: Priority,
        createdAt: string,
        description: string | undefined = undefined,
        completedAt: string | undefined = undefined,
        deadline: string | undefined = undefined,
        severity: Severity | undefined = undefined
    ) {
        super(id, title, status, priority, createdAt, description, completedAt, deadline);

        validateSeverity(severity);
        this.severity = severity;
    }

    getTaskInfo(): string {
        const baseInfo = super.getTaskInfo();
        return `🐛 ${baseInfo}${this.severity ? ` | Критичність: ${this.severity}` : ''}`;
    }
}