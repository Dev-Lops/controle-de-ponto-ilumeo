-- DropIndex
DROP INDEX "User_code_name_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "code_name" SET DEFAULT 'TEMP';
