import { Router } from "express";
import {
  createRepositoryController,
  indexingController,
  getRepositoriesController,
  getRepositoryByIdController,
  deleteRepositoryController,
} from "../controllers/repo.controller.js";

const repositoryRouter = Router()

repositoryRouter.post('/', createRepositoryController);
repositoryRouter.post('/index/:id', indexingController);
repositoryRouter.get('/', getRepositoriesController);
repositoryRouter.get('/:id', getRepositoryByIdController);
repositoryRouter.delete('/:id', deleteRepositoryController);

export default repositoryRouter;
