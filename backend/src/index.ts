import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
import repositoryRouter from "./routes/repo.route.js";
import "./worker/indexing.worker.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/health", healthRouter);
app.use("/api/repository", repositoryRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
