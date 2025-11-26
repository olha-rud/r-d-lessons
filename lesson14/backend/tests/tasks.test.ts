import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.model.js";
import Task from "../src/models/Task.model.js";

describe("Tasks API Integration Tests", () => {
  // =====================================================
  // GET /tasks - List all tasks
  // =====================================================
  describe("GET /tasks", () => {
    describe("Success scenarios (200)", () => {
      it("should return empty array when no tasks exist", async () => {
        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it("should return all tasks", async () => {
        await Task.bulkCreate([
          { title: "Task 1", description: "Description 1" },
          { title: "Task 2", description: "Description 2" },
          { title: "Task 3", description: "Description 3" },
        ]);

        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
      });

      it("should return tasks with default status and priority", async () => {
        await Task.create({ title: "Task 1", description: "Description 1" });

        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body[0].status).toBe("pending");
        expect(response.body[0].priority).toBe("medium");
      });

      it("should return tasks with assignee information", async () => {
        const user = await User.create({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        });

        await Task.create({
          title: "Task with assignee",
          description: "Description",
          assigneeId: user.id,
        });

        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body[0].assignee).toBeDefined();
        expect(response.body[0].assignee.firstName).toBe("John");
        expect(response.body[0].assignee.lastName).toBe("Doe");
        expect(response.body[0].assignee.email).toBe("john@example.com");
      });

      it("should filter tasks by status", async () => {
        await Task.bulkCreate([
          { title: "Task 1", description: "Desc 1", status: "pending" },
          { title: "Task 2", description: "Desc 2", status: "in-progress" },
          { title: "Task 3", description: "Desc 3", status: "completed" },
        ]);

        const response = await request(app).get("/tasks?status=pending");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].status).toBe("pending");
      });

      it("should filter tasks by priority", async () => {
        await Task.bulkCreate([
          { title: "Task 1", description: "Desc 1", priority: "low" },
          { title: "Task 2", description: "Desc 2", priority: "medium" },
          { title: "Task 3", description: "Desc 3", priority: "high" },
        ]);

        const response = await request(app).get("/tasks?priority=high");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].priority).toBe("high");
      });

      it("should filter tasks by multiple parameters", async () => {
        await Task.bulkCreate([
          {
            title: "Task 1",
            description: "Desc 1",
            status: "pending",
            priority: "high",
          },
          {
            title: "Task 2",
            description: "Desc 2",
            status: "pending",
            priority: "low",
          },
          {
            title: "Task 3",
            description: "Desc 3",
            status: "completed",
            priority: "high",
          },
        ]);

        const response = await request(app).get(
          "/tasks?status=pending&priority=high",
        );

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe("Task 1");
      });

      it("should filter tasks by createdAt date", async () => {
        const task = await Task.create({
          title: "Today's task",
          description: "Description",
        });

        const today = new Date().toISOString().split("T")[0];
        const response = await request(app).get(`/tasks?createdAt=${today}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toBe(task.id);
      });
    });

    describe("Error scenarios (400)", () => {
      it("should return 400 for invalid status filter", async () => {
        const response = await request(app).get("/tasks?status=invalid");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid priority filter", async () => {
        const response = await request(app).get("/tasks?priority=invalid");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid createdAt format", async () => {
        const response = await request(app).get(
          "/tasks?createdAt=invalid-date",
        );

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  // =====================================================
  // POST /tasks - Create a new task
  // =====================================================
  describe("POST /tasks", () => {
    describe("Success scenarios (201)", () => {
      it("should create a new task with required fields only", async () => {
        const response = await request(app).post("/tasks").send({
          title: "New Task",
          description: "Task description",
        });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.title).toBe("New Task");
        expect(response.body.description).toBe("Task description");
        expect(response.body.status).toBe("pending");
        expect(response.body.priority).toBe("medium");
        expect(response.body.assigneeId).toBeNull();
      });

      it("should create a task with custom status", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "Description",
          status: "in-progress",
        });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe("in-progress");
      });

      it("should create a task with custom priority", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "Description",
          priority: "high",
        });

        expect(response.status).toBe(201);
        expect(response.body.priority).toBe("high");
      });

      it("should create a task with all optional fields", async () => {
        const user = await User.create({
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        });

        const response = await request(app).post("/tasks").send({
          title: "Complete Task",
          description: "Full description",
          status: "completed",
          priority: "low",
          assigneeId: user.id,
        });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Complete Task");
        expect(response.body.description).toBe("Full description");
        expect(response.body.status).toBe("completed");
        expect(response.body.priority).toBe("low");
        expect(response.body.assigneeId).toBe(user.id);
      });

      it("should create a task with assigneeId set to null", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Unassigned Task",
          description: "Description",
          assigneeId: null,
        });

        expect(response.status).toBe(201);
        expect(response.body.assigneeId).toBeNull();
      });

      it("should set createdAt and updatedAt timestamps", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "Description",
        });

        expect(response.status).toBe(201);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
      });
    });

    describe("Error scenarios (400)", () => {
      it("should return 400 when title is missing", async () => {
        const response = await request(app).post("/tasks").send({
          description: "Description",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 when description is missing", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 when title is empty string", async () => {
        const response = await request(app).post("/tasks").send({
          title: "",
          description: "Description",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 when description is empty string", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid status value", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "Description",
          status: "invalid-status",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid priority value", async () => {
        const response = await request(app).post("/tasks").send({
          title: "Task",
          description: "Description",
          priority: "invalid-priority",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 when body is empty", async () => {
        const response = await request(app).post("/tasks").send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return error when body is not valid JSON", async () => {
        const response = await request(app)
          .post("/tasks")
          .set("Content-Type", "application/json")
          .send("invalid json");

        // Express returns 500 for JSON parse errors (handled by global error handler)
        expect([400, 500]).toContain(response.status);
      });
    });
  });

  // =====================================================
  // GET /tasks/:id - Get a single task
  // =====================================================
  describe("GET /tasks/:id", () => {
    describe("Success scenarios (200)", () => {
      it("should return task by id", async () => {
        const task = await Task.create({
          title: "Test Task",
          description: "Test Description",
        });

        const response = await request(app).get(`/tasks/${task.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(task.id);
        expect(response.body.title).toBe("Test Task");
        expect(response.body.description).toBe("Test Description");
      });

      it("should return task with all fields", async () => {
        const user = await User.create({
          firstName: "Bob",
          lastName: "Jones",
          email: "bob@example.com",
        });

        const task = await Task.create({
          title: "Full Task",
          description: "Full Description",
          status: "completed",
          priority: "high",
          assigneeId: user.id,
        });

        const response = await request(app).get(`/tasks/${task.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(task.id);
        expect(response.body.title).toBe("Full Task");
        expect(response.body.description).toBe("Full Description");
        expect(response.body.status).toBe("completed");
        expect(response.body.priority).toBe("high");
        expect(response.body.assigneeId).toBe(user.id);
        expect(response.body.assignee).toBeDefined();
        expect(response.body.assignee.firstName).toBe("Bob");
      });

      it("should return task without assignee when not assigned", async () => {
        const task = await Task.create({
          title: "Unassigned Task",
          description: "Description",
        });

        const response = await request(app).get(`/tasks/${task.id}`);

        expect(response.status).toBe(200);
        expect(response.body.assigneeId).toBeNull();
        expect(response.body.assignee).toBeNull();
      });
    });

    describe("Error scenarios (400)", () => {
      it("should return 400 for non-numeric id", async () => {
        const response = await request(app).get("/tasks/abc");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for id with special characters", async () => {
        const response = await request(app).get("/tasks/1a2b");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for negative id", async () => {
        const response = await request(app).get("/tasks/-1");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for decimal id", async () => {
        const response = await request(app).get("/tasks/1.5");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    describe("Error scenarios (404)", () => {
      it("should return 404 for non-existent task", async () => {
        const response = await request(app).get("/tasks/99999");

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Task not found");
      });

      it("should return 404 after task is deleted", async () => {
        const task = await Task.create({
          title: "Task to delete",
          description: "Description",
        });

        await task.destroy();

        const response = await request(app).get(`/tasks/${task.id}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Task not found");
      });
    });
  });

  // =====================================================
  // PUT /tasks/:id - Update a task
  // =====================================================
  describe("PUT /tasks/:id", () => {
    describe("Success scenarios (200)", () => {
      it("should update task title", async () => {
        const task = await Task.create({
          title: "Original Title",
          description: "Description",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ title: "Updated Title" });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Title");
        expect(response.body.description).toBe("Description");
      });

      it("should update task description", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Original Description",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ description: "Updated Description" });

        expect(response.status).toBe(200);
        expect(response.body.description).toBe("Updated Description");
      });

      it("should update task status", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Description",
          status: "pending",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ status: "completed" });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("completed");
      });

      it("should update task priority", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Description",
          priority: "medium",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ priority: "high" });

        expect(response.status).toBe(200);
        expect(response.body.priority).toBe("high");
      });

      it("should update task assigneeId", async () => {
        const user = await User.create({
          firstName: "Alice",
          lastName: "Brown",
          email: "alice@example.com",
        });

        const task = await Task.create({
          title: "Title",
          description: "Description",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ assigneeId: user.id });

        expect(response.status).toBe(200);
        expect(response.body.assigneeId).toBe(user.id);
      });

      it("should unassign task by setting assigneeId to null", async () => {
        const user = await User.create({
          firstName: "Charlie",
          lastName: "Davis",
          email: "charlie@example.com",
        });

        const task = await Task.create({
          title: "Title",
          description: "Description",
          assigneeId: user.id,
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ assigneeId: null });

        expect(response.status).toBe(200);
        expect(response.body.assigneeId).toBeNull();
      });

      it("should update multiple fields at once", async () => {
        const task = await Task.create({
          title: "Original",
          description: "Original",
          status: "pending",
          priority: "low",
        });

        const response = await request(app).put(`/tasks/${task.id}`).send({
          title: "Updated Title",
          description: "Updated Description",
          status: "in-progress",
          priority: "high",
        });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Title");
        expect(response.body.description).toBe("Updated Description");
        expect(response.body.status).toBe("in-progress");
        expect(response.body.priority).toBe("high");
      });

      it("should update updatedAt timestamp", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Description",
        });

        const originalUpdatedAt = task.updatedAt;

        await new Promise((resolve) => setTimeout(resolve, 10));

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ title: "New Title" });

        expect(response.status).toBe(200);
        expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
          new Date(originalUpdatedAt).getTime(),
        );
      });

      it("should preserve assigneeId after update", async () => {
        const user = await User.create({
          firstName: "David",
          lastName: "Wilson",
          email: "david@example.com",
        });

        const task = await Task.create({
          title: "Title",
          description: "Description",
          assigneeId: user.id,
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ title: "Updated" });

        expect(response.status).toBe(200);
        expect(response.body.assigneeId).toBe(user.id);
        expect(response.body.title).toBe("Updated");
      });
    });

    describe("Error scenarios (400)", () => {
      it("should return 400 for invalid id", async () => {
        const response = await request(app)
          .put("/tasks/invalid")
          .send({ title: "Updated" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid status value", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Description",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ status: "invalid-status" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for invalid priority value", async () => {
        const task = await Task.create({
          title: "Title",
          description: "Description",
        });

        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ priority: "invalid-priority" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    describe("Error scenarios (404)", () => {
      it("should return 404 for non-existent task", async () => {
        const response = await request(app)
          .put("/tasks/99999")
          .send({ title: "Updated" });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Task not found");
      });
    });
  });

  // =====================================================
  // DELETE /tasks/:id - Delete a task
  // =====================================================
  describe("DELETE /tasks/:id", () => {
    describe("Success scenarios (204)", () => {
      it("should delete task and return 204", async () => {
        const task = await Task.create({
          title: "Task to delete",
          description: "Description",
        });

        const response = await request(app).delete(`/tasks/${task.id}`);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });

      it("should verify task is deleted from database", async () => {
        const task = await Task.create({
          title: "Task to delete",
          description: "Description",
        });

        await request(app).delete(`/tasks/${task.id}`);

        const deletedTask = await Task.findByPk(task.id);
        expect(deletedTask).toBeNull();
      });

      it("should delete task with assignee", async () => {
        const user = await User.create({
          firstName: "Eve",
          lastName: "Taylor",
          email: "eve@example.com",
        });

        const task = await Task.create({
          title: "Assigned task",
          description: "Description",
          assigneeId: user.id,
        });

        const response = await request(app).delete(`/tasks/${task.id}`);

        expect(response.status).toBe(204);

        const deletedTask = await Task.findByPk(task.id);
        expect(deletedTask).toBeNull();

        const userStillExists = await User.findByPk(user.id);
        expect(userStillExists).not.toBeNull();
      });

      it("should not affect other tasks when deleting one", async () => {
        const task1 = await Task.create({
          title: "Task 1",
          description: "Description 1",
        });

        const task2 = await Task.create({
          title: "Task 2",
          description: "Description 2",
        });

        await request(app).delete(`/tasks/${task1.id}`);

        const remainingTask = await Task.findByPk(task2.id);
        expect(remainingTask).not.toBeNull();
        expect(remainingTask?.title).toBe("Task 2");
      });
    });

    describe("Error scenarios (400)", () => {
      it("should return 400 for non-numeric id", async () => {
        const response = await request(app).delete("/tasks/invalid");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      it("should return 400 for negative id", async () => {
        const response = await request(app).delete("/tasks/-5");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    describe("Error scenarios (404)", () => {
      it("should return 404 for non-existent task", async () => {
        const response = await request(app).delete("/tasks/99999");

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Task not found");
      });

      it("should return 404 when deleting same task twice", async () => {
        const task = await Task.create({
          title: "Task",
          description: "Description",
        });

        await request(app).delete(`/tasks/${task.id}`);

        const response = await request(app).delete(`/tasks/${task.id}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Task not found");
      });
    });
  });
});
