/*
  Warnings:

  - The required column `id` was added to the `Timer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Timer_pkey" PRIMARY KEY ("id");
