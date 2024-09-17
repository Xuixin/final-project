-- AlterTable
ALTER TABLE `shipping` MODIFY `status` ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending';
