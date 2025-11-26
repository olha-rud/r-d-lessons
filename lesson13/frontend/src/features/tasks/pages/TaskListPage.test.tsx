import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TaskListPage } from "./TaskListPage";
import * as taskApi from "../api";
import { MOCK_TASKS, TEST_IDS, TEXT } from "../constants";

vi.mock("../api");

describe("TaskListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <BrowserRouter>
        <TaskListPage />
      </BrowserRouter>,
    );
  };

  describe("displaying tasks", () => {
    it("should display all tasks with correct fields", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

      renderPage();

      expect(await screen.findByText(MOCK_TASKS[0].title)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASKS[1].title)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASKS[2].title)).toBeInTheDocument();

      expect(screen.getByText(MOCK_TASKS[0].description!)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASKS[1].description!)).toBeInTheDocument();

      expect(screen.getByText(TEXT.HIGH)).toBeInTheDocument();
      expect(screen.getByText(TEXT.MEDIUM)).toBeInTheDocument();
    });

    it("should display kanban columns with correct titles", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

      renderPage();

      expect(await screen.findByText(TEXT.PENDING)).toBeInTheDocument();
      expect(screen.getByText(TEXT.IN_PROGRESS)).toBeInTheDocument();
      expect(screen.getByText(TEXT.COMPLETED)).toBeInTheDocument();

      expect(
        screen.getByTestId(TEST_IDS.KANBAN_COLUMN_PENDING),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(TEST_IDS.KANBAN_COLUMN_IN_PROGRESS),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(TEST_IDS.KANBAN_COLUMN_COMPLETED),
      ).toBeInTheDocument();
    });

    it("should display task count in column headers", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue(MOCK_TASKS);

      renderPage();

      expect(await screen.findByText(MOCK_TASKS[0].title)).toBeInTheDocument();

      const pendingColumn = screen.getByTestId(TEST_IDS.KANBAN_COLUMN_PENDING);
      const inProgressColumn = screen.getByTestId(
        TEST_IDS.KANBAN_COLUMN_IN_PROGRESS,
      );
      const completedColumn = screen.getByTestId(
        TEST_IDS.KANBAN_COLUMN_COMPLETED,
      );

      expect(pendingColumn).toBeInTheDocument();
      expect(inProgressColumn).toBeInTheDocument();
      expect(completedColumn).toBeInTheDocument();
    });
  });

  describe("empty and loading states", () => {
    it("should display empty state when task list is empty", async () => {
      vi.mocked(taskApi.getTasks).mockResolvedValue([]);

      renderPage();

      expect(await screen.findByText(TEXT.NO_TASKS)).toBeInTheDocument();
      expect(screen.getByText(TEXT.CREATE_FIRST_TASK)).toBeInTheDocument();
    });

    it("should display loading state initially", () => {
      vi.mocked(taskApi.getTasks).mockImplementation(
        () => new Promise(() => {}),
      );

      renderPage();

      expect(screen.getByText(TEXT.LOADING)).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should display error message when API fails", async () => {
      vi.mocked(taskApi.getTasks).mockRejectedValue(
        new Error("Failed to fetch tasks"),
      );

      renderPage();

      expect(
        await screen.findByText(TEXT.FAILED_TO_LOAD_TASKS),
      ).toBeInTheDocument();
    });
  });
});
