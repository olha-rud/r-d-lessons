import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../api";
import { TaskForm } from "../components/TaskForm";
import { ErrorMessage } from "../../../shared/components/ErrorMessage";
import type { Task } from "../types";
import "./EditTaskPage.css";

export function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTaskById(taskId);
      setTask(data);
    } catch (err) {
      console.error("Error loading task:", err);
      setError("Failed to load task. It may have been deleted.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate(`/tasks/${id}`);
  };

  if (isLoading) {
    return (
      <div className="edit-task-page">
        <div className="loading">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="edit-task-page">
        <button className="btn-back" onClick={() => navigate("/tasks")}>
          &larr; Back to Tasks
        </button>
        <ErrorMessage message={error || "Task not found"} />
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <button className="btn-back" onClick={() => navigate(`/tasks/${id}`)}>
        &larr; Back to Task
      </button>
      <TaskForm onSuccess={handleSuccess} task={task} mode="edit" />
    </div>
  );
}
