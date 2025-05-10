/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminToCaller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdminToCaller" DROP CONSTRAINT "_AdminToCaller_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToCaller" DROP CONSTRAINT "_AdminToCaller_B_fkey";

-- AlterTable
ALTER TABLE "Caller" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "_AdminToCaller";
