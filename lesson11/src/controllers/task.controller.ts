import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as taskService from "../services/task.service.js";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

const filtersSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  createdAt: z.string().optional(),
});

export const getTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validation = filtersSchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.issues });
      return;
    }

    const tasks = taskService.getAllTasks(validation.data);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const task = taskService.getTaskById(req.params.id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validation = taskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.issues });
      return;
    }

    const task = taskService.createTask(validation.data);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validation = updateTaskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.issues });
      return;
    }

    const task = taskService.updateTask(req.params.id, validation.data);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const deleted = taskService.deleteTask(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};