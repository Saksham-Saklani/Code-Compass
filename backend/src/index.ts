import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
import repositoryRouter from "./routes/repo.route.js";
import "./worker/indexing.worker.js";
import chatRouter from "./routes/chat.route.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/health", healthRouter);
app.use("/api/repository", repositoryRouter);
app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
