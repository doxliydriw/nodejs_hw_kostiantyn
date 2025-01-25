import config from "config";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import httpLogger from "./middleware/httpLogger";
import userRouter from "./routes/userRouter";
import postRouter from "./routes/postRouter";
import { databaseService } from "./services/DatabaseService";
import logger from "./utils/logger"
const { log, warn, error } = logger("app");

const app = express();
const PORT = config.get<number>("app.port");
const HOSTNAME = config.get<string>("app.hostname");

// Middleware for JSON parsing
app.use(express.json());

// Custom Middleware
app.use(httpLogger);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Use the userRouter and set the base path to /api/v1/users
app.use("/api/v1/users", userRouter);

// Add the post router for /api/v1/posts
app.use( "/api/v1/posts", postRouter );

// Global error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
  error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, HOSTNAME, () => {
  log(`Server is running on http://${HOSTNAME}:${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

async function handleShutdown(signal: string): Promise<void> {
  log(`Received ${signal}. Closing postgreSQL connection...`);
  await databaseService.disconnect();
  log(`${signal} handled. Exiting process.`);
  process.exit(0);
}