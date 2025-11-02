import { TaskService } from './task.service';
import type { Task, Status, Priority, CreateTaskSettings } from './task.types';

export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    handleGetTask(id: number){
        return this.taskService.getTaskDetails(id);
    }

    handleCreateTask(settings: CreateTaskSettings){
        return this.taskService.createNewTask(settings);
    }

    handleUpdateTask(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>){
        return this.taskService.updateTaskDetails(id, updates);
    }

    handleDeleteTask(id: number){
        return this.taskService.deleteTaskDetails(id);
    }

    handleFilterTasks(filters: {
        status?: Status;           
        priority?: Priority;       
        createdAfter?: string;     
        createdBefore?: string;    
    }){
        return this.taskService.filterTasks(filters);
    }

    handleCheckTaskDeadline(id: number){
        return this.taskService.isTaskOnTime(id);
    }
}