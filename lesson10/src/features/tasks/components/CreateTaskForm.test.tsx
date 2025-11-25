import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from './CreateTaskForm';
import * as taskApi from '../api/taskApi';

vi.mock('../api/taskApi');

describe('CreateTaskForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have submit button disabled when form is empty', () => {
    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    expect(submitButton).toBeDisabled();

    await user.type(titleInput, 'New Task');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should show error message when title is empty and touched', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    // Type something then delete it to trigger validation
    await user.type(titleInput, 'a');
    await user.clear(titleInput);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    // Button should remain disabled
    expect(submitButton).toBeDisabled();
  });

  it('should show error message when title is too long', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByLabelText(/title/i);
    const longTitle = 'a'.repeat(101);

    await user.type(titleInput, longTitle);

    await waitFor(() => {
      expect(
        screen.getByText(/title must be less than 100 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('should show error message when deadline is in the past', async () => {
    const user = userEvent.setup();
    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByLabelText(/title/i);
    const deadlineInput = screen.getByLabelText(/deadline/i);

    await user.type(titleInput, 'New Task');
    await user.type(deadlineInput, '2020-01-01');

    await waitFor(() => {
      expect(
        screen.getByText(/deadline cannot be in the past/i)
      ).toBeInTheDocument();
    });
  });

  it('should call API and onSuccess when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    vi.mocked(taskApi.createTask).mockResolvedValue({
      id: '1',
      title: 'New Task',
      status: 'todo',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00.000Z',
    });

    render(<CreateTaskForm onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task description');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(taskApi.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'Task description',
          status: 'todo',
          priority: 'medium',
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});