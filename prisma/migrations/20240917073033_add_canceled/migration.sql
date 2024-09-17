-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('InComplete', 'Completed', 'Cancelled') NOT NULL DEFAULT 'InComplete';
