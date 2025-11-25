import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '../api/taskApi';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { Task } from '../types';
import './TaskListPage.css';

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
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
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
          onClick={() => navigate('/tasks/create')}
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
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}