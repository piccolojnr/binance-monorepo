/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Batch_name_key" ON "Batch"("name");
