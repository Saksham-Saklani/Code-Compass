import { embedText } from "../lib/embedding.js";
import prisma from "../lib/prisma.js";

async function saveEmbeddings(repoId: string){
    const chunks = await prisma.chunk.findMany({
        where:{
            repoId,
        }
    })

    for (const chunk of chunks) {
        const embedding = await embedText(chunk.content)
    }

    
}