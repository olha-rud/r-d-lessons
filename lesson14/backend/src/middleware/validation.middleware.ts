import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../constants/task.constants.js";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  assigneeId: z.number().nullable().optional(),
});

const updateTaskSchema = taskSchema.partial();

const filtersSchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  createdAt: z
    .string()
    .date("Invalid date format. Expected YYYY-MM-DD")
    .optional(),
});

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid task ID"),
});

export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const validation = taskSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.errors });
    return;
  }

  req.body = validation.data;
  next();
};

export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const validation = updateTaskSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.errors });
    return;
  }

  req.body = validation.data;
  next();
};

export const validateFilters = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const validation = filtersSchema.safeParse(req.query);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.errors });
    return;
  }

  next();
};

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const validation = idParamSchema.safeParse(req.params);

  if (!validation.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  next();
};
