/*
  Warnings:

  - You are about to drop the column `deletedNow` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedNow",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
