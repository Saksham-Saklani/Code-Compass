import ollama from "ollama";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function embedText(
  text: string,
  isQuery = false,
): Promise<number[] > {
  if (isProduction) {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        taskType: isQuery ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
        outputDimensionality: 1536,
      },
    });

    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error("Failed to generate embedding from Gemini");
    }

    const embedding = response.embeddings[0];
    if (!embedding || !embedding.values) {
      throw new Error("Failed to generate embedding from Gemini: values missing");
    }

    return embedding.values;
  } else {
    const response = await ollama.embed({
      model: "qwen3-embedding:0.6b",
      input: text,
    });

    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error("Failed to generate embedding from Ollama");
    }

    const embedding = response.embeddings[0];
    if (!embedding) {
      throw new Error("Failed to generate embedding from Ollama: values missing");
    }
    return embedding;
  }
}

