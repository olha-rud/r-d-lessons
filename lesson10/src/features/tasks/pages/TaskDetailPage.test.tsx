import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TaskDetailPage } from './TaskDetailPage';
import * as taskApi from '../api/taskApi';
import type { Task } from '../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/taskApi');

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  createdAt: '2024-01-01T00:00:00.000Z',
  deadline: '2024-12-31T00:00:00.000Z',
};

describe('TaskDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (taskId: string = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should display task details correctly', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(mockTask);

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('🔴 High Priority')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('should display error message when task is not found', async () => {
    vi.mocked(taskApi.getTaskById).mockRejectedValue(
      new Error('Task not found')
    );

    renderWithRouter('999');

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load task/i)
      ).toBeInTheDocument();
    });
  });

  it('should navigate back to task list when back button is clicked', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(mockTask);
    const user = userEvent.setup();

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back to tasks/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('should show confirmation dialog and delete task when delete button is clicked', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(mockTask);
    vi.mocked(taskApi.deleteTask).mockResolvedValue();
    
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    const user = userEvent.setup();

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete task/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(taskApi.deleteTask).toHaveBeenCalledWith('1');
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });

    confirmSpy.mockRestore();
  });
});