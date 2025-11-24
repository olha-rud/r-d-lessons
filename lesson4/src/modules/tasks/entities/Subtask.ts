import { Task } from './Task';
import type { Status, Priority } from '../task.types';
import { validateParentTaskId } from '../validators';

export class Subtask extends Task {
    public parentTaskId: number;

    constructor(
        id: number,
        title: string,
        status: Status,
        priority: Priority,
        createdAt: string,
        parentTaskId: number,
        description: string | undefined = undefined,
        completedAt: string | undefined = undefined,
        deadline: string | undefined = undefined
    ) {
        super(id, title, status, priority, createdAt, description, completedAt, deadline);

        validateParentTaskId(parentTaskId);
        this.parentTaskId = parentTaskId;
    }

    getTaskInfo(): string {
        const baseInfo = super.getTaskInfo();
        return `📌 ${baseInfo} | Parent Task: #${this.parentTaskId}`;
    }
}