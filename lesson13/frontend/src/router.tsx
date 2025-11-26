import { createBrowserRouter, Navigate } from 'react-router-dom';
import { TaskListPage } from './features/tasks/pages/TaskListPage';
import { TaskDetailPage } from './features/tasks/pages/TaskDetailPage';
import { CreateTaskPage } from './features/tasks/pages/CreateTaskPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/tasks" replace />,
  },
  {
    path: '/tasks',
    element: <TaskListPage />,
  },
  {
    path: '/tasks/create',
    element: <CreateTaskPage />,
  },
  {
    path: '/tasks/:id',
    element: <TaskDetailPage />,
  },
]);