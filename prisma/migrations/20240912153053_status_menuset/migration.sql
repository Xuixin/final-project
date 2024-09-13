-- AlterTable
ALTER TABLE `menuset` ADD COLUMN `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft';
