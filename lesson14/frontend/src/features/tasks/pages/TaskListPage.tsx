import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../api";
import { TaskCard } from "../components/TaskCard";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorMessage } from "../../../shared/components/ErrorMessage";
import type { Task, Status } from "../types";
import "./TaskListPage.css";

const COLUMNS: { status: Status; title: string; icon: string }[] = [
  { status: "pending", title: "Pending", icon: "📋" },
  { status: "in-progress", title: "In Progress", icon: "⚙️" },
  { status: "completed", title: "Completed", icon: "✅" },
];

export function TaskListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <div className="column-content">
                  {columnTasks.length === 0 ? (
                    <div className="column-empty">No tasks</div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
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
