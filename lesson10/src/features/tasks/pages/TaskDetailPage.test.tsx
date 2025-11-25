import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TaskDetailPage } from './TaskDetailPage';
import * as taskApi from '../api/taskApi';
import { MOCK_TASK, ROUTES, TEXT } from '../сonstants';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/taskApi');

describe('TaskDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = (taskId: string = '1') => {
    return render(
      <MemoryRouter initialEntries={[ROUTES.TASK_DETAIL(taskId)]}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should display task details correctly', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByText(MOCK_TASK.title)).toBeInTheDocument();
    });

    expect(screen.getByText(MOCK_TASK.description!)).toBeInTheDocument();
    expect(screen.getByText(TEXT.HIGH_PRIORITY)).toBeInTheDocument();
    expect(screen.getByText(TEXT.TODO)).toBeInTheDocument();
  });

  it('should display error message when task is not found', async () => {
    vi.mocked(taskApi.getTaskById).mockRejectedValue(
      new Error('Task not found')
    );

    renderPage('999');

    await waitFor(() => {
      expect(screen.getByText(TEXT.FAILED_TO_LOAD_TASK)).toBeInTheDocument();
    });
  });

  it('should navigate back to task list when back button is clicked', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);
    const user = userEvent.setup();

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByText(MOCK_TASK.title)).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: TEXT.BACK_TO_TASKS });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
  });

  it('should show confirmation dialog and delete task when delete button is clicked', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);
    vi.mocked(taskApi.deleteTask).mockResolvedValue();
    
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    const user = userEvent.setup();

    renderPage('1');

    await waitFor(() => {
      expect(screen.getByText(MOCK_TASK.title)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: TEXT.DELETE_TASK });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(taskApi.deleteTask).toHaveBeenCalledWith('1');
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
    });

    confirmSpy.mockRestore();
  });
});