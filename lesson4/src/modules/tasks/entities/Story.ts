import { Task } from './Task';
import type { Status, Priority } from '../task.types';
import { validateStoryPoints } from '../validators';

export class Story extends Task {
    public storyPoints: number | undefined;

    constructor(
        id: number,
        title: string,
        status: Status,
        priority: Priority,
        createdAt: string,
        description: string | undefined = undefined,
        completedAt: string | undefined = undefined,
        deadline: string | undefined = undefined,
        storyPoints?: number
    ) {
        super(id, title, status, priority, createdAt, description, completedAt, deadline);

        validateStoryPoints(storyPoints);
        this.storyPoints = storyPoints;
    }

    getTaskInfo(): string {
        const baseInfo = super.getTaskInfo();
        return `📖 ${baseInfo}${this.storyPoints ? ` | Story Points: ${this.storyPoints}` : ''}`;
    }
}