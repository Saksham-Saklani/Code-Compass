import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface Context {
  chunkId: string;
  score: number;
  filePath: string;
  content: string;
}

// send file paths and contents to gemini with user query
export async function* generateAnswer({
  query,
  chunks,
}: {
  query: string;
  chunks: Context[];
}) {
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

  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  
  for await (const part of response) {
    const partText = part.text || "";
    if (partText) {
      yield partText;
    }
  }
}
