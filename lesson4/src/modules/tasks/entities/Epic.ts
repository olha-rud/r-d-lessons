import { Task } from './Task';
import type { Status, Priority } from '../task.types';
import { validateSubtaskIds } from '../validators';

export class Epic extends Task {
    public subtaskIds: number[];

    constructor(
        id: number,
        title: string,
        status: Status,
        priority: Priority,
        createdAt: string,
        description: string | undefined = undefined,
        completedAt: string | undefined = undefined,
        deadline: string | undefined = undefined,
        subtaskIds: number[] = []
    ) {
        super(id, title, status, priority, createdAt, description, completedAt, deadline);

        validateSubtaskIds(subtaskIds);
        this.subtaskIds = subtaskIds;
    }

    public getSubtaskCount(): number {
        return this.subtaskIds.length;
    }

    getTaskInfo(): string {
        const baseInfo = super.getTaskInfo();
        const count = this.getSubtaskCount();
        return `🎯 ${baseInfo} | Subtasks: ${count}`;
    }
}