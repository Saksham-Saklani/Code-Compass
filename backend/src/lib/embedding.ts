import ollama from 'ollama'


// Generate Embeddings from Chunk Content
async function embedText(text: string): Promise<number[]> {
    const response = await ollama.embed({
        model: 'qwen3-embedding:0.6b',
        input: text
    })

    if (!response.embeddings || response.embeddings.length === 0) {
        throw new Error("Failed to generate embedding");
    }

    return response.embeddings[0]!

}

export { embedText }