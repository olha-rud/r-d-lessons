import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TaskDetailPage } from "./TaskDetailPage";
import * as taskApi from "../api";
import { MOCK_TASK, ROUTES, TEXT } from "../constants";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api");

describe("TaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderPage = (taskId: string = "1") => {
    return render(
      <MemoryRouter initialEntries={[ROUTES.TASK_DETAIL(taskId)]}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  describe("displaying task details", () => {
    it("should display task details correctly", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

      renderPage("1");

      expect(await screen.findByText(MOCK_TASK.title)).toBeInTheDocument();
      expect(screen.getByText(MOCK_TASK.description!)).toBeInTheDocument();
      expect(screen.getByText(TEXT.HIGH_PRIORITY)).toBeInTheDocument();
      expect(screen.getByText(TEXT.PENDING)).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should display error message when task is not found", async () => {
      vi.mocked(taskApi.getTaskById).mockRejectedValue(
        new Error("Task not found"),
      );

      renderPage("999");

      expect(
        await screen.findByText(TEXT.FAILED_TO_LOAD_TASK),
      ).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should navigate back to task list when back button is clicked", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);
      const user = userEvent.setup();

      renderPage("1");

      expect(await screen.findByText(MOCK_TASK.title)).toBeInTheDocument();

      const backButton = screen.getByRole("button", {
        name: TEXT.BACK_TO_TASKS,
      });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
    });
  });

  describe("delete task", () => {
    it("should show confirmation dialog and delete task when confirmed", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);
      vi.mocked(taskApi.deleteTask).mockResolvedValue();

      const user = userEvent.setup();

      renderPage("1");

      expect(await screen.findByText(MOCK_TASK.title)).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", {
        name: TEXT.DELETE_TASK,
      });
      await user.click(deleteButton);

      expect(
        screen.getByRole("heading", { name: "Delete Task", level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete this task/),
      ).toBeInTheDocument();

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(taskApi.deleteTask).toHaveBeenCalledWith("1");
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.TASKS);
      });
    });

    it("should not delete task when confirmation is cancelled", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

      const user = userEvent.setup();

      renderPage("1");

      expect(await screen.findByText(MOCK_TASK.title)).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", {
        name: TEXT.DELETE_TASK,
      });
      await user.click(deleteButton);

      expect(
        screen.getByRole("heading", { name: "Delete Task", level: 2 }),
      ).toBeInTheDocument();

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      expect(taskApi.deleteTask).not.toHaveBeenCalled();
      expect(
        screen.queryByRole("heading", { name: "Delete Task", level: 2 }),
      ).not.toBeInTheDocument();
    });
  });
});
