import { TaskService } from './task.service';
import type { CreateAnyTaskData, TaskFilters, UpdateTaskSettings } from './task.types';
export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    handleGetTask(id: number){
        return this.taskService.getTaskDetails(id);
    }

   handleCreateTask(data: CreateAnyTaskData) {
    return this.taskService.createTask(data);
}

    handleUpdateTask(id: number, updates: UpdateTaskSettings){
        return this.taskService.updateTaskDetails(id, updates);
    }

    handleDeleteTask(id: number){
        return this.taskService.deleteTaskDetails(id);
    }

    handleFilterTasks(filters: TaskFilters){ 
        return this.taskService.filterTasks(filters);
    }

    handleCheckTaskDeadline(id: number){
        return this.taskService.isTaskOnTime(id);
    }
}