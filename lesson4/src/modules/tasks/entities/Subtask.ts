import { Task } from './Task';
import type { Status, Priority } from '../task.types';

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
    deadline: string | undefined = undefined,    
  ) {
    // Виклик конструктора батьківського класу
    super(id, title, status, priority, createdAt, description, completedAt, deadline);
    
    this.validateParentTaskId(parentTaskId);
    this.parentTaskId = parentTaskId;
    }

    private validateParentTaskId(parentTaskId: number): void {
    if (parentTaskId <= 0) {
      throw new Error('Parent task ID must be positive');
    }
  }

  // Перевизначаємо метод getTaskInfo()
  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo(); 
     return `📌 ${baseInfo} | Parent Task: #${this.parentTaskId}`;
  }
}