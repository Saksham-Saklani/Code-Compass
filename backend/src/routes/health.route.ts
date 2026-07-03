import { checkHealth } from "../controllers/health.controller.js";
import { Router } from "express";

const healthRouter = Router();

healthRouter.get('/', checkHealth)

export default healthRouter;