import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CreateTaskPage } from './CreateTaskPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateTaskPage', () => {
  it('should render create task form', () => {
    render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', { name: /back to tasks/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });
});