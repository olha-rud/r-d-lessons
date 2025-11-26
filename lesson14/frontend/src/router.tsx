import { createBrowserRouter, Navigate } from "react-router-dom";
import { TaskListPage } from "./features/tasks/pages/TaskListPage";
import { TaskDetailPage } from "./features/tasks/pages/TaskDetailPage";
import { CreateTaskPage } from "./features/tasks/pages/CreateTaskPage";
import { EditTaskPage } from "./features/tasks/pages/EditTaskPage";
import { AuthPage } from "./features/users/pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/tasks" replace />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <TaskListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/create",
    element: (
      <ProtectedRoute>
        <CreateTaskPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:id",
    element: (
      <ProtectedRoute>
        <TaskDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks/:id/edit",
    element: (
      <ProtectedRoute>
        <EditTaskPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Navigate to="/auth" replace />,
  },
]);
