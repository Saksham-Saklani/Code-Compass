import { extractRepoInfo, getRepoInfo } from "../lib/github.js";
import prisma from "../lib/prisma.js";

// save repository in database

async function createRepository(URL: string) {
    const { owner, repoName } = extractRepoInfo(URL);

    const { name, default_branch, html_url } = await getRepoInfo({ owner, repoName });

    const existingRepo = await prisma.repository.findFirst({
        where: {
            name: name
        }
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
            status: "PENDING"
        }
    });

    console.log(repository);
    return repository;
}

export { createRepository }
