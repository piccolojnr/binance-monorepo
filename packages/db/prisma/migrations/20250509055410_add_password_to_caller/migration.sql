-- AlterTable
ALTER TABLE "SecuritySession" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "callerId" TEXT;

-- CreateTable
CREATE TABLE "Caller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Caller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Caller_email_key" ON "Caller"("email");

-- AddForeignKey
ALTER TABLE "SecuritySession" ADD CONSTRAINT "SecuritySession_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "Caller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
