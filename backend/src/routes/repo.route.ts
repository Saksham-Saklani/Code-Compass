import { Router } from "express";
import {
  createRepositoryController,
  indexingController,
  getRepositoriesController,
  getRepositoryByIdController,
} from "../controllers/repo.controller.js";

const repositoryRouter = Router()

repositoryRouter.post('/', createRepositoryController);
repositoryRouter.post('/index/:id', indexingController);
repositoryRouter.get('/', getRepositoriesController);
repositoryRouter.get('/:id', getRepositoryByIdController);

export default repositoryRouter;
