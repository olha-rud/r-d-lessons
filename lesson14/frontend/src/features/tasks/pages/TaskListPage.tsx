import { useState, useEffect, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, updateTask } from "../api";
import { TaskCard } from "../components/TaskCard";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorMessage } from "../../../shared/components/ErrorMessage";
import type { Task, Status } from "../types";
import "./TaskListPage.css";

const COLUMNS: { status: Status; title: string; icon: string }[] = [
  { status: "pending", title: "Pending", icon: "📋" },
  { status: "in-progress", title: "In Progress", icon: "⚙️" },
  { status: "review", title: "Review", icon: "👀" },
  { status: "completed", title: "Completed", icon: "✅" },
];

export function TaskListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksByStatus = (status: Status): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string | number) => {
    const id = String(taskId);
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Only reset if we're actually leaving the column (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDraggedTaskId(null);

    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => String(t.id) === taskId);

    if (!task || task.status === newStatus) {
      return;
    }

    // Optimistic update
    const previousStatus = task.status;
    setTasks((prevTasks) =>
      prevTasks.map((t) => (String(t.id) === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Error updating task status:", err);
      // Rollback on error
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          String(t.id) === taskId ? { ...t, status: previousStatus } : t,
        ),
      );
      setError("Failed to update task status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="task-list-page">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="task-list-page">
      <div className="page-header">
        <h1>My Tasks</h1>
        <button
          className="btn-create"
          onClick={() => navigate("/tasks/create")}
        >
          + Create Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          message="No tasks yet"
          description="Create your first task to get started"
        />
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            return (
              <div
                key={column.status}
                className="kanban-column"
                data-testid={`kanban-column-${column.status}`}
              >
                <div className="column-header">
                  <span className="column-icon">{column.icon}</span>
                  <h2 className="column-title">{column.title}</h2>
                  <span className="column-count">{columnTasks.length}</span>
                </div>
                <div
                  className={`column-content ${dragOverColumn === column.status ? "dragging-over" : ""}`}
                  onDragOver={(e) => handleDragOver(e, column.status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.status)}
                >
                  {columnTasks.length === 0 ? (
                    <div className="column-empty drop-zone">Drop here</div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`task-wrapper ${draggedTaskId === String(task.id) ? "dragging" : ""}`}
                      >
                        <TaskCard task={task} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
