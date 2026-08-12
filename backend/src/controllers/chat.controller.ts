import type { Request, Response } from "express";
import { AIChat } from "../services/chat.service.js";
import prisma from "../lib/prisma.js";

async function AIChatController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { query } = req.body;

    const repo = await prisma.repository.findFirst({
      where: {
        id: id as string,
      },
    });

    if (!repo) {
      res.status(404).json({ error: "Repository not found" });
      return;
    }

    if (repo.status !== "COMPLETED") {
      res.status(400).json({
        error: "Repository is not indexed yet. Please try again later.",
      });
      return;
    }

    if (typeof id !== "string" || typeof query !== "string") {
      res
        .status(400)
        .json({ error: "Invalid repoId or query. Both must be strings." });
      return;
    }

    const result = await AIChat(id, query);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of result.answer) {
      res.write(`data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: "sources", sources: result.sources })}\n\n`);


    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to chat with AI" });
  }
}

export { AIChatController };
