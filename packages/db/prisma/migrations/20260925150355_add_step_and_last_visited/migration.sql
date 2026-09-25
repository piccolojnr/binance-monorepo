-- CreateEnum
CREATE TYPE "SessionStep" AS ENUM ('security', 'verify', 'confirm');

-- AlterTable
ALTER TABLE "SecuritySession" ADD COLUMN     "lastVisitedAt" TIMESTAMP(3),
ADD COLUMN     "step" "SessionStep";

