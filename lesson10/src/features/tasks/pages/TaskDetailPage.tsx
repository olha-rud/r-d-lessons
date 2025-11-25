import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, deleteTask } from '../api/taskApi';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { Task } from '../types';
import './TaskDetailPage.css';

const PRIORITY_TEXT = {
  low: '🟢 Low Priority',
  medium: '🟡 Medium Priority',
  high: '🔴 High Priority',
};

const STATUS_TEXT = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function TaskDetailPage() {
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
      console.error('Error loading task:', err);
      setError('Failed to load task. It may have been deleted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(task.id);
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('❌ Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <div className="task-detail-page">
        <div className="loading">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-page">
        <button className="btn-back" onClick={() => navigate('/tasks')}>
          ← Back to Tasks
        </button>
        <ErrorMessage message={error || 'Task not found'} />
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <button className="btn-back" onClick={() => navigate('/tasks')}>
        ← Back to Tasks
      </button>

      <div className="task-detail-card">
        <div className="task-header">
          <h1>{task.title}</h1>
          <div className="task-badges">
            <span className={`status-badge status-${task.status}`}>
              {STATUS_TEXT[task.status]}
            </span>
            <span className={`priority-badge priority-${task.priority}`}>
              {PRIORITY_TEXT[task.priority]}
            </span>
          </div>
        </div>

        {task.description && (
          <div className="task-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </div>
        )}

        <div className="task-section">
          <h3>Details</h3>
          <div className="task-details">
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(task.createdAt)}</span>
            </div>
            {task.deadline && (
              <div className="detail-item">
                <span className="detail-label">Deadline:</span>
                <span className="detail-value">📅 {formatDate(task.deadline)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button className="btn-delete" onClick={handleDelete}>
            🗑️ Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}