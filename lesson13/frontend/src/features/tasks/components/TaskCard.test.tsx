import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { TaskCard } from "./TaskCard";
import type { Task } from "../types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TaskCard", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-01T00:00:00.000Z",
    deadline: "2024-12-31T00:00:00.000Z",
  };

  const renderCard = (task: Task = mockTask) => {
    return render(
      <BrowserRouter>
        <TaskCard task={task} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should display task title", () => {
      renderCard();

      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should display task description when provided", () => {
      renderCard();

      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should not display description when not provided", () => {
      const taskWithoutDescription: Task = {
        ...mockTask,
        description: undefined,
      };

      renderCard(taskWithoutDescription);

      expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    it("should display high priority badge correctly", () => {
      renderCard();

      expect(screen.getByText("🔴 High")).toBeInTheDocument();
    });

    it("should display medium priority badge correctly", () => {
      const mediumPriorityTask: Task = {
        ...mockTask,
        priority: "medium",
      };

      renderCard(mediumPriorityTask);

      expect(screen.getByText("🟡 Medium")).toBeInTheDocument();
    });

    it("should display low priority badge correctly", () => {
      const lowPriorityTask: Task = {
        ...mockTask,
        priority: "low",
      };

      renderCard(lowPriorityTask);

      expect(screen.getByText("🟢 Low")).toBeInTheDocument();
    });

    it("should display deadline when provided", () => {
      renderCard();

      expect(screen.getByText(/Dec 31/)).toBeInTheDocument();
    });

    it("should not display deadline when not provided", () => {
      const taskWithoutDeadline: Task = {
        ...mockTask,
        deadline: undefined,
      };

      renderCard(taskWithoutDeadline);

      expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should navigate to task detail page when clicked", async () => {
      const user = userEvent.setup();
      renderCard();

      const card = screen.getByText("Test Task").closest(".task-card");
      await user.click(card!);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks/1");
    });
  });
});
