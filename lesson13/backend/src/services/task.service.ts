import { Op, WhereOptions } from "sequelize";
import Task from "../models/Task.model.js";
import User from "../models/User.model.js";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilters,
} from "../types/task.types.js";

export const getAllTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const where: WhereOptions = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.createdAt) {
    where.createdAt = {
      [Op.gte]: new Date(filters.createdAt),
      [Op.lt]: new Date(
        new Date(filters.createdAt).getTime() + 24 * 60 * 60 * 1000,
      ),
    };
  }

  return Task.findAll({
    where,
    include: [{ model: User, as: "assignee" }],
  });
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  return Task.findByPk(id, {
    include: [{ model: User, as: "assignee" }],
  });
};

export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  return Task.create(data);
};

export const updateTask = async (
  id: number,
  data: UpdateTaskDto,
): Promise<Task | null> => {
  const task = await Task.findByPk(id);

  if (!task) {
    return null;
  }

  await task.update(data);
  return task;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const task = await Task.findByPk(id);

  if (!task) {
    return false;
  }

  await task.destroy();
  return true;
};
