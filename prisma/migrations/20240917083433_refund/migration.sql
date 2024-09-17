/*
  Warnings:

  - The values [Cancelled] on the enum `Payment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('InComplete', 'Completed', 'Refunded') NOT NULL DEFAULT 'InComplete';
