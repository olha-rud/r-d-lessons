import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask, getUsers } from "../api";
import { taskSchema, TaskFormData } from "../schemas/task.schema";
import type { User } from "../types";
import { useUser } from "../../../contexts/useUser";
import "./CreateTaskForm.css";

type CreateTaskFormProps = {
  onSuccess: () => void;
};

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useUser();

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      status: "pending",
      priority: "medium",
      assigneeId: null,
    },
  });

  // Set current user as default assignee when users are loaded
  useEffect(() => {
    if (currentUser && users.length > 0) {
      setValue("assigneeId", currentUser.id);
    }
  }, [currentUser, users.length, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setSubmitError(null);
      const taskData = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      await createTask(taskData);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating task:", error);
      setSubmitError("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Task</h2>
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
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">
              Priority <span className="required">*</span>
            </label>
            <select id="priority" {...register("priority")}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
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
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
