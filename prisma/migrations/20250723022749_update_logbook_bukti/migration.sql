/*
  Warnings:

  - The `bukti` column on the `LogbookEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LogbookEntry" DROP COLUMN "bukti",
ADD COLUMN     "bukti" JSONB;
