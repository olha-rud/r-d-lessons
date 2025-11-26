import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateFilters,
  validateIdParam,
} from "../middleware/validation.middleware.js";

const router = Router();

router.get("/", validateFilters, taskController.getTasks);
router.get("/:id", validateIdParam, taskController.getTask);
router.post("/", validateCreateTask, taskController.createTask);
router.put(
  "/:id",
  validateIdParam,
  validateUpdateTask,
  taskController.updateTask,
);
router.delete("/:id", validateIdParam, taskController.deleteTask);

export default router;
