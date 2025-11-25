import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaskListPage } from './TaskListPage';
import * as taskApi from '../api/taskApi';
import { MOCK_TASKS, TEST_IDS, TEXT } from '../сonstants';

vi.mock('../api/taskApi');

describe('TaskListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>
    );
  };

  it('should display all tasks with correct fields', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(MOCK_TASKS[0].title)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASKS[1].title)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASKS[2].title)).toBeInTheDocument();
    });

    expect(screen.getByText(MOCK_TASKS[0].description!)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TASKS[1].description!)).toBeInTheDocument();

    expect(screen.getByText(TEXT.HIGH)).toBeInTheDocument();
    expect(screen.getByText(TEXT.MEDIUM)).toBeInTheDocument();
  });

  it('should display kanban columns with correct titles', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(TEXT.TODO)).toBeInTheDocument();
      expect(screen.getByText(TEXT.IN_PROGRESS)).toBeInTheDocument();
      expect(screen.getByText(TEXT.DONE)).toBeInTheDocument();
    });

    expect(screen.getByTestId(TEST_IDS.KANBAN_COLUMN_TODO)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.KANBAN_COLUMN_IN_PROGRESS)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.KANBAN_COLUMN_DONE)).toBeInTheDocument();
  });

  it('should display task count in column headers', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(MOCK_TASKS[0].title)).toBeInTheDocument();
    });

    const todoColumn = screen.getByTestId(TEST_IDS.KANBAN_COLUMN_TODO);
    const inProgressColumn = screen.getByTestId(TEST_IDS.KANBAN_COLUMN_IN_PROGRESS);
    const doneColumn = screen.getByTestId(TEST_IDS.KANBAN_COLUMN_DONE);

    expect(todoColumn).toBeInTheDocument();
    expect(inProgressColumn).toBeInTheDocument();
    expect(doneColumn).toBeInTheDocument();
  });

  it('should display empty state when task list is empty', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(TEXT.NO_TASKS)).toBeInTheDocument();
    });

    expect(screen.getByText(TEXT.CREATE_FIRST_TASK)).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    vi.mocked(taskApi.getTasks).mockRejectedValue(
      new Error('Failed to fetch tasks')
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(TEXT.FAILED_TO_LOAD_TASKS)).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    vi.mocked(taskApi.getTasks).mockImplementation(
      () => new Promise(() => {})
    );

    renderPage();

    expect(screen.getByText(TEXT.LOADING)).toBeInTheDocument();
  });
});