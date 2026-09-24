/*
  Warnings:

  - The `status` column on the `SecuritySession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `SecuritySession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('draft', 'pending', 'in_progress', 'completed', 'failed');

-- AlterTable
ALTER TABLE "SecuritySession" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'draft';
