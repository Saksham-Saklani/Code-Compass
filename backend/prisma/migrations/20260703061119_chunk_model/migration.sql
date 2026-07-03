/*
  Warnings:

  - A unique constraint covering the columns `[owner,name]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Chunk" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_owner_name_key" ON "Repository"("owner", "name");

-- AddForeignKey
ALTER TABLE "Chunk" ADD CONSTRAINT "Chunk_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
