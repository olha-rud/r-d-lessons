import { Task } from './Task';
import type { Status, Priority } from '../task.types';

export class Bug extends Task {
  public severity: 'low' | 'medium' | 'high' | 'critical' | undefined;
  
  constructor(
    id: number,
    title: string,
    status: Status,
    priority: Priority,
    createdAt: string,
    description: string | undefined = undefined,
    completedAt: string | undefined = undefined,
    deadline: string | undefined = undefined,

    severity: 'low' | 'medium' | 'high' | 'critical' | undefined = undefined
  ) {
    // Виклик конструктора батьківського класу
    super(id, title, status, priority, createdAt, description, completedAt, deadline);
    
    this.validateSeverity(severity);
    this.severity = severity;
    }

    private validateSeverity(severity: 'low' | 'medium' | 'high' | 'critical' | undefined): void {
        if (severity === undefined) {
            return;
        }
        
        const validSeverities = ['low', 'medium', 'high', 'critical'];
            if (!validSeverities.includes(severity)) {
            throw new Error(`Invalid severity: ${severity}`);
        }
    }
  
  // Перевизначаємо метод getTaskInfo()
  getTaskInfo(): string {
    const baseInfo = super.getTaskInfo(); 
    return `🐛 ${baseInfo}${this.severity ? ` | Критичність: ${this.severity}` : ''}`;
  }
}