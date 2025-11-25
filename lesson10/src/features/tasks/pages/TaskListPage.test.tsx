import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaskListPage } from './TaskListPage';
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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    createdAt: '2024-01-01T00:00:00.000Z',
    deadline: '2024-12-31T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'inProgress',
    priority: 'medium',
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('TaskListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display all tasks with correct fields', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    expect(screen.getByText('🔴 High')).toBeInTheDocument();
    expect(screen.getByText('🟡 Medium')).toBeInTheDocument();
  });

  it('should display empty state when task list is empty', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Create your first task to get started')
    ).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    vi.mocked(taskApi.getTasks).mockRejectedValue(
      new Error('Failed to fetch tasks')
    );

    render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load tasks. Please try again./i)
      ).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    vi.mocked(taskApi.getTasks).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });
});