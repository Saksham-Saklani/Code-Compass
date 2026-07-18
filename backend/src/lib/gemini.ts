import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface Context {
  chunkId: string;
  score: number;
  filePath: string;
  content: string;
}

// send file paths and contents to gemini with user query
export async function generateAnswer({
  query,
  chunks,
}: {
  query: string;
  chunks: Context[];
}): Promise<string> {
  const fileContent = chunks
    .map((chunk) => `File: ${chunk.filePath}\n${chunk.content}`)
    .join("\n---\n");

  const prompt = `
    You are an expert AI assistant for code analysis.
    Use the following context to answer the user's query.
    Only use the code provided in the context; do not invent or assume additional information.
    If the context does not contain the answer, respond with "I cannot answer this question based on the provided context."

    QUERY:
    ${query}

    CONTEXT:
    ${fileContent}
  `;

  const interaction = await client.interactions.create({
    model: "gemini-3-flash-preview",
    input: prompt,
  });

  return interaction.output_text ?? "Failed to generate";
}
