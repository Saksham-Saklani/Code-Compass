import { Router } from "express";
import { AIChatController } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/repository/:id", AIChatController);

export default chatRouter;
