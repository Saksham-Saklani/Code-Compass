-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('PENDING', 'INDEXING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL,
    "status" "RepositoryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);
