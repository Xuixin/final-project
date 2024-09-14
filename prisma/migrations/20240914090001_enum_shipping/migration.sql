/*
  Warnings:

  - You are about to alter the column `status` on the `shipping` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `shipping` MODIFY `status` ENUM('Pending', 'Shipped', 'Delivered') NOT NULL;
