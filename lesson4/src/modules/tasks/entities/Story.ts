import { Task } from './Task';
import type { Status, Priority } from '../task.types';

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
    // Виклик конструктора батьківського класу
    super(id, title, status, priority, createdAt, description, completedAt, deadline);
    
    this.validateStoryPoints(storyPoints);
    this.storyPoints = storyPoints;
    }

    private validateStoryPoints(storyPoints?: number): void {
        if (storyPoints !== undefined && storyPoints <= 0) {
            throw new Error('Story points must be positive');
        }
    }

  // Перевизначаємо метод getTaskInfo()
  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo(); 
       return `📖 ${baseInfo}${this.storyPoints ? ` | Story Points: ${this.storyPoints}` : ''}`;
  }
}