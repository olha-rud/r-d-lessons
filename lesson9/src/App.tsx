import { useState, useEffect } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { Modal } from './components/Modal';
import { CreateTaskForm } from './components/CreateTaskForm';
import { getTasks, deleteTask } from './api/taskApi';
import type { Task } from './types/task.types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('❌ Failed to delete task');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Task Board</h1>
          <button
            className="btn-create"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Task
          </button>
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskBoard tasks={tasks} onDeleteTask={handleDeleteTask} />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateTaskForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
}

export default App;