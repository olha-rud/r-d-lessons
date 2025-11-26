import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask, updateTask, getUsers } from "../api";
import { taskSchema, TaskFormData } from "../schemas/task.schema";
import type { Task, User } from "../types";
import { useUser } from "../../../contexts/useUser";
import "./TaskForm.css";

type TaskFormProps = {
  onSuccess: () => void;
  task?: Task;
  mode?: "create" | "edit";
};

export function TaskForm({ onSuccess, task, mode = "create" }: TaskFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useUser();
  const isEditMode = mode === "edit" && task;

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: isEditMode
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          deadline: task.deadline ? task.deadline.split("T")[0] : "",
          assigneeId: task.assigneeId ?? null,
        }
      : {
          title: "",
          description: "",
          status: "pending",
          priority: "medium",
          deadline: "",
          assigneeId: null,
        },
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
        assigneeId: task.assigneeId ?? null,
      });
    } else if (currentUser && users.length > 0) {
      // Set current user as default assignee in create mode
      setValue("assigneeId", currentUser.id);
    }
  }, [task, isEditMode, currentUser, reset, setValue, users.length]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setSubmitError(null);

      if (isEditMode) {
        await updateTask(task.id, data);
      } else {
        const taskData = {
          ...data,
          createdAt: new Date().toISOString(),
        };
        await createTask(taskData);
        reset();
      }

      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} task:`,
        error,
      );
      setSubmitError(
        `Failed to ${isEditMode ? "update" : "create"} task. Please try again.`,
      );
    }
  };

  const isSubmitDisabled = isEditMode
    ? !isValid || isSubmitting || !isDirty
    : !isValid || isSubmitting;

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>
      {submitError && (
        <div className="submit-error" role="alert">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className={errors.title ? "error" : ""}
            {...register("title")}
            placeholder="Enter task title"
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            placeholder="Add task description (optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select id="status" {...register("status")}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">
              Priority <span className="required">*</span>
            </label>
            <select id="priority" {...register("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              className={errors.deadline ? "error" : ""}
              {...register("deadline")}
            />
            {errors.deadline && (
              <span className="error-message">{errors.deadline.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="assigneeId">Assignee</label>
            <select
              id="assigneeId"
              {...register("assigneeId", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            >
              <option value="">Not assigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitDisabled}
        >
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Task"}
        </button>
      </form>
    </div>
  );
}
