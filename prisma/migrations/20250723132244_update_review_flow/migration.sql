/*
  Warnings:

  - You are about to drop the `ValidationTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "ValidationTask" DROP CONSTRAINT "ValidationTask_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "ValidationTask" DROP CONSTRAINT "ValidationTask_reviewerId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "skor" DROP NOT NULL,
ALTER COLUMN "rekomendasi" DROP NOT NULL;

-- DropTable
DROP TABLE "ValidationTask";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
