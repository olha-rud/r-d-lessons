import { Task } from './Task';
import { Bug } from './Bug';
import { Subtask } from './Subtask';
import { Story } from './Story';
import { Epic } from './Epic';
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../../../constants';
import type { CreateAnyTaskData } from '../task.types';

export class TaskFactory {
  private currentId: number;

  constructor(startId: number = 1) {
    this.currentId = startId;
  }

  setStartId(id: number): void {
    this.currentId = id;
  }

  private generateId(): number {
    return this.currentId++;
  }

  private generateCreatedAt(): string {
    return new Date().toISOString();
  }

  create(data: CreateAnyTaskData): Task {
    const id = this.generateId();
    const createdAt = this.generateCreatedAt();
    const status = data.status ?? DEFAULT_STATUS;
    const priority = data.priority ?? DEFAULT_PRIORITY;

    switch (data.type) {
      case 'task':
        return new Task(
          id,
          data.title,
          status,
          priority,
          createdAt,
          data.description,
          data.completedAt,
          data.deadline
        );

      case 'bug':
        return new Bug(
          id,
          data.title,
          status,
          priority,
          createdAt,
          data.description,
          data.completedAt,
          data.deadline,
          data.severity
        );

      case 'subtask':
        return new Subtask(
          id,
          data.title,
          status,
          priority,
          createdAt,
          data.parentTaskId,
          data.description,
          data.completedAt,
          data.deadline
        );

      case 'story':
        return new Story(
          id,
          data.title,
          status,
          priority,
          createdAt,
          data.description,
          data.completedAt,
          data.deadline,
          data.storyPoints
        );

      case 'epic':
        return new Epic(
          id,
          data.title,
          status,
          priority,
          createdAt,
          data.description,
          data.completedAt,
          data.deadline,
          data.subtaskIds ?? []
        );

      default:
        const _exhaustiveCheck: never = data;
        throw new Error(`Unknown task type: ${_exhaustiveCheck}`);
    }
  }
}