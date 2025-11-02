import { Task } from './Task';
import type { Status, Priority } from '../task.types';

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
    subtaskIds: number[] = []  // Масив ID підзавдань (за замовчуванням порожній)
  ) {
    super(id, title, status, priority, createdAt, description, completedAt, deadline);
    
    this.validateSubtaskIds(subtaskIds);
    this.subtaskIds = subtaskIds;
  }

  private validateSubtaskIds(subtaskIds: number[]): void {
    for (const id of subtaskIds) {
      if (id <= 0) {
        throw new Error('Subtask ID must be positive');
      }
    }
  }

  // Метод для отримання кількості підзавдань
  public getSubtaskCount(): number {
    return this.subtaskIds.length;
  }

  // Перевизначаємо метод getTaskInfo()
  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo();
    const count = this.getSubtaskCount();
    return `🎯 ${baseInfo} | Subtasks: ${count}`;
  }
}