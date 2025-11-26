import request from "supertest";
import app from "../app.js";
import User from "../models/User.model.js";

describe("Tasks API", () => {
  describe("GET /tasks", () => {
    it("should return empty array when no tasks", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return 400 for invalid status filter", async () => {
      const response = await request(app).get("/tasks?status=invalid");

      expect(response.status).toBe(400);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
          description: "Test description",
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Test task");
      expect(response.body.status).toBe("pending");
      expect(response.body.priority).toBe("medium");
    });

    it("should return 400 when title is missing", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          description: "Test description",
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 when description is missing", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
          description: "Test description",
        });

      const taskId = createResponse.body.id;

      const response = await request(app).get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).get("/tasks/99999");

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid id", async () => {
      const response = await request(app).get("/tasks/invalid");

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update task", async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
          description: "Test description",
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({
          title: "Updated title",
          status: "completed",
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated title");
      expect(response.body.status).toBe("completed");
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app)
        .put("/tasks/99999")
        .send({
          title: "Updated title",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete task", async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
          description: "Test description",
        });

      const taskId = createResponse.body.id;

      const response = await request(app).delete(`/tasks/${taskId}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).delete("/tasks/99999");

      expect(response.status).toBe(404);
    });
  });

  describe("Task with assignee", () => {
    it("should create task with assignee", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

      const response = await request(app)
        .post("/tasks")
        .send({
          title: "Test task",
          description: "Test description",
          assigneeId: user.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.assigneeId).toBe(user.id);
    });
  });

  describe("GET /tasks with filters", () => {
    beforeEach(async () => {
      await request(app).post("/tasks").send({
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        priority: "high",
      });

      await request(app).post("/tasks").send({
        title: "Task 2",
        description: "Description 2",
        status: "completed",
        priority: "low",
      });
    });

    it("should filter by status", async () => {
      const response = await request(app).get("/tasks?status=pending");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe("pending");
    });

    it("should filter by priority", async () => {
      const response = await request(app).get("/tasks?priority=high");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].priority).toBe("high");
    });

    it("should filter by multiple params", async () => {
      const response = await request(app).get("/tasks?status=pending&priority=high");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
});