import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types";
import "./TaskCard.css";

type TaskCardProps = {
  task: Task;
};

const PRIORITY_TEXT = {
  low: "🟢 Low",
  medium: "🟡 Medium",
  high: "🔴 High",
};

const PRIORITY_CLASS = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if mouse didn't move much (not a drag)
    if (mouseDownPos.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      if (dx > 5 || dy > 5) {
        // It was a drag, don't navigate
        return;
      }
    }
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div
      className="task-card"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      data-priority={task.priority}
    >
      <div className="task-title">{task.title}</div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}

      <div className="task-meta">
        <span className={`task-priority ${PRIORITY_CLASS[task.priority]}`}>
          {PRIORITY_TEXT[task.priority]}
        </span>
        {task.deadline && (
          <span className="task-date">📅 {formatDate(task.deadline)}</span>
        )}
        {task.assignee && (
          <span className="task-assignee">
            👤 {task.assignee.firstName} {task.assignee.lastName}
          </span>
        )}
      </div>
    </div>
  );
}
