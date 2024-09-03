/*
  Warnings:

  - You are about to drop the column `slip` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `slip`,
    ADD COLUMN `transactionId` VARCHAR(191) NULL;
