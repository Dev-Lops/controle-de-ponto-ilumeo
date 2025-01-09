/*
  Warnings:

  - You are about to drop the column `userId` on the `WorkSession` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `WorkSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkSession" DROP CONSTRAINT "WorkSession_userId_fkey";

-- AlterTable
ALTER TABLE "WorkSession" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
