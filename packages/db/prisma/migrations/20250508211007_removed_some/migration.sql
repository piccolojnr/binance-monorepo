/*
  Warnings:

  - You are about to drop the column `telegramChatId` on the `SecuritySession` table. All the data in the column will be lost.
  - You are about to drop the column `telegramUsername` on the `SecuritySession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SecuritySession" DROP COLUMN "telegramChatId",
DROP COLUMN "telegramUsername";
