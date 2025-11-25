import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from './CreateTaskForm';
import * as taskApi from '../api';
import { TEXT } from '../constants';

vi.mock('../api');

describe('CreateTaskForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have submit button disabled when form is empty', () => {
      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('validation', () => {
    it('should enable submit button when form is valid', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });

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
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });

      await user.type(titleInput, 'a');
      await user.clear(titleInput);

      expect(await screen.findByText(TEXT.TITLE_REQUIRED)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should show error message when title is too long', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const titleInput = screen.getByLabelText(/title/i);
      const longTitle = 'a'.repeat(101);

      await user.type(titleInput, longTitle);

      expect(await screen.findByText(TEXT.TITLE_TOO_LONG)).toBeInTheDocument();
    });

    it('should accept title with exactly 100 characters', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });
      const exactTitle = 'a'.repeat(100);

      await user.type(titleInput, exactTitle);

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      expect(screen.queryByText(TEXT.TITLE_TOO_LONG)).not.toBeInTheDocument();
    });

    it('should show error message when deadline is in the past', async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const titleInput = screen.getByLabelText(/title/i);
      const deadlineInput = screen.getByLabelText(/deadline/i);

      await user.type(titleInput, 'New Task');
      await user.type(deadlineInput, '2020-01-01');

      expect(await screen.findByText(TEXT.DEADLINE_IN_PAST)).toBeInTheDocument();
    });
  });

  describe('submission', () => {
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
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });

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

    it('should reset form after successful submission', async () => {
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
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });

      await user.type(titleInput, 'New Task');

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(titleInput).toHaveValue('');
      });
    });
  });

  describe('error handling', () => {
    it('should show error message when API fails', async () => {
      const user = userEvent.setup();
      vi.mocked(taskApi.createTask).mockRejectedValue(new Error('API Error'));

      render(<CreateTaskForm onSuccess={mockOnSuccess} />);

      const titleInput = screen.getByLabelText(/title/i);
      const submitButton = screen.getByRole('button', { name: TEXT.CREATE_TASK });

      await user.type(titleInput, 'New Task');

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      await user.click(submitButton);

      expect(await screen.findByText(TEXT.FAILED_TO_CREATE_TASK)).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});