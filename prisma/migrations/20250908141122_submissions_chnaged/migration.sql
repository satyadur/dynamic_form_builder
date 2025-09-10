/*
  Warnings:

  - You are about to drop the column `submission` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Form" DROP COLUMN "submission",
ADD COLUMN     "submissions" INTEGER NOT NULL DEFAULT 0;
