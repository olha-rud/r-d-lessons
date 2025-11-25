import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as taskService from "../services/task.service.js";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigneeId: z.number().nullable().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigneeId: z.number().nullable().optional(),
});

const filtersSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  createdAt: z.string().optional(),
});

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = filtersSchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const tasks = await taskService.getAllTasks(validation.data);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const task = await taskService.getTaskById(id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = taskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const task = await taskService.createTask(validation.data);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const validation = updateTaskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const task = await taskService.updateTask(id, validation.data);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};