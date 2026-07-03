import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.use('/api/health', healthRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});