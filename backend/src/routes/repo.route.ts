import { Router } from "express";
import { createRepositoryController, indexingController } from "../controllers/repo.controller.js";

const repositoryRouter = Router()

repositoryRouter.post('/', createRepositoryController);
repositoryRouter.post('/index/:id', indexingController)

export default repositoryRouter;
