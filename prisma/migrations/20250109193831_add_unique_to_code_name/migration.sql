/*
  Warnings:

  - A unique constraint covering the columns `[code_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "code_name" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_code_name_key" ON "User"("code_name");
