-- AlterTable
ALTER TABLE "SecuritySession" ADD COLUMN     "recoveryPhrase" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "telegramChatId" TEXT,
ADD COLUMN     "telegramUsername" TEXT;
