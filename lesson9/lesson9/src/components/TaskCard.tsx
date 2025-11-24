import type { Task } from '../types/task.types';
import './TaskCard.css';

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
};

const PRIORITY_TEXT = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🔴 High',
};

const PRIORITY_CLASS = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div className="task-card" data-priority={task.priority}>
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
      </div>

      <div className="task-actions">
        <button
          className="btn-delete"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}