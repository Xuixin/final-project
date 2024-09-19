/*
  Warnings:

  - You are about to alter the column `status` on the `table` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `table` MODIFY `status` ENUM('available', 'occupied') NOT NULL DEFAULT 'available';
