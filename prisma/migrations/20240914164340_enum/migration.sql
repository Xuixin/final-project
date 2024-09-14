/*
  Warnings:

  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('InComplete', 'Completed') NOT NULL DEFAULT 'InComplete';

-- AlterTable
ALTER TABLE `shipping` MODIFY `status` ENUM('Pending', 'Shipped', 'Delivered') NOT NULL DEFAULT 'Pending';
