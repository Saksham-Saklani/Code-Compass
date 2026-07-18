import {
  extractRepoInfo,
  getRepoInfo,
  getRepoTree,
  downloadBlob,
} from "../lib/github.js";
import { filterFiles } from "../lib/fileFilter.js";
import { generateChunks } from "../lib/chunker.js";
import { embedText } from "../lib/embedding.js";
import prisma from "../lib/prisma.js";
import { qdrant } from "../lib/qdrant.js";
import { generateAnswer } from "../lib/gemini.js";
import type { Context } from "../lib/gemini.js";

// save repository in database
async function createRepository(URL: string) {
  const { owner, repoName } = extractRepoInfo(URL);

  const { name, default_branch, html_url } = await getRepoInfo({
    owner,
    repoName,
  });

  const existingRepo = await prisma.repository.findFirst({
    where: {
      name: name,
    },
  });

  if (existingRepo) {
    throw new Error("Repository already exists");
  }

  const repository = await prisma.repository.create({
    data: {
      name,
      defaultBranch: default_branch,
      url: html_url,
      owner,
      status: "PENDING",
    },
  });

  console.log(repository);
  return repository;
}

// process repository: fetch, filter, chunk, embed, and save chunks into database
async function saveChunks(repoId: string) {
  const repository = await prisma.repository.findFirst({
    where: {
      id: repoId,
    },
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  const { owner, defaultBranch } = repository;
  const repoName = repository.name;

  console.log(`Fetching repository tree for ${owner}/${repoName}...`);
  const tree = await getRepoTree(owner, repoName, defaultBranch);

  console.log("Filtering files...");
  const filteredTree = filterFiles(tree);
  console.log(`Filtered down to ${filteredTree.length} files to process.`);

  // Testing only: limit to 3 files to avoid OOM
  // const filesToProcess = filteredTree.slice(4, 8);

  let allChunks = [];

  for (const file of filteredTree) {
    try {
      console.log(`Processing file: ${file.path}`);
      const content = await downloadBlob(owner, repoName, file);

      const chunks = generateChunks(content);

      for (const chunk of chunks) {
        // Generate embedding for the chunk
        // const embedding = await embedText(chunk.content);

        allChunks.push({
          repoId,
          content: chunk.content,
          filePath: file.path || "",
          chunkIndex: chunk.chunkIndex,
          tokenCount: chunk.tokenCount,
          // Note: embedding is calculated but not saved here yet because the Prisma
          // schema does not currently have an 'embedding' column in the Chunk model.
        });
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
    }
  }

  if (allChunks.length === 0) {
    console.log("No chunks generated. Skipping database insertion.");
    return { count: 0 };
  }

  // Save all processed chunks to database
  const result = await prisma.chunk.createMany({
    data: allChunks.map((c) => ({
      repoId: c.repoId,
      content: c.content,
      filePath: c.filePath,
      chunkIndex: c.chunkIndex,
      tokenCount: c.tokenCount,
    })),
  });

  console.log(`Successfully saved ${result.count} chunks for repo ${repoId}`);

  return result;
}

// semantic search and rag pipeline
async function searchRepository(
  repoId: string,
  query: string,
  limit: number = 5,
) {
  // 1. Embed the user query
  const queryVector = await embedText(query);

  // 2. Search Qdrant, filtering by the specific repository
  const searchResults = await qdrant.search("code_compass", {
    vector: queryVector,
    filter: {
      must: [
        {
          key: "repoId",
          match: {
            value: repoId,
          },
        },
      ],
    },
    limit,
  });

  // 3. Get chunk content from postgres
  const chunkIds = searchResults.map((result) => String(result.id));
  const chunks = await prisma.chunk.findMany({
    where: {
      id: {
        in: chunkIds,
      },
    },
  });

  // 4. store top K results (chunk IDs + scores + content)
  const context: Context[] = searchResults.map((result) => {
    const chunk = chunks.find((c) => c.id === String(result.id));
    return {
      chunkId: String(result.id),
      score: result.score,
      filePath: String(result.payload?.filePath),
      content: chunk?.content || "",
    };
  });

  // 5. send chunks and query to gemini
  const answer = await generateAnswer({ query: query, chunks: context });

  return answer;
}

export { createRepository, saveChunks, searchRepository };
