/*
  Warnings:

  - Made the column `code_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "code_name" SET NOT NULL;
