import type { Request, Response } from "express";
import { createRepository } from "../services/repo.service.js";

async function createRepositoryController(req: Request, res: Response) {
  try {
    const { url } = req.body;
    const repository = await createRepository(url);
    return res
      .status(201)
      .json({ message: "Repository created successfully", repository });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Repository already exists"
      ) {
        return res
          .status(409)
          .json({ message: "Repository already exists" });
      }
    }
    return res.status(500).json({ message: "Repository creation failed", error});
  }
}

export { createRepositoryController };
