import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./TaskForm";
import * as taskApi from "../api";
import { TEXT, MOCK_TASK } from "../constants";
import type { Task } from "../types";

vi.mock("../api");

describe("TaskForm", () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create mode", () => {
    describe("initial state", () => {
      it("should render with 'Create New Task' heading", () => {
        render(<TaskForm onSuccess={mockOnSuccess} />);

        expect(screen.getByText(TEXT.CREATE_NEW_TASK)).toBeInTheDocument();
      });

      it("should have submit button disabled when form is empty", () => {
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });
        expect(submitButton).toBeDisabled();
      });

      it("should have empty title input", () => {
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toHaveValue("");
      });

      it("should have default values for status and priority", () => {
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const statusSelect = screen.getByLabelText(/status/i);
        const prioritySelect = screen.getByLabelText(/priority/i);

        expect(statusSelect).toHaveValue("pending");
        expect(prioritySelect).toHaveValue("medium");
      });
    });

    describe("validation", () => {
      it("should enable submit button when form is valid", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });

        expect(submitButton).toBeDisabled();

        await user.type(titleInput, "New Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });
      });

      it("should show error message when title is empty and touched", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });

        await user.type(titleInput, "a");
        await user.clear(titleInput);

        expect(await screen.findByText(TEXT.TITLE_REQUIRED)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });

      it("should show error message when title is too long", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const longTitle = "a".repeat(101);

        await user.type(titleInput, longTitle);

        expect(await screen.findByText(TEXT.TITLE_TOO_LONG)).toBeInTheDocument();
      });

      it("should accept title with exactly 100 characters", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });
        const exactTitle = "a".repeat(100);

        await user.type(titleInput, exactTitle);

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });
        expect(screen.queryByText(TEXT.TITLE_TOO_LONG)).not.toBeInTheDocument();
      });

      it("should show error message when deadline is in the past", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const deadlineInput = screen.getByLabelText(/deadline/i);

        await user.type(titleInput, "New Task");
        await user.type(deadlineInput, "2020-01-01");

        expect(
          await screen.findByText(TEXT.DEADLINE_IN_PAST),
        ).toBeInTheDocument();
      });
    });

    describe("submission", () => {
      it("should call createTask API and onSuccess when form is submitted", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.createTask).mockResolvedValue({
          id: "1",
          title: "New Task",
          status: "pending",
          priority: "medium",
          createdAt: "2024-01-01T00:00:00.000Z",
        });

        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });

        await user.type(titleInput, "New Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(taskApi.createTask).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "New Task",
              status: "pending",
              priority: "medium",
            }),
          );
          expect(mockOnSuccess).toHaveBeenCalled();
        });
      });

      it("should reset form after successful submission", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.createTask).mockResolvedValue({
          id: "1",
          title: "New Task",
          status: "pending",
          priority: "medium",
          createdAt: "2024-01-01T00:00:00.000Z",
        });

        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });

        await user.type(titleInput, "New Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(titleInput).toHaveValue("");
        });
      });

      it("should show error message when API fails", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.createTask).mockRejectedValue(new Error("API Error"));

        render(<TaskForm onSuccess={mockOnSuccess} />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.CREATE_TASK,
        });

        await user.type(titleInput, "New Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        expect(
          await screen.findByText(TEXT.FAILED_TO_CREATE_TASK),
        ).toBeInTheDocument();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const mockTask: Task = {
      ...MOCK_TASK,
      deadline: "2025-12-31",
    };

    describe("initial state", () => {
      it("should render with 'Edit Task' heading", () => {
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        expect(screen.getByText(TEXT.EDIT_TASK)).toBeInTheDocument();
      });

      it("should have submit button with 'Save Changes' text", () => {
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        expect(
          screen.getByRole("button", { name: TEXT.SAVE_CHANGES }),
        ).toBeInTheDocument();
      });

      it("should populate form with task data", () => {
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const statusSelect = screen.getByLabelText(/status/i);
        const prioritySelect = screen.getByLabelText(/priority/i);

        expect(titleInput).toHaveValue(mockTask.title);
        expect(descriptionInput).toHaveValue(mockTask.description);
        expect(statusSelect).toHaveValue(mockTask.status);
        expect(prioritySelect).toHaveValue(mockTask.priority);
      });

      it("should have submit button disabled when form has not changed", () => {
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });
        expect(submitButton).toBeDisabled();
      });
    });

    describe("validation", () => {
      it("should enable submit button when form is changed and valid", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        expect(submitButton).toBeDisabled();

        await user.clear(titleInput);
        await user.type(titleInput, "Updated Task Title");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });
      });

      it("should disable submit button when form is invalid", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.clear(titleInput);

        await waitFor(() => {
          expect(submitButton).toBeDisabled();
        });
        expect(await screen.findByText(TEXT.TITLE_REQUIRED)).toBeInTheDocument();
      });

      it("should show validation error for title exceeding 100 characters", async () => {
        const user = userEvent.setup();
        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const longTitle = "a".repeat(101);

        await user.clear(titleInput);
        await user.type(titleInput, longTitle);

        expect(await screen.findByText(TEXT.TITLE_TOO_LONG)).toBeInTheDocument();
      });
    });

    describe("submission", () => {
      it("should call updateTask API with task id and updated data", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockResolvedValue({
          ...mockTask,
          title: "Updated Task",
        });

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.clear(titleInput);
        await user.type(titleInput, "Updated Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(taskApi.updateTask).toHaveBeenCalledWith(
            mockTask.id,
            expect.objectContaining({
              title: "Updated Task",
            }),
          );
          expect(mockOnSuccess).toHaveBeenCalled();
        });
      });

      it("should not reset form after successful edit submission", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockResolvedValue({
          ...mockTask,
          title: "Updated Task",
        });

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.clear(titleInput);
        await user.type(titleInput, "Updated Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(mockOnSuccess).toHaveBeenCalled();
        });

        // Form should still have the updated value (not reset)
        expect(titleInput).toHaveValue("Updated Task");
      });

      it("should show error message when update API fails", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockRejectedValue(new Error("API Error"));

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const titleInput = screen.getByLabelText(/title/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.clear(titleInput);
        await user.type(titleInput, "Updated Task");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        expect(
          await screen.findByText(TEXT.FAILED_TO_UPDATE_TASK),
        ).toBeInTheDocument();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    describe("status change", () => {
      it("should allow changing task status", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockResolvedValue({
          ...mockTask,
          status: "completed",
        });

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const statusSelect = screen.getByLabelText(/status/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.selectOptions(statusSelect, "completed");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(taskApi.updateTask).toHaveBeenCalledWith(
            mockTask.id,
            expect.objectContaining({
              status: "completed",
            }),
          );
        });
      });

      it("should allow changing task status to review", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockResolvedValue({
          ...mockTask,
          status: "review",
        });

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const statusSelect = screen.getByLabelText(/status/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.selectOptions(statusSelect, "review");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(taskApi.updateTask).toHaveBeenCalledWith(
            mockTask.id,
            expect.objectContaining({
              status: "review",
            }),
          );
        });
      });

      it("should allow changing task priority", async () => {
        const user = userEvent.setup();
        vi.mocked(taskApi.updateTask).mockResolvedValue({
          ...mockTask,
          priority: "low",
        });

        render(<TaskForm onSuccess={mockOnSuccess} task={mockTask} mode="edit" />);

        const prioritySelect = screen.getByLabelText(/priority/i);
        const submitButton = screen.getByRole("button", {
          name: TEXT.SAVE_CHANGES,
        });

        await user.selectOptions(prioritySelect, "low");

        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(taskApi.updateTask).toHaveBeenCalledWith(
            mockTask.id,
            expect.objectContaining({
              priority: "low",
            }),
          );
        });
      });
    });
  });
});
