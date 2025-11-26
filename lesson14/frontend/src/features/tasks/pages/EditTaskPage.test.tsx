import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EditTaskPage } from "./EditTaskPage";
import * as taskApi from "../api";
import { MOCK_TASK, TEXT } from "../constants";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api");

describe("EditTaskPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    vi.mocked(taskApi.getUsers).mockResolvedValue([]);
  });

  const renderPage = (taskId: string = "1") => {
    return render(
      <MemoryRouter initialEntries={[`/tasks/${taskId}/edit`]}>
        <Routes>
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  describe("rendering", () => {
    it("should display loading state while fetching task", () => {
      vi.mocked(taskApi.getTaskById).mockImplementation(
        () => new Promise(() => {}),
      );

      renderPage("1");

      expect(screen.getByText(/Loading task.../i)).toBeInTheDocument();
    });

    it("should display edit task form when task is loaded", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

      renderPage("1");

      expect(await screen.findByText(TEXT.EDIT_TASK)).toBeInTheDocument();
      expect(screen.getByDisplayValue(MOCK_TASK.title)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(MOCK_TASK.description!),
      ).toBeInTheDocument();
    });

    it("should pre-populate form with task data", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

      renderPage("1");

      await waitFor(() => {
        expect(screen.getByDisplayValue(MOCK_TASK.title)).toBeInTheDocument();
        expect(
          screen.getByDisplayValue(MOCK_TASK.description!),
        ).toBeInTheDocument();
      });

      // Check that all form fields are populated
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(
        /description/i,
      ) as HTMLTextAreaElement;
      const prioritySelect = screen.getByLabelText(
        /priority/i,
      ) as HTMLSelectElement;
      const statusSelect = screen.getByLabelText(
        /status/i,
      ) as HTMLSelectElement;

      expect(titleInput.value).toBe(MOCK_TASK.title);
      expect(descInput.value).toBe(MOCK_TASK.description);
      expect(prioritySelect.value).toBe(MOCK_TASK.priority);
      expect(statusSelect.value).toBe(MOCK_TASK.status);
    });
  });

  describe("error handling", () => {
    it("should display error message when task fails to load", async () => {
      vi.mocked(taskApi.getTaskById).mockRejectedValue(
        new Error("Task not found"),
      );

      renderPage("999");

      expect(
        await screen.findByText(TEXT.FAILED_TO_LOAD_TASK),
      ).toBeInTheDocument();
    });

    it("should show back button when error occurs", async () => {
      vi.mocked(taskApi.getTaskById).mockRejectedValue(
        new Error("Task not found"),
      );

      renderPage("999");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: TEXT.BACK_TO_TASKS }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("navigation", () => {
    it("should navigate back to tasks when back button is clicked", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);
      const user = userEvent.setup();

      renderPage("1");

      await waitFor(() => {
        expect(screen.getByText(TEXT.EDIT_TASK)).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", {
        name: /back to task/i,
      });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks/1");
    });
  });

  describe("form rendering", () => {
    it("should render TaskForm component in edit mode with task data", async () => {
      vi.mocked(taskApi.getTaskById).mockResolvedValue(MOCK_TASK);

      renderPage("1");

      // Wait for form to be loaded
      await waitFor(() => {
        expect(screen.getByDisplayValue(MOCK_TASK.title)).toBeInTheDocument();
      });

      // Verify all form fields are populated
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(
        /description/i,
      ) as HTMLTextAreaElement;
      const prioritySelect = screen.getByLabelText(
        /priority/i,
      ) as HTMLSelectElement;
      const statusSelect = screen.getByLabelText(
        /status/i,
      ) as HTMLSelectElement;

      expect(titleInput.value).toBe(MOCK_TASK.title);
      expect(descInput.value).toBe(MOCK_TASK.description);
      expect(prioritySelect.value).toBe(MOCK_TASK.priority);
      expect(statusSelect.value).toBe(MOCK_TASK.status);

      // Verify form has edit mode elements
      expect(
        screen.getByRole("button", { name: TEXT.SAVE_CHANGES }),
      ).toBeInTheDocument();
    });
  });
});
