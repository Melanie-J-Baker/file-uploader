/*
  Warnings:

  - You are about to drop the column `size_mb` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "size_mb",
ADD COLUMN     "size" TEXT NOT NULL DEFAULT "0 bytes";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");
