import ollama from "ollama";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function embedText(
  text: string | string[],
  isQuery = false,
): Promise<number[] | number[][]> {
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

    return response.embeddings.map((e) => {
      if(!e.values) throw new Error("Failed to generate embedding from Gemini: values missing");
      return e.values;
    });
  } else {
    const response = await ollama.embed({
      model: "qwen3-embedding:0.6b",
      input: text,
    });

    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error("Failed to generate embedding from Ollama");
    }

    return response.embeddings
  }
}

