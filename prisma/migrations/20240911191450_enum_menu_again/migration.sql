/*
  Warnings:

  - You are about to drop the column `status` on the `menuset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft';

-- AlterTable
ALTER TABLE `menuset` DROP COLUMN `status`;
