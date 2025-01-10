/*
  Warnings:

  - A unique constraint covering the columns `[code_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "code_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_code_name_key" ON "User"("code_name");
