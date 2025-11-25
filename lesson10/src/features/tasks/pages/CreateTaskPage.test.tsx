import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CreateTaskPage } from './CreateTaskPage';
import { ROUTES, TEXT } from '../сonstants';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateTaskPage', () => {
  const renderPage = () => {
    return render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>
    );
  };

  it('should render create task form', () => {
    renderPage();

    expect(screen.getByText(TEXT.CREATE_NEW_TASK)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    const user = userEvent.setup();

    renderPage();

    const backButton = screen.getByRole('button', { name: TEXT.BACK_TO_TASKS });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
  });
});