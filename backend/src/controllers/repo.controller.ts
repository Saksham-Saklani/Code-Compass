import type { Request, Response } from "express";
import { createRepository, saveChunks } from "../services/repo.service.js";
import prisma from "../lib/prisma.js";
import { indexingQueue } from "../queue/indexing.queue.js";

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

async function indexingController(req: Request,res: Response){
    try {
        const {id} = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid repository ID" });
        }
        const result = await indexingQueue.add('repo-job',{
          repoId: id,
        })
    
    return res
        .status(202)
        .json({ message: "Indexing job added to queue successfully" });
    } catch (error) {
        if(error instanceof Error){
            if(error.message === "Repository not found"){
                return res
                    .status(404)
                    .json({ message: "Repository not found" });
            }
        }
        return res
            .status(500)
            .json({ message: "Repository indexing failed", error });
    }
}

export { createRepositoryController, indexingController };
