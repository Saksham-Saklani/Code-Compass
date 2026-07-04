import { Router } from "express";
import { createRepositoryController } from "../controllers/repo.controller.js";

const repositoryRouter = Router()

repositoryRouter.post('/', createRepositoryController);

export default repositoryRouter;
