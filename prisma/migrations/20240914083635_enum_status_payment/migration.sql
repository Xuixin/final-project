/*
  Warnings:

  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Completed';
