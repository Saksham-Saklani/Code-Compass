import { retrieveChunks } from "./repo.service.js";
import { generateAnswer } from "../lib/gemini.js";

async function AIChat(repoId: string, query: string, limit: number = 10) {
  const context = await retrieveChunks(repoId, query, limit);

  if (context.length === 0) {
    return {
      answer: "No relevant data found for your query in this repository.",
      sources: [],
    };
  }

  const answer = await generateAnswer({ query: query, chunks: context });

  const sources = context.map((c) => ({
    path: c.filePath,
    score: c.score,
  }));

  return {
    answer,
    sources,
  };
}

export { AIChat };
