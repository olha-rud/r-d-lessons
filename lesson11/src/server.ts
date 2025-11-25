import express from "express";
import cors from "cors";
import morgan from "morgan";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check / root route
app.get("/", (req, res) => {
  res.json({ message: "Task API is running", endpoints: ["/tasks"] });
});

// Routes
app.use("/tasks", taskRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});