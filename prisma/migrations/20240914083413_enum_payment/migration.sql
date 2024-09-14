/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `transactionId`,
    ADD COLUMN `method` ENUM('Cash', 'PayPal') NOT NULL DEFAULT 'PayPal';
