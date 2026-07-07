import { get_encoding } from "tiktoken";

export interface ChunkOutput {
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

/**
 * Divides plaintext into tokenized chunks with a specified overlap.
 * 
 * @param text The plaintext source code or file content
 * @param maxTokens Maximum tokens per chunk (default: 500)
 * @param overlapTokens Number of tokens to overlap between chunks (default: 100)
 * @returns Array of ChunkOutput objects
 */
export function generateChunks(
    text: string, 
    maxTokens: number = 500, 
    overlapTokens: number = 100
): ChunkOutput[] {
    // We use the generic cl100k_base encoding as a fast, high-quality approximation for chunking
    const enc = get_encoding("cl100k_base");
    const tokens = enc.encode(text);
    
    const chunks: ChunkOutput[] = [];
    const step = maxTokens - overlapTokens;
    let chunkIndex = 0;

    // Handle edge case where file is empty
    if (tokens.length === 0) {
        enc.free();
        return [];
    }

    for (let i = 0; i < tokens.length; i += step) {
        const chunkTokens = tokens.slice(i, i + maxTokens);
        
        // tiktoken.decode returns a Uint8Array, we decode it to a JS string
        const chunkContent = new TextDecoder().decode(enc.decode(chunkTokens));

        chunks.push({
            content: chunkContent,
            chunkIndex,
            tokenCount: chunkTokens.length
        });
        
        chunkIndex++;
        
        // If we've reached the end of the tokens array, stop chunking
        if (i + maxTokens >= tokens.length) {
            break;
        }
    }

    // Free up WASM memory to prevent memory leaks
    enc.free();
    
    return chunks;
}
