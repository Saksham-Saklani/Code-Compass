import type { Request, Response } from "express";
import { createRepository, saveChunks, deleteRepository } from "../services/repo.service.js";
import prisma from "../lib/prisma.js";
import { indexingQueue } from "../queue/indexing.queue.js";

async function createRepositoryController(req: Request, res: Response) {
  try {
    const { url } = req.body;
    const repository = await createRepository(url);
    return res
      .status(201)
      .json({ message: "Repository created successfully", repository });
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message === "Repository already exists") {
        return res.status(409).json({ message: "Repository already exists" });
      }

      // Handle Octokit API errors (e.g. 404, 403)
      if (error.name === "HttpError" || "status" in error) {
        if (error.status === 404) {
          return res.status(404).json({
            message: "GitHub repository not found or is private. Only public repositories are supported.",
          });
        }
        if (error.status === 403) {
          return res.status(403).json({
            message: "GitHub API rate limit exceeded or access forbidden.",
          });
        }
      }

      // Return the specific error message (e.g. invalid URL format)
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Repository creation failed due to an unknown error" });
  }
}

async function indexingController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const result = await indexingQueue.add("repo-job", {
      repoId: id,
    });

    return res
      .status(202)
      .json({ message: "Indexing job added to queue successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Repository not found") {
        return res.status(404).json({ message: "Repository not found" });
      }
    }
    return res
      .status(500)
      .json({ message: "Repository indexing failed", error });
  }
}

async function getRepositoriesController(req: Request, res: Response) {
  try {
    const repositories = await prisma.repository.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(repositories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch repositories", error });
  }
}

async function getRepositoryByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const repository = await prisma.repository.findFirst({
      where: { id },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
    });
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    return res.status(200).json(repository);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch repository", error });
  }
}

async function deleteRepositoryController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    
    // Check if repository exists
    const repository = await prisma.repository.findUnique({ where: { id } });
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    await deleteRepository(id);
    return res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error("Delete repo error:", error);
    return res.status(500).json({ message: "Failed to delete repository", error });
  }
}

export {
  createRepositoryController,
  indexingController,
  getRepositoriesController,
  getRepositoryByIdController,
  deleteRepositoryController,
};
