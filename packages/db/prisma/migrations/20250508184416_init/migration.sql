-- CreateTable
CREATE TABLE "SecuritySession" (
    "id" TEXT NOT NULL,
    "securityCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecuritySession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecuritySession_securityCode_key" ON "SecuritySession"("securityCode");
